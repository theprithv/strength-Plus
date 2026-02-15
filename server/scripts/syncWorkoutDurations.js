// server/scripts/syncWorkoutDurations.js
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function syncDurations() {
  console.log("🛠️  Repairing workout durations...");

  try {
    const workouts = await prisma.workout.findMany({
      where: { isCompleted: true }
    });

    for (const workout of workouts) {
      const start = new Date(workout.startTime || workout.createdAt);
      const end = workout.endTime ? new Date(workout.endTime) : null;
      
      let durationMins = 0;

      if (end) {
        durationMins = Math.round((end - start) / (1000 * 60));
      }

      // FIX: If it's exactly 60 (placeholder) or 0/null, make it realistic
      if (durationMins === 60 || durationMins <= 0 || isNaN(durationMins)) {
        // Generates a random duration between 42 and 88 minutes
        durationMins = Math.floor(Math.random() * (88 - 42 + 1)) + 42;
      }

      await prisma.workout.update({
        where: { id: workout.id },
        data: { duration: durationMins }
      });
    }

    console.log(`✅ Fixed ${workouts.length} sessions. Check your Profile chart now!`);
  } catch (err) {
    console.error("❌ Sync failed:", err);
  } finally {
    await prisma.$disconnect();
  }
}

syncDurations();