import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const users = await prisma.user.findMany({
  select: { id: true, name: true, email: true, createdAt: true }
});

console.log("\n===== ALL USERS IN DB =====");
users.forEach((u, i) => {
  console.log(`\n[${i + 1}] Name:     ${u.name}`);
  console.log(`    Email:    ${u.email}`);
  console.log(`    Provider: ${u.authProvider}`);
  console.log(`    Created:  ${u.createdAt}`);
  console.log(`    ID:       ${u.id}`);
});

// Also count workouts per user
for (const u of users) {
  const count = await prisma.workout.count({ where: { userId: u.id } });
  console.log(`\n  → ${u.email} has ${count} total workouts`);
}

await prisma.$disconnect();
