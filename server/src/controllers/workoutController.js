import prisma from "../config/prisma.js";

export const startWorkout = async (req, res) => {
  try {
    const userId = req.user.id;
    const { splitName } = req.body;

    if (!splitName) {
      return res.status(400).json({ error: "splitName is required" });
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
      for (const routineExercise of currentRoutine.exercises) {
        const workoutExercise = await prisma.workoutExercise.create({
          data: {
            workoutId: workout.id,
            exerciseId: routineExercise.exerciseId,
            order: routineExercise.order,
          },
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
    console.error(err);
    res.status(500).json({ error: "Failed to start workout" });
  }
};

export const addExerciseToWorkout = async (req, res) => {
  try {
    const { workoutId } = req.params;
    const { exerciseId, order } = req.body;

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
    console.error("Add set error:", err);
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
    console.error(err);
    res.status(500).json({ error: "Failed to add set" });
  }
};

export const finishWorkout = async (req, res) => {
  try {
    const { workoutId } = req.params;
    const { notes } = req.body;

    const workout = await prisma.workout.findUnique({
      where: { id: workoutId },
      include: { exercises: { include: { sets: true } } },
    });

    if (!workout || workout.isCompleted) {
      return res
        .status(400)
        .json({ error: "Workout invalid or already completed" });
    }

    // ... (keep your existing CLEAN EMPTY SETS logic)

    let totalVolume = 0,
      totalSets = 0,
      totalReps = 0;
    for (const ex of cleanedWorkout.exercises) {
      for (const set of ex.sets) {
        totalVolume += set.volume;
        totalSets++;
        totalReps += set.reps;
      }
    }

    // PRECISION FIX: Store absolute seconds for better analytics
    const duration = Math.max(
      1,
      Math.floor((endTime - startTime) / 1000)
    );

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
      include: { exercises: { include: { exercise: true, sets: true } } },
    });

    res.json(updatedWorkout);
  } catch (err) {
    console.error("Finish workout failed:", err);
    res.status(500).json({ error: "Failed to finish workout" });
  }
};

export const getActiveWorkout = async (req, res) => {
  try {
    const workout = await prisma.workout.findFirst({
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

    res.json(workout || null);
  } catch (err) {
    console.error("Restore session failed:", err);
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
    console.error("Get workouts by date failed:", err);
    res.status(500).json({ error: "Failed to fetch workouts" });
  }
};
