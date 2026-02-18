import prisma from "../config/prisma.js";
import logger from "../config/logger.js";

export const getExercises = async (req, res) => {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const search = req.query.search || "";
    const skip = (page - 1) * limit;

    const where = {
      AND: [
        {
          OR: [
            { isCustom: false, isDeprecated: false },
            { isCustom: true, createdByUserId: userId },
          ],
        },
      ],
    };

    if (search) {
      where.AND.push({
        name: {
          contains: search,
          mode: "insensitive",
        },
      });
    }

    // 1. Get Total Count
    const totalCount = await prisma.exercise.count({ where });

    // 2. Get Exercises
    const exercises = await prisma.exercise.findMany({
      where,
      orderBy: { name: "asc" },
      skip: skip,
      take: limit,
      select: {
        id: true,
        name: true,
        primaryMuscle: true,
        equipment: true,
        imageUrl: true,
        isCustom: true,
        createdByUserId: true,
        secondaryMuscles: true,
      },
    });

    res.json({
      exercises,
      totalCount,
      hasNextPage: skip + exercises.length < totalCount,
      currentPage: page
    });
  } catch (err) {
    logger.error(`Get exercises error: ${err.message}`);
    res.status(500).json({ error: err.message });
  }
};

export const createExercise = async (req, res) => {
  try {
    const userId = req.user.id;

    let { name, primaryMuscle, equipment, otherMuscles, howToSteps } = req.body;

    // Basic validation
    if (!name || !primaryMuscle || !equipment) {
      return res.status(400).json({
        message: "Name, primary muscle and equipment are required",
      });
    }

    // Normalize input
    name = name.trim();

    // ===== DUPLICATE CHECK (NEW CODE) =====
    const existing = await prisma.exercise.findFirst({
      where: {
        name: {
          equals: name,
          mode: "insensitive",
        },
        createdByUserId: userId,
      },
    });

    if (existing) {
      return res.status(400).json({
        message: "You already have a custom exercise with this name",
      });
    }
    // ======================================

    const exercise = await prisma.exercise.create({
      data: {
        name,
        primaryMuscle,
        equipment,
        secondaryMuscles: otherMuscles || [],
        howToSteps: howToSteps || [],
        imageUrl: "/assets/images/s+.png", // Default Strength+ Logo
        isCustom: true,
        createdByUserId: userId,
      },
    });

    res.status(201).json(exercise);
  } catch (err) {
    logger.error(`Create exercise error: ${err.message}`);
    res.status(500).json({ error: err.message });
  }
};

export const updateExercise = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    let { name, primaryMuscle, equipment, otherMuscles, howToSteps } = req.body;

    if (!name || !primaryMuscle || !equipment) {
      return res.status(400).json({
        message: "Name, primary muscle and equipment are required",
      });
    }

    name = name.trim();

    const exercise = await prisma.exercise.findUnique({
      where: { id },
    });

    if (
      !exercise ||
      !exercise.isCustom ||
      exercise.createdByUserId !== userId
    ) {
      return res.status(403).json({ message: "Not allowed" });
    }

    // Prevent duplicates when renaming
    const existing = await prisma.exercise.findFirst({
      where: {
        name: {
          equals: name,
          mode: "insensitive",
        },
        createdByUserId: userId,
        id: { not: id },
      },
    });

    if (existing) {
      return res.status(400).json({
        message: "You already have a custom exercise with this name",
      });
    }

    const updated = await prisma.exercise.update({
      where: { id },
      data: {
        name,
        primaryMuscle,
        equipment,
        secondaryMuscles: otherMuscles || [],
        howToSteps: howToSteps || [],
      },
    });

    res.json(updated);
  } catch (err) {
    logger.error(`Update exercise error: ${err.message}`);
    res.status(500).json({ error: err.message });
  }
};

export const deleteExercise = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const exercise = await prisma.exercise.findUnique({ where: { id } });

    if (
      !exercise ||
      !exercise.isCustom ||
      exercise.createdByUserId !== userId
    ) {
      return res.status(403).json({ message: "Not allowed" });
    }

    await prisma.exercise.delete({ where: { id } });

    res.json({ message: "Exercise deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// ===== GET EXERCISE STATS (CORRECTED) =====
export const getExerciseStats = async (req, res) => {
  try {
    const userId = req.user.id;
    // ❌ REMOVED parseInt() because your IDs are UUID strings
    const exerciseId = req.params.id; 

    // 1. Get Last Performed Date
    const lastWorkout = await prisma.workout.findFirst({
      where: {
        userId: userId,
        exercises: {
          some: { exerciseId: exerciseId },
        },
      },
      orderBy: { date: "desc" },
      select: { date: true },
    });

    // 2. Get Best Lift (Heaviest Set)
    const bestSet = await prisma.setLog.findFirst({
      where: {
        workoutExercise: {
          exerciseId: exerciseId,
          workout: { userId: userId },
        },
      },
      orderBy: { weight: "desc" },
      select: { weight: true },
    });

    res.json({
      lastPerformed: lastWorkout ? lastWorkout.date : null,
      bestLift: bestSet ? bestSet.weight : 0,
    });
  } catch (err) {
    logger.error(`Stats error: ${err.message}`);
    res.status(500).json({ error: "Failed to fetch stats" });
  }
};


export const getExerciseHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id: exerciseId } = req.params;
    const globalBest = await prisma.setLog.findFirst({
      where: {
        workoutExercise: {
          exerciseId: exerciseId,
          workout: { userId: userId },
        },
      },
      orderBy: { weight: "desc" },
      select: { weight: true },
    });

    const allTimeMax = globalBest ? globalBest.weight : 0;
    const historyLogs = await prisma.workoutExercise.findMany({
      where: {
        exerciseId: exerciseId,
        workout: { userId: userId, isCompleted: true },
      },
      orderBy: {
        workout: { date: "desc" },
      },
      take: 31, 
      include: {
        workout: { select: { date: true } },
        sets: {
          orderBy: { weight: "desc" }, 
        },
      },
    });

    const formattedHistory = historyLogs.slice(0, 30).map((log, index) => {
      if (!log.sets || log.sets.length === 0) return null;
      const bestSet = log.sets[0]; 
      const totalSets = log.sets.length;

      let diff = "0kg";
      const previousSession = historyLogs[index + 1];

      if (previousSession && previousSession.sets.length > 0) {
        const prevBest = previousSession.sets[0].weight;
        const difference = bestSet.weight - prevBest;

        if (difference > 0) diff = `+${difference}kg`;
        else if (difference < 0) diff = `${difference}kg`;
      } else if (index === historyLogs.length - 1) {
        diff = "Start";
      }

      return {
        date: log.workout.date,
        weight: bestSet.weight,
        reps: bestSet.reps,
        sets: totalSets,
        diff: diff,
        isPr: bestSet.weight >= allTimeMax && bestSet.weight > 0,
      };
    }).filter(item => item !== null);

    res.status(200).json(formattedHistory);
  } catch (err) {
    logger.error(`History error: ${err.message}`);
    res.status(500).json({ error: "Failed to fetch history" });
  }
};

export const getExercisePR = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id: exerciseId } = req.params;

    const bestSet = await prisma.setLog.findFirst({
      where: {
        workoutExercise: {
          exerciseId,
          workout: {
            userId,
            isCompleted: true,
          },
        },
      },
      orderBy: [
        { weight: "desc" },
        { reps: "desc" },
      ],
    });

    if (!bestSet) return res.json(null);

    res.json({
      weight: bestSet.weight,
      reps: bestSet.reps,
      date: bestSet.createdAt,
    });
  } catch (err) {
    logger.error(`PR error: ${err.message}`);
    res.status(500).json({ error: "Failed to fetch PR" });
  }
};