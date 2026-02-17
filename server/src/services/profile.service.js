import prisma from "../config/prisma.js";

export const getProfileByUserId = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      profile: true,
      prSlots: {
        include: { exercise: true },
        orderBy: { slotIndex: "asc" },
      },
    },
  });

  if (!user || !user.prSlots.length) return user;

  // ⚡ Optimization: Batch fetch PRs for all configured slots
  const exerciseIds = user.prSlots
    .filter((slot) => slot.exerciseId)
    .map((slot) => slot.exerciseId);


  if (exerciseIds.length === 0) return user;

  const prDetails = {};
  
  // Parallel fetch for PR details (max 3 slots)
  await Promise.all(
    exerciseIds.map(async (exId) => {
      const best = await prisma.setLog.findFirst({
        where: {
          workoutExercise: { exerciseId: exId, workout: { userId, isCompleted: true } }
        },
        orderBy: [{ weight: "desc" }],
        select: { weight: true, createdAt: true },
      });
      
      if (best) {
        prDetails[exId] = {
          weight: best.weight,
          date: best.createdAt,
        };
      }
    })
  );

  return { ...user, prDetails }; // Attach pre-fetched PRs
};

export const updateProfileByUserId = (userId, data) => {
  const h = parseFloat(data.height);
  const w = parseFloat(data.weight);
  const a = parseInt(data.age);

  return prisma.profile.upsert({
    where: { userId: userId },
    update: {
      bio: data.bio || "",
      height: isNaN(h) ? 0 : h,
      weight: isNaN(w) ? 0 : w,
      age: isNaN(a) ? 18 : a, // Update age if provided
      goal: data.goal || "Strength",
    },
    create: {
      userId: userId,
      name: data.name || "User",
      bio: data.bio || "",
      height: isNaN(h) ? 0 : h,
      weight: isNaN(w) ? 0 : w,
      age: isNaN(a) ? 18 : a,
      goal: data.goal || "Strength",
    },
  });
};

export const getWorkoutDurationSeries = async (userId, days = 7) => {
  const end = new Date();
  end.setHours(23, 59, 59, 999);

  const start = new Date();
  start.setDate(start.getDate() - (days - 1));
  start.setHours(0, 0, 0, 0);

  const workouts = await prisma.workout.findMany({
    where: {
      userId,
      isCompleted: true,
      date: { gte: start, lte: end },
    },
    select: {
      date: true,
      duration: true,
      startTime: true,
      endTime: true,
    },
    orderBy: { date: "asc" },
  });

  const series = [];
  let totalSeconds = 0;
  let activeDays = 0;

  for (let i = 0; i < days; i++) {
    const d = new Date(start);
    d.setDate(d.getDate() + i);

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const dateKey = `${year}-${month}-${day}`;

    const dayWorkouts = workouts.filter((w) => {
      const wDate = new Date(w.date);
      const wYear = wDate.getFullYear();
      const wMonth = String(wDate.getMonth() + 1).padStart(2, "0");
      const wDay = String(wDate.getDate()).padStart(2, "0");
      return `${wYear}-${wMonth}-${wDay}` === dateKey;
    });

    const dayTotalSeconds = dayWorkouts.reduce((acc, curr) => {
      let secs = curr.duration;

      // Fallback/Correction: If duration is null or looks like it was saved in minutes (< 300 for a likely full workout)
      // but timestamps are present, recalculate exactly.
      if (curr.startTime && curr.endTime) {
        const startTs = new Date(curr.startTime).getTime();
        const endTs = new Date(curr.endTime).getTime();
        secs = Math.floor((endTs - startTs) / 1000);
      } else if (secs !== null && secs < 500) {
        // Assume old records were in minutes if duration < 500 and no timestamps
        secs = secs * 60;
      }

      return acc + (secs || 0);
    }, 0);

    if (dayTotalSeconds > 0) {
      totalSeconds += dayTotalSeconds;
      activeDays++;
    }

    series.push({
      date: dateKey,
      label: d.toLocaleDateString("en-US", {
        weekday: "short",
        day: "numeric",
      }),
      duration: dayTotalSeconds, // Send full seconds for precision
    });
  }

  const averageSeconds = activeDays > 0 ? Math.round(totalSeconds / activeDays) : 0;

  return { series, average: averageSeconds };
}
