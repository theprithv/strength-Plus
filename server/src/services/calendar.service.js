import prisma from "../config/prisma.js";
import { getMonthRange } from "../utils/monthRange.js";
import { calculateStreaks } from "../utils/streakUtils.js";

/**
 * Returns calendar data only
 * [{ date: YYYY-MM-DD, sessions: number }]
 */
export async function getCalendarData(userId, month) {
  const { start, end } = getMonthRange(month);

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
    },
  });

  const dayMap = new Map();

  for (const workout of workouts) {
    const date = workout.startTime ?? workout.createdAt;
    const dateKey = date.toISOString().slice(0, 10);
    dayMap.set(dateKey, (dayMap.get(dateKey) || 0) + 1);
  }

  return Array.from(dayMap.entries())
    .map(([date, sessions]) => ({ date, sessions }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

/**
 * Returns calendar + streaks
 */
export async function getCalendarWithStreaks(userId, month) {
  const calendar = await getCalendarData(userId, month);
  const { currentStreak, longestStreak } = calculateStreaks(calendar);

  return {
    calendar,
    currentStreak,
    longestStreak,
  };
}
