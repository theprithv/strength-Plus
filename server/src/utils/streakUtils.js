/**
 * Calculates current and longest streaks.
 * Allows for a 1-day gap (rest day) between workouts.
 * * @param {Array} calendarData - Array of objects with 'date' (YYYY-MM-DD)
 * @param {Date} referenceDate - The date to calculate current streak from (defaults to now)
 */
export function calculateStreaks(calendarData, referenceDate = new Date()) {
  if (!calendarData || !calendarData.length) {
    return { currentStreak: 0, longestStreak: 0 };
  }

  // 1. Prepare and sort unique dates (handle multiple sessions on same day)
  const uniqueDates = [...new Set(calendarData.map(d => d.date))].sort();
  
  // Convert to Date objects at midnight UTC for consistent comparison
  const dates = uniqueDates.map(d => {
    const [year, month, day] = d.split('-').map(Number);
    return new Date(Date.UTC(year, month - 1, day));
  });

  // Helper to calculate day difference
  const getDiffDays = (d1, d2) => {
    const msPerDay = 1000 * 60 * 60 * 24;
    return Math.round(Math.abs(d1 - d2) / msPerDay);
  };

  // 2. Calculate Longest Streak
  let longestStreak = 1;
  let currentRun = 1;

  for (let i = 1; i < dates.length; i++) {
    const diff = getDiffDays(dates[i], dates[i - 1]);

    if (diff <= 2) {
      // Gap of 1 day (diff=1) or 2 days (diff=2) continues streak
      currentRun++;
    } else {
      currentRun = 1;
    }
    if (currentRun > longestStreak) longestStreak = currentRun;
  }

  // 3. Calculate Current Streak
  let currentStreak = 0;
  
  // Create a UTC comparison date for "Today"
  const refUTC = new Date(Date.UTC(
    referenceDate.getFullYear(), 
    referenceDate.getMonth(), 
    referenceDate.getDate()
  ));

  const lastWorkoutDate = dates[dates.length - 1];
  const daysSinceLastWorkout = getDiffDays(refUTC, lastWorkoutDate);

  // If last workout was within 2 days (today, yesterday, or day before), streak is active
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