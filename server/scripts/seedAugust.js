import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const TARGET_EMAIL = "theprithv.2004@gmail.com";

// ✅ Force start from this date
const FORCE_START = new Date("2026-04-29T10:00:00Z");

const SPLITS = {
  1: "Push Day",
  2: "Pull Day",
  3: "Legs",
  4: "Push Day",
  5: "Pull Day",
  6: "Legs",
  0: null, // Sunday = rest
};

const SPLIT_MUSCLES = {
  "Push Day": ["chest", "shoulders", "triceps"],
  "Pull Day": ["lats", "upperback", "biceps", "lowerback"],
  "Legs":     ["quadriceps", "hamstrings", "glutes", "calves"],
};

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function main() {
  // 1. Find your real account
  const user = await prisma.user.findUnique({ where: { email: TARGET_EMAIL } });
  if (!user) {
    console.log(`❌ User not found: ${TARGET_EMAIL}`);
    return;
  }
  console.log(`👤 User: ${user.name} (${user.email})\n`);

  // 2. Clean up fake workouts from wrong deleted account
  const wrongUser = await prisma.user.findFirst({
    where: { email: "deleted_1777446517610@gmail.com" },
  });
  if (wrongUser) {
    const wrongWorkouts = await prisma.workout.findMany({
      where: { userId: wrongUser.id },
      select: { id: true },
    });
    if (wrongWorkouts.length > 0) {
      for (const w of wrongWorkouts) {
        await prisma.setLog.deleteMany({
          where: { workoutExercise: { workoutId: w.id } },
        });
        await prisma.workoutExercise.deleteMany({ where: { workoutId: w.id } });
      }
      await prisma.workout.deleteMany({ where: { userId: wrongUser.id } });
      console.log(`🗑️  Removed ${wrongWorkouts.length} wrongly-placed workouts from deleted account.\n`);
    }
  }

  // 3. Load all existing workout dates for this user (to avoid duplicates)
  const existingWorkouts = await prisma.workout.findMany({
    where: { userId: user.id },
    select: { date: true },
  });
  const existingDates = new Set(
    existingWorkouts.map((w) => new Date(w.date).toISOString().slice(0, 10))
  );
  console.log(`📦 User already has ${existingDates.size} workout dates in DB.\n`);

  // 4. Load exercises grouped by muscle
  const allExercises = await prisma.exercise.findMany();
  const byMuscle = {};
  for (const ex of allExercises) {
    const m = ex.primaryMuscle?.toLowerCase().replace(/\s+/g, "");
    if (!m) continue;
    if (!byMuscle[m]) byMuscle[m] = [];
    byMuscle[m].push(ex);
  }

  // 5. Clear today's cached AI insights so it regenerates fresh
  const today = new Date();
  today.setUTCHours(10, 0, 0, 0);
  const todayStr = today.toISOString().slice(0, 10);
  await prisma.userDailyInsight.deleteMany({
    where: { userId: user.id, date: todayStr },
  });
  console.log(`🗑️  Cleared today's (${todayStr}) AI insight cache.\n`);

  // 6. Loop from April 29 to today
  let current = new Date(FORCE_START);
  let created = 0;
  let skipped = 0;

  console.log(`📅 Filling workouts: 2026-04-29 → ${todayStr}\n`);

  while (current <= today) {
    const dateStr = current.toISOString().slice(0, 10);
    const dayOfWeek = current.getUTCDay();
    const splitName = SPLITS[dayOfWeek];

    if (!splitName) {
      console.log(`😴 ${dateStr} — Rest day (Sunday)`);
      current.setUTCDate(current.getUTCDate() + 1);
      continue;
    }

    // Skip if workout already exists for this date
    if (existingDates.has(dateStr)) {
      console.log(`⏩ ${dateStr} — Already has a workout, skipping.`);
      skipped++;
      current.setUTCDate(current.getUTCDate() + 1);
      continue;
    }

    // Pick exercises for this split
    const muscles = SPLIT_MUSCLES[splitName];
    let pool = [];
    for (const muscle of muscles) {
      pool.push(...(byMuscle[muscle] || []).slice(0, 3));
    }
    if (pool.length < 3) pool = allExercises.sort(() => 0.5 - Math.random()).slice(0, 5);
    const selected = pool.sort(() => 0.5 - Math.random()).slice(0, randomInt(4, 7));

    const workoutDate = new Date(current);
    const workout = await prisma.workout.create({
      data: {
        userId: user.id,
        splitName,
        date: workoutDate,
        startTime: workoutDate,
        endTime: new Date(workoutDate.getTime() + 75 * 60 * 1000),
        isCompleted: true,
        totalSets: 0,
        totalVolume: 0,
        totalReps: 0,
      },
    });

    let totalVolume = 0, totalSets = 0, totalReps = 0;

    for (let idx = 0; idx < selected.length; idx++) {
      const exercise = selected[idx];
      const we = await prisma.workoutExercise.create({
        data: { workoutId: workout.id, exerciseId: exercise.id, order: idx },
      });

      const isHeavy = ["barbell", "machine", "plate"].includes(
        exercise.equipment?.toLowerCase()
      );
      const weight = (isHeavy ? 55 : 12) + randomInt(0, 25);
      const setsCount = randomInt(3, 4);

      for (let s = 0; s < setsCount; s++) {
        const reps = randomInt(7, 12);
        await prisma.setLog.create({
          data: {
            workoutExerciseId: we.id,
            setNumber: s + 1,
            reps,
            weight,
            volume: reps * weight,
          },
        });
        totalVolume += reps * weight;
        totalSets++;
        totalReps += reps;
      }
    }

    await prisma.workout.update({
      where: { id: workout.id },
      data: { totalVolume, totalSets, totalReps },
    });

    console.log(`✅ ${dateStr} — ${splitName} (${selected.length} exercises, ${totalSets} sets)`);
    created++;

    current.setUTCDate(current.getUTCDate() + 1);
  }

  console.log(`\n${"=".repeat(50)}`);
  console.log(`🎉 Done!`);
  console.log(`   ✅ Created : ${created} new workouts`);
  console.log(`   ⏩ Skipped : ${skipped} (already existed)`);
  console.log(`   👤 Account : ${user.email}`);
  console.log(`\n🤖 Now open your dashboard — Claude will generate PERSONALIZED insights!`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
