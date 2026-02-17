import { PrismaClient } from "@prisma/client";

// Configuration
const SOURCE_DB_URL = "postgresql://postgres:postgres2924@localhost:5432/strengthplus";
const DEST_DB_URL = "postgresql://neondb_owner:npg_MgVtH2aBbcF9@ep-dry-band-a11r6479.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

const sourcePrisma = new PrismaClient({
  datasources: { db: { url: SOURCE_DB_URL } },
});

const destPrisma = new PrismaClient({
  datasources: { db: { url: DEST_DB_URL } },
});

async function main() {
  console.log("🚀 Starting Exercise Migration...");
  console.log("Source: LocalDB");
  console.log("Destination: NeonDB");

  try {
    // 1. Fetch all exercises from source
    console.log("\n📥 Fetching exercises from source...");
    const exercises = await sourcePrisma.exercise.findMany();
    console.log(`✅ Found ${exercises.length} exercises.`);

    // 2. Insert into destination
    console.log("\n📤 Upserting to destination...");
    let successCount = 0;
    let failCount = 0;

    for (const exercise of exercises) {
      try {
        // We use upsert to avoid duplicates if run multiple times
        // We need to handle the case where createdByUserId might not exist in the destination.
        // For this script, we will try to insert as-is.
        
        // Remove relationships or unrelated fields if any (prisma returns exact model fields usually)
        // clean object just in case
        const { ...data } = exercise;

        await destPrisma.exercise.upsert({
          where: { id: exercise.id },
          update: data,
          create: data,
        });

        // console.log(`  + Migrated: ${exercise.name}`);
        process.stdout.write("."); // Progress dot
        successCount++;
      } catch (error) {
        process.stdout.write("x"); // Error indication
        console.error(`\n❌ Failed to migrate ${exercise.name} (${exercise.id}):`, error.message);
        
        // Optional: Retry without userId if it's a FK constraint error
        if (error.code === 'P2003' && exercise.createdByUserId) {
             console.log(`  -> Retrying without createdByUserId...`);
             try {
                 const { createdByUserId, ...dataWithoutUser } = exercise;
                 await destPrisma.exercise.upsert({
                    where: { id: exercise.id },
                    update: dataWithoutUser,
                    create: dataWithoutUser,
                 });
                 console.log(`  -> Recovered: ${exercise.name} (linked user remove)`);
                 successCount++;
             } catch (retryError) {
                 console.error(`  -> Retry failed:`, retryError.message);
                 failCount++;
             }
        } else {
             failCount++;
        }
      }
    }

    console.log(`\n\n✨ Migration Complete!`);
    console.log(`✅ Success: ${successCount}`);
    console.log(`❌ Failed: ${failCount}`);

  } catch (error) {
    console.error("\n❌ Critical Error:", error);
  } finally {
    await sourcePrisma.$disconnect();
    await destPrisma.$disconnect();
  }
}

main();
