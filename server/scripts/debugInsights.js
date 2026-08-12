import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const TARGET_EMAIL = "theprithv.2004@gmail.com";

const user = await prisma.user.findUnique({ where: { email: TARGET_EMAIL } });
if (!user) { console.log("User not found"); process.exit(1); }

const now = new Date();
const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
const today = now.toISOString().slice(0, 10);

console.log(`\n👤 User: ${user.name}`);
console.log(`📅 Month start: ${startOfMonth.toISOString().slice(0, 10)}\n`);

// 1. Check cached insight in DB
const cached = await prisma.userDailyInsight.findFirst({ where: { userId: user.id, date: today } });
console.log("=== CACHED INSIGHT IN DB ===");
console.log(cached ? JSON.stringify(cached.insights, null, 2) : "None (will regenerate)");

// 2. Count this month's workouts
const workouts = await prisma.workout.findMany({
  where: { userId: user.id, date: { gte: startOfMonth } },
  include: { exercises: { include: { exercise: true, sets: true } } },
});
console.log(`\n=== WORKOUTS THIS MONTH: ${workouts.length} ===`);

// 3. Show set/rep data
let totalSets = 0, totalReps = 0;
const muscles = {};

workouts.forEach(w => {
  w.exercises.forEach(we => {
    const muscle = we.exercise?.primaryMuscle?.toLowerCase();
    const sets = we.sets?.length || 0;
    const reps = (we.sets || []).reduce((s, r) => s + (r.reps || 0), 0);
    totalSets += sets;
    totalReps += reps;
    if (muscle) {
      if (!muscles[muscle]) muscles[muscle] = { sets: 0, reps: 0 };
      muscles[muscle].sets += sets;
      muscles[muscle].reps += reps;
    }
  });
});

console.log(`Total sets across all workouts: ${totalSets}`);
console.log(`Total reps across all workouts: ${totalReps}`);
console.log(`\n=== MUSCLE BREAKDOWN ===`);
Object.entries(muscles).forEach(([m, v]) => {
  console.log(`  ${m}: ${v.sets} sets, ${v.reps} reps`);
});

// 4. Check one workout in detail
const sample = workouts[0];
if (sample) {
  console.log(`\n=== SAMPLE WORKOUT (${new Date(sample.date).toISOString().slice(0,10)}) ===`);
  sample.exercises.forEach(we => {
    console.log(`  Exercise: ${we.exercise?.name} | muscle: ${we.exercise?.primaryMuscle} | sets: ${we.sets?.length}`);
    we.sets?.slice(0, 2).forEach(s => console.log(`    Set ${s.setNumber}: ${s.reps} reps @ ${s.weight}kg`));
  });
}

// 5. Clear cached insight so it regenerates fresh
const del = await prisma.userDailyInsight.deleteMany({ where: { userId: user.id, date: today } });
console.log(`\n🗑️  Cleared ${del.count} cached insight(s) for today.`);

await prisma.$disconnect();
