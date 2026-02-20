/**
 * Calculates current and longest workout streaks.
 * Allows a 1-day gap (rest day) between sessions.
 * @param {Array} calendarData - Array of objects with 'date' (YYYY-MM-DD)
 * @param {Date} referenceDate - Reference point for current streak (defaults to now)
 */
export function calculateStreaks(calendarData, referenceDate = new Date()) {
  if (!calendarData || !calendarData.length) {
    return { currentStreak: 0, longestStreak: 0 };
  }

  const uniqueDates = [...new Set(calendarData.map(d => d.date))].sort();

  const dates = uniqueDates.map(d => {
    const [year, month, day] = d.split('-').map(Number);
    return new Date(Date.UTC(year, month - 1, day));
  });

  // Helper to calculate day difference
  const getDiffDays = (d1, d2) => {
    const msPerDay = 1000 * 60 * 60 * 24;
    return Math.round(Math.abs(d1 - d2) / msPerDay);
  };

  let longestStreak = 1;
  let currentRun = 1;

  for (let i = 1; i < dates.length; i++) {
    const diff = getDiffDays(dates[i], dates[i - 1]);

    if (diff <= 2) {
      currentRun++;
    } else {
      currentRun = 1;
    }
    if (currentRun > longestStreak) longestStreak = currentRun;
  }

  let currentStreak = 0;

  const refUTC = new Date(Date.UTC(
    referenceDate.getFullYear(), 
    referenceDate.getMonth(), 
    referenceDate.getDate()
  ));

  const lastWorkoutDate = dates[dates.length - 1];
  const daysSinceLastWorkout = getDiffDays(refUTC, lastWorkoutDate);

  // Consider streak active if last workout was within 2 days (allows 1 rest day)
  if (daysSinceLastWorkout <= 2) {
    currentStreak = 1;
    for (let i = dates.length - 1; i > 0; i--) {
      const diff = getDiffDays(dates[i], dates[i - 1]);
      if (diff <= 2) {
        currentStreak++;
      } else {
        break;
      }
    }
  }

  return { currentStreak, longestStreak };
}