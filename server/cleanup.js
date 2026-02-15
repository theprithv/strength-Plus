import prisma from "./src/config/prisma.js";

async function cleanup() {
  const result = await prisma.workout.updateMany({
    where: { isCompleted: false },
    data: { isCompleted: true },
  });

  console.log("Fixed workouts:", result.count);
  process.exit(0);
}

cleanup();
