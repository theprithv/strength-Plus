import prisma from "../config/prisma.js";
import logger from "../config/logger.js";

export const startWorkout = async (req, res) => {
  try {
    const userId = req.user.id;
    const { splitName } = req.body;

    if (!splitName) {
      return res.status(400).json({ error: "splitName is required" });
    }

    // 0️⃣ Safety Check: If active workout exists, return it instead of creating new
    const existing = await prisma.workout.findFirst({
      where: { userId, isCompleted: false },
      include: {
        exercises: {
          orderBy: { order: "asc" },
          include: { exercise: true, sets: true },
        },
      },
    });

    if (existing) {
       return res.status(200).json(existing);
    }

    // 1️⃣ Create the workout session
    const workout = await prisma.workout.create({
      data: {
        userId,
        splitName,
      },
    });

    // 2️⃣ Load ⭐ current routine (if exists)
    const currentRoutine = await prisma.routine.findFirst({
      where: { userId, isCurrent: true },
      include: {
        exercises: {
          orderBy: { order: "asc" },
          include: { sets: true },
        },
      },
    });

    // 3️⃣ If routine exists → copy its structure into workout
    if (currentRoutine) {
      const daySpecificExercises = currentRoutine.exercises.filter(
        (ex) => ex.day === currentRoutine.currentDay
      );

      if (daySpecificExercises.length > 0) {
        const exercisePayloads = daySpecificExercises.map((routineExercise) => ({
          workoutId: workout.id,
          exerciseId: routineExercise.exerciseId,
          order: routineExercise.order,
        }));

        await prisma.workoutExercise.createMany({
          data: exercisePayloads,
        });
      }
    }

    const fullWorkout = await prisma.workout.findUnique({
      where: { id: workout.id },
      include: {
        exercises: {
          orderBy: { order: "asc" },
          include: {
            exercise: true,
            sets: true,
          },
        },
      },
    });

    res.status(201).json(fullWorkout);
  } catch (err) {
    logger.error(`Start workout failed: ${err.message}`);
    res.status(500).json({ error: "Failed to start workout" });
  }
};

export const addExerciseToWorkout = async (req, res) => {
  try {
    const { workoutId } = req.params;
    const { exerciseId, order } = req.body;

    // 0️⃣ Check for duplicates
    const existing = await prisma.workoutExercise.findFirst({
      where: { workoutId, exerciseId },
    });

    if (existing) {
      return res.status(400).json({ error: "Exercise already in workout" });
    }

    const count = await prisma.workoutExercise.count({
      where: { workoutId },
    });

    const workoutExercise = await prisma.workoutExercise.create({
      data: {
        workoutId,
        exerciseId,
        order: count + 1,
      },
      include: {
        exercise: true,
        sets: true,
      },
    });

    res.status(201).json(workoutExercise);
  } catch (err) {
    logger.error(`Add exercise error: ${err.message}`);
    res.status(500).json({ error: err.message });
  }
};

export const addSetToExercise = async (req, res) => {
  try {
    const { workoutExerciseId } = req.params;
    let { reps, weight } = req.body;

    reps = Number(reps);
    weight = Number(weight);

    if (!Number.isFinite(reps) || !Number.isFinite(weight)) {
      return res.status(400).json({ error: "Invalid set data" });
    }

    const count = await prisma.setLog.count({
      where: { workoutExerciseId },
    });

    const setNumber = count + 1;
    const volume = reps * weight;

    const newSet = await prisma.setLog.create({
      data: {
        workoutExerciseId,
        setNumber,
        reps,
        weight,
        volume,
      },
    });

    res.status(201).json(newSet);
  } catch (err) {
    logger.error(`Add set error: ${err.message}`);
    res.status(500).json({ error: "Failed to add set" });
  }
};

export const finishWorkout = async (req, res) => {
  try {
    const { workoutId } = req.params;
    const { notes } = req.body;

    const workout = await prisma.workout.findUnique({
      where: { id: workoutId },
      include: {
        exercises: {
          select: { id: true }, // Optimized selection
        },
      },
    });

    if (!workout) {
      return res.status(404).json({ error: "Workout not found" });
    }

    if (workout.isCompleted) {
      return res.status(400).json({ error: "Workout already completed" });
    }

    // 🧹 BATCH CLEANUP: 1. Delete all empty sets across the entire workout
    const workoutExerciseIds = workout.exercises.map((ex) => ex.id);

    if (workoutExerciseIds.length > 0) {
      // 1. Delete empty sets
      await prisma.setLog.deleteMany({
        where: {
          workoutExerciseId: { in: workoutExerciseIds },
          OR: [{ reps: 0 }, { weight: 0 }],
        },
      });

      // 2. Find exercises that still have sets
      const exercisesWithSets = await prisma.setLog.groupBy({
        by: ["workoutExerciseId"],
        where: {
          workoutExerciseId: { in: workoutExerciseIds },
        },
      });

      const validIds = new Set(exercisesWithSets.map((e) => e.workoutExerciseId));
      const idsToDelete = workoutExerciseIds.filter((id) => !validIds.has(id));

      // 3. Delete exercises that have NO sets remaining
      if (idsToDelete.length > 0) {
        await prisma.workoutExercise.deleteMany({
          where: { id: { in: idsToDelete } },
        });
      }
    }

    // 🔄 RE-FETCH CLEAN DATA
    const cleanedWorkout = await prisma.workout.findUnique({
      where: { id: workoutId },
      include: {
        exercises: {
          include: { sets: true },
        },
      },
    });

    // 🛑 VALIDATION: Check if session is empty
    const hasValidSets =
      cleanedWorkout.exercises.length > 0 &&
      cleanedWorkout.exercises.some((ex) => ex.sets.length > 0);

    if (!hasValidSets) {
      // Delete the empty/invalid session entirely
      await prisma.workout.delete({ where: { id: workoutId } });
      return res.status(200).json({ message: "Empty session discarded" });
    }

    let totalVolume = 0;
    let totalSets = 0;
    let totalReps = 0;

    for (const ex of cleanedWorkout.exercises) {
      for (const set of ex.sets) {
        totalVolume += set.volume;
        totalSets++;
        totalReps += set.reps;
      }
    }

    const startTime = cleanedWorkout.startTime || cleanedWorkout.createdAt;
    const endTime = new Date();
    const duration = Math.floor((endTime - startTime) / 1000);

    const updatedWorkout = await prisma.workout.update({
      where: { id: workoutId },
      data: {
        totalVolume,
        totalSets,
        totalReps,
        startTime,
        endTime,
        duration,
        notes,
        isCompleted: true,
      },
      include: {
        exercises: {
          include: {
            exercise: true,
            sets: true,
          },
        },
      },
    });

    res.json(updatedWorkout);
  } catch (err) {
    logger.error(`Finish workout failed: ${err.message}`);
    res.status(500).json({ error: "Failed to finish workout" });
  }
};

export const getActiveWorkout = async (req, res) => {
  try {
    // 🔍 Find ALL active workouts
    const activeWorkouts = await prisma.workout.findMany({
      where: {
        userId: req.user.id,
        isCompleted: false,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        exercises: {
          include: {
            exercise: true,
            sets: true,
          },
        },
      },
    });

    if (activeWorkouts.length === 0) {
      return res.json(null);
    }

    // ✅ Keep the newest one
    const currentCallback = activeWorkouts[0];

    // 🧹 Auto-close any *older* ghost sessions (Self-Healing)
    if (activeWorkouts.length > 1) {
      const idsToClose = activeWorkouts.slice(1).map((w) => w.id);
      await prisma.workout.updateMany({
        where: { id: { in: idsToClose } },
        data: { 
          isCompleted: true, 
          endTime: new Date(),
          notes: "Auto-closed duplicate session" 
        },
      });
      logger.info(`[Self-Heal] Closed ${idsToClose.length} ghost sessions for user ${req.user.id}`);
    }

    const start = new Date(currentCallback.startTime || currentCallback.createdAt).getTime();
    const now = Date.now();
    const elapsedSeconds = Math.floor((now - start) / 1000);
    
    res.json({ ...currentCallback, elapsedSeconds });
  } catch (err) {
    logger.error(`Restore session failed: ${err.message}`);
    res.status(500).json({ error: "Failed to restore session" });
  }
};

export const getWorkoutsByDate = async (req, res) => {
  try {
    const userId = req.user.id;
    const { date } = req.params;

    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const workouts = await prisma.workout.findMany({
      where: {
        userId,
        isCompleted: true,
        startTime: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      include: {
        exercises: {
          orderBy: { order: "asc" },
          include: {
            exercise: true,
            sets: {
              orderBy: { setNumber: "asc" },
            },
          },
        },
      },
      orderBy: {
        startTime: "asc",
      },
    });

    res.json(workouts);
  } catch (err) {
    logger.error(`Get workouts by date failed: ${err.message}`);
    res.status(500).json({ error: "Failed to fetch workouts" });
  }
};

export const removeExerciseFromWorkout = async (req, res) => {
  try {
    const { id } = req.params;

    const workoutEx = await prisma.workoutExercise.findUnique({
      where: { id },
      include: { workout: true },
    });

    if (!workoutEx) {
      return res.status(404).json({ error: "Exercise not found" });
    }

    if (workoutEx.workout.userId !== req.user.id) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    // 1. Delete associated sets
    await prisma.setLog.deleteMany({
      where: { workoutExerciseId: id },
    });

    // 2. Delete the exercise entry
    await prisma.workoutExercise.delete({
      where: { id },
    });

    res.json({ success: true });
  } catch (err) {
    logger.error(`Delete exercise error: ${err.message}`);
    res.status(500).json({ error: "Failed to delete exercise" });
  }
};

export const updateWorkoutExercise = async (req, res) => {
  try {
    const { id } = req.params;
    const { exerciseId } = req.body;

    const workoutEx = await prisma.workoutExercise.findUnique({
      where: { id },
      include: { workout: true },
    });

    if (!workoutEx) {
      return res.status(404).json({ error: "Exercise not found" });
    }

    if (workoutEx.workout.userId !== req.user.id) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const updated = await prisma.workoutExercise.update({
      where: { id },
      data: { exerciseId },
      include: {
        exercise: true,
        sets: true,
      },
    });

    res.json(updated);
  } catch (err) {
    logger.error(`Update workout exercise error: ${err.message}`);
    res.status(500).json({ error: "Failed to update exercise" });
  }
};

export const updateSet = async (req, res) => {
  try {
    const { setId } = req.params;
    const { reps, weight } = req.body;

    const set = await prisma.setLog.findUnique({
      where: { id: setId },
      include: { workoutExercise: { include: { workout: true } } },
    });

    if (!set) return res.status(404).json({ error: "Set not found" });
    if (set.workoutExercise.workout.userId !== req.user.id) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const updated = await prisma.setLog.update({
      where: { id: setId },
      data: {
        reps: Number(reps),
        weight: Number(weight),
        volume: Number(reps) * Number(weight),
      },
    });

    res.json(updated);
  } catch (err) {
    logger.error(`Update set error: ${err.message}`);
    res.status(500).json({ error: "Failed to update set" });
  }
};

export const deleteSet = async (req, res) => {
  try {
    const { setId } = req.params;

    const set = await prisma.setLog.findUnique({
      where: { id: setId },
      include: { workoutExercise: { include: { workout: true } } },
    });

    if (!set) return res.status(404).json({ error: "Set not found" });
    if (set.workoutExercise.workout.userId !== req.user.id) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    await prisma.setLog.delete({ where: { id: setId } });

    res.json({ success: true });
  } catch (err) {
    logger.error(`Delete set error: ${err.message}`);
    res.status(500).json({ error: "Failed to delete set" });
  }
};

export const getAllWorkouts = async (req, res) => {
  try {
    const userId = req.user.id;
    const workouts = await prisma.workout.findMany({
      where: {
        userId,
        isCompleted: true,
      },
      select: {
        startTime: true,
      },
    });
    res.json(workouts);
  } catch (err) {
    logger.error(`Get all workouts failed: ${err.message}`);
    res.status(500).json({ error: "Failed to fetch workout history" });
  }
};
