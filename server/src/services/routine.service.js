import prisma from "../config/prisma.js";

export async function createRoutine(userId, data) {
  return prisma.routine.create({
    data: {
      userId,
      name: data.name,
      notes: data.notes || ""
    }
  });
}

export async function getRoutines(userId) {
  return prisma.routine.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" }
  });
}

export async function setCurrentRoutine(userId, routineId) {
  await prisma.routine.updateMany({
    where: { userId, isCurrent: true },
    data: { isCurrent: false }
  });

  await prisma.routine.update({
    where: { id: routineId },
    data: { isCurrent: true }
  });
}

export async function deleteRoutine(userId, routineId) {
  const routine = await prisma.routine.findFirst({
    where: { id: routineId, userId }
  });

  if (!routine) {
    throw new Error("Routine not found");
  }

  await prisma.routineSet.deleteMany({
    where: {
      routineExercise: {
        routineId
      }
    }
  });

  await prisma.routineExercise.deleteMany({
    where: { routineId }
  });

  return prisma.routine.delete({
    where: { id: routineId }
  });
}


export async function addExerciseToRoutine(userId, routineId, exerciseId, day = 1) {
  const routine = await prisma.routine.findFirst({
    where: { id: routineId, userId }
  });

  if (!routine) {
    throw new Error("Routine not found");
  }

  const count = await prisma.routineExercise.count({
    where: { routineId, day }
  });

  return prisma.routineExercise.create({
    data: {
      routineId,
      exerciseId,
      day,
      order: count + 1
    }
  });
}

export async function addSetToRoutineExercise(
  userId,
  routineExerciseId,
  targetReps,
  targetWeight
) {
  const routineExercise = await prisma.routineExercise.findFirst({
    where: {
      id: routineExerciseId,
      routine: { userId }
    }
  });

  if (!routineExercise) {
    throw new Error("Routine exercise not found");
  }

  return prisma.routineSet.create({
    data: {
      routineExerciseId,
      targetReps,
      targetWeight
    }
  });
}

