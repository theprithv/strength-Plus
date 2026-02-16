import * as routineService from "../services/routine.service.js";
import prisma from "../config/prisma.js";
import logger from "../config/logger.js";

export async function createRoutine(req, res, next) {
  try {
    const routine = await routineService.createRoutine(req.user.id, req.body);
    res.json(routine);
  } catch (error) {
    next(error);
  }
}

export async function getRoutines(req, res, next) {
  try {
    const routines = await routineService.getRoutines(req.user.id);
    res.json(routines);
  } catch (error) {
    next(error);
  }
}

export async function setCurrentRoutine(req, res, next) {
  try {
    await routineService.setCurrentRoutine(req.user.id, req.params.id);
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
}

export async function deleteRoutine(req, res, next) {
  try {
    await routineService.deleteRoutine(req.user.id, req.params.id);
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
}

export async function addExerciseToRoutine(req, res) {
  try {
    const routineExercise = await routineService.addExerciseToRoutine(
      req.user.id,
      req.params.id,
      req.body.exerciseId,
      req.body.day || 1
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
    logger.error(`Reorder failed: ${err.message}`);
    res.status(500).json({ error: "Failed to reorder routine" });
  }
};

export async function getRoutineExercises(req, res) {
  try {
    const routineId = req.params.id;
    const day = req.query.day ? parseInt(req.query.day) : null;

    const where = {
      routineId,
      routine: { userId: req.user.id },
    };

    if (day) {
      where.day = day;
    }

    const exercises = await prisma.routineExercise.findMany({
      where,
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
    logger.error(`Failed to load routine exercises: ${err.message}`);
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
    logger.error(`Remove routine exercise failed: ${err.message}`);
    res.status(500).json({ message: "Failed to remove exercise" });
  }
}

export async function updateRoutine(req, res, next) {
  try {
    const { name, currentDay } = req.body;
    const routineId = req.params.id;

    const data = {};
    if (name !== undefined) data.name = name;
    if (currentDay !== undefined) data.currentDay = currentDay;

    const updated = await prisma.routine.update({
      where: { id: routineId },
      data,
    });

    res.json(updated);
  } catch (error) {
    next(error);
  }
}

export async function getCurrentRoutine(req, res, next) {
  try {
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
  } catch (error) {
    next(error);
  }
}

export async function removeExerciseFromRoutineByExerciseId(req, res) {
  try {
    const { routineId, exerciseId } = req.params;

    // First find matching exercises to delete their sets
    const existingExercises = await prisma.routineExercise.findMany({
      where: {
        routineId,
        exerciseId,
        routine: { userId: req.user.id }
      }
    });

    if (existingExercises.length > 0) {
      const ids = existingExercises.map(e => e.id);
      
      // 1. Delete sets
      await prisma.routineSet.deleteMany({
        where: { routineExerciseId: { in: ids } }
      });

      // 2. Delete routine exercises
      await prisma.routineExercise.deleteMany({
        where: { id: { in: ids } }
      });
    }

    res.json({ success: true });
  } catch (err) {
    logger.error(`Remove exercise from routine failed: ${err.message}`);
    res.status(500).json({ message: "Failed to remove exercise from routine" });
  }
}
