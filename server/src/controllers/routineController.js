import * as routineService from "../services/routineService.js";
import prisma from "../config/prisma.js";

export async function createRoutine(req, res) {
  const routine = await routineService.createRoutine(req.user.id, req.body);
  res.json(routine);
}

export async function getRoutines(req, res) {
  const routines = await routineService.getRoutines(req.user.id);
  res.json(routines);
}

export async function setCurrentRoutine(req, res) {
  await routineService.setCurrentRoutine(req.user.id, req.params.id);
  res.json({ success: true });
}

export async function deleteRoutine(req, res) {
  await routineService.deleteRoutine(req.user.id, req.params.id);
  res.json({ success: true });
}

export async function addExerciseToRoutine(req, res) {
  try {
    const routineExercise = await routineService.addExerciseToRoutine(
      req.user.id,
      req.params.id,
      req.body.exerciseId
    );

    res.json(routineExercise);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

export async function addSetToRoutineExercise(req, res) {
  try {
    const routineSet = await routineService.addSetToRoutineExercise(
      req.user.id,
      req.params.id,
      req.body.targetReps,
      req.body.targetWeight
    );

    res.json(routineSet);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

export const reorderRoutine = async (req, res) => {
  const { exercises } = req.body;

  try {
    const updates = exercises.map((e) =>
      prisma.routineExercise.update({
        where: { id: e.id },
        data: { order: e.order },
      })
    );

    await Promise.all(updates);
    res.json({ success: true });
  } catch (err) {
    console.error("Reorder failed:", err);
    res.status(500).json({ error: "Failed to reorder routine" });
  }
};

export async function getRoutineExercises(req, res) {
  try {
    const routineId = req.params.id;

    const exercises = await prisma.routineExercise.findMany({
      where: {
        routineId,
        routine: { userId: req.user.id },
      },
      include: {
        exercise: true,
      },
      orderBy: { order: "asc" },
    });

    const result = exercises.map((e) => ({
      id: e.id,
      exerciseId: e.exerciseId,
      name: e.exercise.name,
      order: e.order,
    }));

    res.json(result);
  } catch (err) {
    console.error("Failed to load routine exercises:", err);
    res.status(500).json({ message: "Failed to load routine exercises" });
  }
}

export async function removeRoutineExercise(req, res) {
  try {
    const id = req.params.id;

    await prisma.routineExercise.delete({
      where: { id },
    });

    res.json({ success: true });
  } catch (err) {
    console.error("Remove routine exercise failed:", err);
    res.status(500).json({ message: "Failed to remove exercise" });
  }
}

export async function renameRoutine(req, res) {
  const { name } = req.body;
  const routineId = req.params.id;

  const updated = await prisma.routine.update({
    where: { id: routineId },
    data: { name },
  });

  res.json(updated);
}

export async function getCurrentRoutine(req, res) {
  const routine = await prisma.routine.findFirst({
    where: {
      userId: req.user.id,
      isCurrent: true,
    },
    include: {
      exercises: {
        include: {
          exercise: true,
          sets: true,
        },
        orderBy: { order: "asc" },
      },
    },
  });

  res.json(routine);
}
