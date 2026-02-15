import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function cleanGhostData() {
  console.log("👻 Targeting Ghost Workouts (Jan 30, 2026 onwards)...");

  // 1. Find the IDs of the bad workouts
  const ghostWorkouts = await prisma.workout.findMany({
    where: {
      date: {
        gte: new Date("2026-01-30T00:00:00Z"),
      },
    },
    select: { id: true },
  });

  const workoutIds = ghostWorkouts.map((w) => w.id);

  if (workoutIds.length === 0) {
    console.log("✅ No ghost workouts found.");
    return;
  }

  console.log(`⚠️ Found ${workoutIds.length} workouts to delete.`);

  // 2. Delete SETS first (Grandchildren)
  const deletedSets = await prisma.setLog.deleteMany({
    where: {
      workoutExercise: {
        workoutId: { in: workoutIds },
      },
    },
  });
  console.log(`   - Deleted ${deletedSets.count} sets.`);

  // 3. Delete WORKOUT EXERCISES second (Children)
  const deletedExercises = await prisma.workoutExercise.deleteMany({
    where: {
      workoutId: { in: workoutIds },
    },
  });
  console.log(`   - Deleted ${deletedExercises.count} exercises.`);

  // 4. Delete WORKOUTS last (Parent)
  const deletedWorkouts = await prisma.workout.deleteMany({
    where: {
      id: { in: workoutIds },
    },
  });

  console.log(`✅ SUCCESS: Deleted ${deletedWorkouts.count} ghost workouts.`);
  console.log("   Refresh your app now!");

  await prisma.$disconnect();
}

cleanGhostData();