import prisma from "../config/prisma.js";
import { calculateStreaks } from "../utils/streakUtils.js";

async function getAvailableYears(userId) {
  const workouts = await prisma.workout.findMany({
    where: {
      userId,
      isCompleted: true,
    },
    select: {
      date: true,
      startTime: true,
      createdAt: true,
    },
  });

  const years = new Set();

  workouts.forEach((w) => {
    const ts = w.date ?? w.startTime ?? w.createdAt;
    years.add(ts.getFullYear());
  });

  return Array.from(years).sort((a, b) => a - b);
}

async function getTrainedDaysForYear(userId, year) {
  const start = new Date(year, 0, 1, 0, 0, 0, 0);
  const end = new Date(year, 11, 31, 23, 59, 59, 999);

  const workouts = await prisma.workout.findMany({
    where: {
      userId,
      isCompleted: true,
      OR: [
        { date: { gte: start, lte: end } },
        { startTime: { gte: start, lte: end } },
        { startTime: null, createdAt: { gte: start, lte: end } },
      ],
    },
    select: {
      date: true,
      startTime: true,
      createdAt: true,
    },
  });

  const daySet = new Set();

  workouts.forEach((w) => {
    const ts = w.date ?? w.startTime ?? w.createdAt;
    daySet.add(ts.toISOString().slice(0, 10));
  });

  return Array.from(daySet).sort();
}

async function getCurrentStreak(userId) {
  const workouts = await prisma.workout.findMany({
    where: {
      userId,
      isCompleted: true,
    },
    select: {
      date: true,
      startTime: true,
      createdAt: true,
    },
    orderBy: {
      date: "asc",
    },
  });

  const calendarData = workouts
    .map((w) => {
      const ts = w.date ?? w.startTime ?? w.createdAt;
      return { date: ts.toISOString().slice(0, 10) };
    })
    .sort((a, b) => a.date.localeCompare(b.date));
  const { currentStreak } = calculateStreaks(calendarData, new Date());
  return currentStreak;
}

function getLongestStreakForYear(trainedDays) {
  const calendarData = trainedDays.map((date) => ({
    date,
    sessions: 1,
  }));

  const { longestStreak } = calculateStreaks(calendarData);
  return longestStreak;
}

export async function getYearCalendarData(userId, year) {
  const availableYears = await getAvailableYears(userId);

  if (availableYears.length === 0) {
    return {
      year,
      availableYears: [],
      trainedDays: [],
      currentStreak: 0,
      longestStreak: 0,
    };
  }

  const selectedYear =
    year && availableYears.includes(year)
      ? year
      : availableYears[availableYears.length - 1];

  const trainedDays = await getTrainedDaysForYear(userId, selectedYear);
  const currentStreak = await getCurrentStreak(userId);
  const longestStreak = getLongestStreakForYear(trainedDays);

  return {
    year: selectedYear,
    availableYears,
    trainedDays,
    currentStreak,
    longestStreak,
  };
}
