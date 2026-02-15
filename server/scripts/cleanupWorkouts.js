import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function cleanup() {
  try {
    // Date range to KEEP
    const keepRange = {
      gte: new Date("2026-01-17T00:00:00.000Z"),
      lt: new Date("2026-01-19T00:00:00.000Z"),
    };

    // 1. Find workouts to delete
    const workoutsToDelete = await prisma.workout.findMany({
      where: {
        NOT: {
          createdAt: keepRange,
        },
      },
      select: { id: true },
    });

    const workoutIds = workoutsToDelete.map(w => w.id);

    console.log("Workouts to delete:", workoutIds.length);

    if (workoutIds.length === 0) {
      console.log("Nothing to delete!");
      return;
    }

    // 2. Delete SetLogs first
    await prisma.setLog.deleteMany({
      where: {
        workoutExercise: {
          workoutId: { in: workoutIds },
        },
      },
    });

    console.log("Deleted related SetLogs");

    // 3. Delete WorkoutExercises
    await prisma.workoutExercise.deleteMany({
      where: {
        workoutId: { in: workoutIds },
      },
    });

    console.log("Deleted related WorkoutExercises");

    // 4. Finally delete Workouts
    const result = await prisma.workout.deleteMany({
      where: {
        id: { in: workoutIds },
      },
    });

    console.log("Deleted workouts count:", result.count);

  } catch (error) {
    console.error("Cleanup error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

cleanup();
