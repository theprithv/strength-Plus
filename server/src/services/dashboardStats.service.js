import prisma from "../config/prisma.js";
import { getDateRange } from "../utils/dateRanges.js";
import { DASHBOARD_MUSCLES } from "../constants/dashboardMuscles.js";

export async function getMuscleStats(userId, muscle, range = "week") {
  const { start, end } = getDateRange(range);

  const workouts = await prisma.workout.findMany({
    where: {
      userId,
      isCompleted: true,
      OR: [
        { startTime: { gte: start, lte: end } },
        { startTime: null, createdAt: { gte: start, lte: end } },
      ],
    },
    select: {
      id: true,
      startTime: true,
      createdAt: true,
      exercises: {
        where: {
          exercise: {
            OR: [
              { primaryMuscle: { equals: muscle, mode: "insensitive" } },
              { secondaryMuscles: { has: muscle.toLowerCase() } },
            ],
          },
        },
        select: {
          sets: {
            select: {
              reps: true,
              weight: true,
              volume: true,
            },
          },
        },
      },
    },
  });

  let totalVolume = 0;
  let lastTrained = null;
  let sessions = 0;
  let totalSets = 0;
  let totalReps = 0;

  for (const workout of workouts) {
    let workoutVolume = 0;

    for (const ex of workout.exercises) {
      for (const set of ex.sets) {
        const setVolume =
          set.volume && set.volume > 0 ? set.volume : set.reps * set.weight;

        workoutVolume += setVolume;
        totalVolume += setVolume;
        totalSets++;
        totalReps += set.reps;
      }
    }

    if (workoutVolume > 0) {
      sessions++;
      const workoutTime = workout.startTime || workout.createdAt;
      if (!lastTrained || workoutTime > lastTrained) {
        lastTrained = workoutTime;
      }
    }
  }

  return {
    muscle,
    range,
    totalVolume,
    totalSets,
    totalReps,
    lastTrained,
    sessions,
  };
}

export async function getTrainingLoad(userId, range = "week") {
  if (range !== "week" && range !== "month") {
    throw new Error("Invalid range. Use 'week' or 'month'.");
  }
  const { start, end } = getDateRange(range === "week" ? "month" : "year");
  const workouts = await prisma.workout.findMany({
    where: {
      userId,
      isCompleted: true,
      OR: [
        { startTime: { gte: start, lte: end } },
        { startTime: null, createdAt: { gte: start, lte: end } },
      ],
    },
    select: {
      startTime: true,
      createdAt: true,
      exercises: {
        select: {
          sets: {
            select: {
              reps: true,
              weight: true,
              volume: true,
            },
          },
        },
      },
    },
  });

  const buckets = {};

  for (const workout of workouts) {
    const date = new Date(workout.startTime ?? workout.createdAt);

    let key;
    if (range === "week") {
      const year = date.getFullYear();
      const week = getISOWeek(date);
      key = `${year}-W${String(week).padStart(2, "0")}`;
    } else if (range === "month") {
      key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    } else {
      throw new Error("Invalid range");
    }

    if (!buckets[key]) buckets[key] = 0;

    for (const ex of workout.exercises) {
      for (const set of ex.sets) {
        const load =
          set.volume && set.volume > 0
            ? set.volume
            : set.reps && set.weight
              ? set.reps * set.weight
              : 0;

        buckets[key] += load;
      }
    }
  }

  const sorted = Object.entries(buckets)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([period, load]) => ({
      period,
      load: Math.round(load),
    }));

  if (range === "week") {
    return sorted.slice(-6); // last 6 weeks
  }

  if (range === "month") {
    return sorted.slice(-12); // last 12 months
  }

  return sorted;
}

function getISOWeek(date) {
  const tmp = new Date(date);
  tmp.setHours(0, 0, 0, 0);
  tmp.setDate(tmp.getDate() + 3 - ((tmp.getDay() + 6) % 7));
  const week1 = new Date(tmp.getFullYear(), 0, 4);
  return (
    1 +
    Math.round(((tmp - week1) / 86400000 - 3 + ((week1.getDay() + 6) % 7)) / 7)
  );
}

export async function getMuscleBalance(userId, range = "week") {
  // Fetch a 30-day window to serve both Week and Month data in a single response.
  const workouts = await prisma.workout.findMany({
    where: {
      userId,
      isCompleted: true,
      OR: [
        { startTime: { gte: startMonth, lte: end } },
        { startTime: null, createdAt: { gte: startMonth, lte: end } },
      ],
    },
    select: {
      startTime: true,
      createdAt: true,
      exercises: {
        select: {
          exercise: {
            select: {
              name: true,
              primaryMuscle: true,
              secondaryMuscles: true,
            },
          },
          // Aggregate: Count sets instead of fetching them
          _count: {
            select: { sets: true },
          },
        },
      },
    },
  });

  const balance = {};
  DASHBOARD_MUSCLES.forEach((m) => {
    balance[m] = {
      weekSets: 0,
      monthSets: 0,
      exercises: {},
    };
  });

  for (const w of workouts) {
    const workoutTime = new Date(w.startTime ?? w.createdAt);
    const inWeek = workoutTime >= startWeek;
    const inMonth = workoutTime >= startMonth;

    for (const ex of w.exercises) {
      const primary = ex.exercise.primaryMuscle.toLowerCase().trim();
      const secondaries = ex.exercise.secondaryMuscles.map((m) => m.toLowerCase().trim());
      const exerciseName = ex.exercise.name;
      const setCount = ex._count.sets;

      if (setCount === 0) continue;

      if (balance[primary]) {
        if (inWeek) balance[primary].weekSets += setCount;
        if (inMonth) balance[primary].monthSets += setCount;
        balance[primary].exercises[exerciseName] =
          (balance[primary].exercises[exerciseName] || 0) + setCount;
      }

      for (const sec of secondaries) {
        if (balance[sec] && sec !== primary) {
          if (inWeek) balance[sec].weekSets += setCount;
          if (inMonth) balance[sec].monthSets += setCount;
          balance[sec].exercises[exerciseName] =
            (balance[sec].exercises[exerciseName] || 0) + setCount;
        }
      }
    }
  }

  return balance;
}

export async function getDashboardStats(userId) {
  const totalWorkouts = await prisma.workout.count({
    where: {
      userId,
      isCompleted: true,
    },
  });

  const stats = await prisma.setLog.aggregate({
    _count: { id: true },
    _sum: { reps: true },
    where: {
      workoutExercise: {
        workout: {
          userId,
          isCompleted: true,
        },
      },
    },
  });

  return {
    totalWorkouts,
    totalSets: stats._count.id || 0,
    totalReps: stats._sum.reps || 0,
  };
}

export async function getMuscleOverloadTrend(userId, muscle, days, exercise = "All") {
  const end = new Date();
  end.setHours(23, 59, 59, 999);
  
  const start = new Date();
  start.setDate(start.getDate() - days);
  start.setHours(0, 0, 0, 0);

  // Fetch all workouts with exercises targeting the specified muscle
  const workouts = await prisma.workout.findMany({
    where: {
      userId,
      isCompleted: true,
      OR: [
        { startTime: { gte: start, lte: end } },
        { date: { gte: start, lte: end } },
      ],
    },
    include: {
      exercises: {
        where: {
          exercise: {
            OR: [
              { primaryMuscle: { equals: muscle, mode: "insensitive" } },
              { secondaryMuscles: { has: muscle.toLowerCase() } },
            ],
          },
        },
        include: {
          exercise: true,
          sets: {
            orderBy: [{ weight: "desc" }, { reps: "desc" }],
          },
        },
      },
    },
    orderBy: { date: "asc" },
  });

  // Calculate estimated 1RM using Epley formula: weight × (1 + reps/30)
  const calculateE1RM = (weight, reps) => {
    if (reps <= 0 || weight <= 0) return 0;
    return Math.round(weight * (1 + reps / 30));
  };

  // Group workouts into time buckets
  const bucketSize = days === 30 ? 5 : 10; // 5 days for 30D, 10 days for 90D
  const buckets = new Map();

  for (const workout of workouts) {
    // Skip workouts with no exercises for this muscle
    if (!workout.exercises || workout.exercises.length === 0) continue;
    
    const workoutDate = new Date(workout.date);
    const daysSinceStart = Math.floor((workoutDate - start) / (1000 * 60 * 60 * 24));
    const bucketIndex = Math.floor(daysSinceStart / bucketSize);

    if (!buckets.has(bucketIndex)) {
      buckets.set(bucketIndex, {
        exercises: new Map(),
        dates: [],
      });
    }

    const bucket = buckets.get(bucketIndex);
    bucket.dates.push(workoutDate);

    for (const workoutEx of workout.exercises) {
      const exName = workoutEx.exercise.name;
      
      // Filter by exercise if specified
      if (exercise !== "All" && exName !== exercise) continue;

      // Get best set (highest e1RM)
      for (const set of workoutEx.sets) {
        const e1rm = calculateE1RM(set.weight, set.reps);
        
        if (!bucket.exercises.has(exName)) {
          bucket.exercises.set(exName, { weight: set.weight, reps: set.reps, e1rm });
        } else {
          const current = bucket.exercises.get(exName);
          if (e1rm > current.e1rm) {
            bucket.exercises.set(exName, { weight: set.weight, reps: set.reps, e1rm });
          }
        }
      }
    }
  }

  // Build time series data with per-exercise improvement tracking
  const series = [];
  const bucketIndexes = Array.from(buckets.keys()).sort((a, b) => a - b);
  
  // Track the most recent data for each exercise across all previous buckets
  const exerciseHistory = new Map(); // exName -> { weight, e1rm }

  for (const bucketIndex of bucketIndexes) {
    const bucket = buckets.get(bucketIndex);
    
    // Skip buckets with no exercise data
    if (bucket.exercises.size === 0) continue;
    
    const bucketStart = new Date(start);
    bucketStart.setDate(bucketStart.getDate() + bucketIndex * bucketSize);
    
    const bucketEnd = new Date(bucketStart);
    bucketEnd.setDate(bucketEnd.getDate() + bucketSize - 1);

    // Calculate per-exercise improvements
    const drivers = [];
    let improvementCount = 0;
    let declineCount = 0;
    let plateauCount = 0;
    let newCount = 0;

    for (const [exName, exData] of bucket.exercises) {
      let driverStatus = 'new';
      let weightChange = null;

      if (exerciseHistory.has(exName)) {
        // Compare to previous occurrence
        const prevData = exerciseHistory.get(exName);
        const weightDiff = exData.weight - prevData.weight;

        if (weightDiff > 0) {
          driverStatus = 'improved';
          weightChange = weightDiff;
          improvementCount++;
        } else if (weightDiff < 0) {
          driverStatus = 'declined';
          weightChange = weightDiff;
          declineCount++;
        } else {
          driverStatus = 'plateau';
          weightChange = 0;
          plateauCount++;
        }
      } else {
        // New exercise
        newCount++;
      }

      drivers.push({
        exercise: exName,
        weight: exData.weight,
        reps: exData.reps,
        change: weightChange,
        status: driverStatus,
        e1rm: exData.e1rm, // Store for later history update
      });
    }

    // Calculate average e1RM
    // First bucket: Include all exercises to establish baseline
    // Subsequent buckets: Only include exercises with history (exclude new ones)
    const isFirstBucket = series.length === 0;
    const exercisesForAverage = isFirstBucket
      ? drivers.map(driver => driver.e1rm) // First bucket: all exercises
      : drivers.filter(driver => driver.status !== 'new').map(driver => driver.e1rm); 
    
    let avgE1RM;
    if (exercisesForAverage.length > 0) {
      avgE1RM = Math.round(exercisesForAverage.reduce((sum, val) => sum + val, 0) / exercisesForAverage.length);
    } else if (drivers.length > 0) {
      // Fallback: If ALL exercises are "new" in this bucket, use them for the average 
      // instead of dropping to 0
      avgE1RM = Math.round(drivers.reduce((sum, d) => sum + d.e1rm, 0) / drivers.length);
    } else {
      // Truly nothing in this bucket, use previous bucket's score if available
      avgE1RM = series.length > 0 ? series[series.length - 1].score : 0;
    }

    // Now update history for all exercises in this bucket (for next bucket's comparison)
    for (const [exName, exData] of bucket.exercises) {
      exerciseHistory.set(exName, {
        weight: exData.weight,
        e1rm: exData.e1rm,
      });
    }

    // Format date label
    const dateLabel = days === 30
      ? `${bucketStart.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`
      : `${bucketStart.toLocaleDateString("en-US", { month: "short" })}`;

    // Determine overall trend status based on improvement counts
    let status = "flat";
    
    if (newCount > 0 && improvementCount === 0 && declineCount === 0) {
      // All exercises are new
      status = "flat";
    } else if (improvementCount > declineCount) {
      status = "up";
    } else if (declineCount > improvementCount) {
      status = "down";
    } else {
      // Equal or mostly plateau
      status = "flat";
    }

    series.push({
      date: bucketEnd.toISOString().split("T")[0],
      dateLabel,
      score: avgE1RM,
      status,
      drivers: drivers.map(({ e1rm, ...rest }) => rest), // Remove e1rm from drivers before sending
      hasNewExercisesOnly: newCount > 0 && improvementCount === 0 && declineCount === 0,
    });
  }

  return { series };
}
