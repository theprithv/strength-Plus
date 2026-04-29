/**
 * backfillDemoAccount.js
 *
 * Populates the demo account (theprithv.2004@gmail.com) with realistic,
 * progressively-loaded PPL workout history from Feb 19, 2026 up to today.
 *
 * Usage:
 *   node --env-file=.env scripts/backfillDemoAccount.js
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ─────────────────────────────────────────────
// CONFIGURATION
// ─────────────────────────────────────────────
const DEMO_EMAIL = "theprithv.2004@gmail.com";

// Fixed start date: February 19, 2026
const START_DATE = new Date("2026-02-19T00:00:00.000Z");

// End today
const today = new Date();
const END_DATE = new Date(today);
END_DATE.setHours(23, 59, 59, 999);

const REST_CHANCE = 0.18;            // 18% random rest day
const MAX_CONSECUTIVE_DAYS = 5;      // Force rest after 5 consecutive days

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────
const randomFloat = (min, max) => Math.random() * (max - min) + min;
const randomInt   = (min, max) => Math.floor(randomFloat(min, max + 1));
const chance      = (p) => Math.random() < p;

function addDays(date, d) {
  const n = new Date(date);
  n.setDate(n.getDate() + d);
  return n;
}

const normalize = (s) => s?.toLowerCase().replace(/_/g, " ").trim() ?? "";

/** Pick `n` random items from an array without replacement */
function pickRandom(arr, n) {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(n, shuffled.length));
}

/**
 * Return a workout start time on the given date.
 * Varies between early morning (6 AM) and evening (7 PM).
 */
function buildStartTime(date) {
  const d = new Date(date);
  // Hour: 6–19
  d.setHours(randomInt(6, 19), randomInt(0, 55), 0, 0);
  return d;
}

// ─────────────────────────────────────────────
// MAIN
// ─────────────────────────────────────────────
async function runBackfill() {
  console.log("━".repeat(55));
  console.log("🏋️  Strength-Plus — Demo Account Backfill");
  console.log("━".repeat(55));
  console.log(`📅  Period : ${START_DATE.toDateString()} → ${END_DATE.toDateString()}`);
  console.log(`📧  Target : ${DEMO_EMAIL}`);
  console.log();

  // 1. Resolve user
  const user = await prisma.user.findUnique({
    where: { email: DEMO_EMAIL },
    include: { profile: true },
  });

  if (!user) {
    console.error(`❌  No user found with email "${DEMO_EMAIL}". Aborting.`);
    process.exit(1);
  }

  console.log(`✅  Found user: ${user.name} (id: ${user.id})`);

  // 2. Clear existing workouts for this user (scoped — no other users affected)
  console.log("🧹  Clearing existing workout data for this account…");
  await prisma.setLog.deleteMany({
    where: { workoutExercise: { workout: { userId: user.id } } },
  });
  await prisma.workoutExercise.deleteMany({
    where: { workout: { userId: user.id } },
  });
  await prisma.workout.deleteMany({ where: { userId: user.id } });
  console.log("✨  Clean slate ready.\n");

  // 3. Load exercises and group by normalised primary muscle
  const allExercises = await prisma.exercise.findMany({
    where: { isDeprecated: false },
  });

  if (allExercises.length === 0) {
    console.error("❌  No exercises in database. Run the global seed first.");
    process.exit(1);
  }

  console.log(`💪  Loaded ${allExercises.length} exercises from database.\n`);

  const muscleMap = {};
  for (const ex of allExercises) {
    const m = normalize(ex.primaryMuscle);
    if (!muscleMap[m]) muscleMap[m] = [];
    muscleMap[m].push(ex);
  }

  // 4. Define PPL splits with fallback muscle aliases
  //    Each entry lists several muscle-name variants so we still pick exercises
  //    even if the DB uses slightly different naming.
  const SPLITS = [
    {
      name: "Push",
      label: "Chest & Shoulders & Triceps",
      muscleGroups: [
        ["chest", "pectorals", "pectoral"],
        ["shoulders", "shoulder", "deltoids", "front deltoid"],
        ["triceps", "tricep"],
      ],
      exercisesPerGroup: 2,
    },
    {
      name: "Pull",
      label: "Back & Biceps",
      muscleGroups: [
        ["back", "lats", "latissimus dorsi", "rhomboids", "middle back"],
        ["biceps", "bicep"],
        ["traps", "trapezius"],
      ],
      exercisesPerGroup: 2,
    },
    {
      name: "Legs",
      label: "Quads, Hamstrings & Glutes",
      muscleGroups: [
        ["quads", "quadriceps", "quadricep"],
        ["hamstrings", "hamstring"],
        ["glutes", "glute", "gluteus maximus"],
        ["calves", "calf"],
      ],
      exercisesPerGroup: 2,
    },
  ];

  // 5. Build a progressive-overload weight tracker
  //    Starting weights are conservative — realistic for a 2-month-old account.
  const weightTracker = {};
  for (const ex of allExercises) {
    const equip = normalize(ex.equipment);
    const name  = normalize(ex.name);

    if (equip.includes("barbell")) {
      if (name.includes("deadlift"))   weightTracker[ex.id] = 80;
      else if (name.includes("squat")) weightTracker[ex.id] = 60;
      else                             weightTracker[ex.id] = 40;
    } else if (equip.includes("dumbbell")) {
      weightTracker[ex.id] = 10;
    } else if (equip.includes("machine") || equip.includes("cable")) {
      weightTracker[ex.id] = 25;
    } else if (equip.includes("bodyweight") || equip === "body weight") {
      weightTracker[ex.id] = 0;
    } else {
      weightTracker[ex.id] = 20;
    }
  }

  // Helper: resolve exercises for a split's muscle group list
  function pickExercisesForSplit(split) {
    const result = [];
    for (const variants of split.muscleGroups) {
      let pool = [];
      for (const v of variants) {
        if (muscleMap[v]) pool.push(...muscleMap[v]);
      }
      // de-dupe by id
      pool = [...new Map(pool.map((e) => [e.id, e])).values()];
      result.push(...pickRandom(pool, split.exercisesPerGroup));
    }
    return result;
  }

  // 6. Iterate day-by-day
  let cursor = new Date(START_DATE);
  let splitIndex = 0;
  let consecutiveDays = 0;
  let workoutsGenerated = 0;

  console.log("🗓️  Generating workout history…\n");

  while (cursor <= END_DATE) {
    const dayOfWeek = cursor.getDay(); // 0=Sun, 6=Sat

    // Rest on Sunday always, random chance otherwise, or forced after streak
    const forceRest = consecutiveDays >= MAX_CONSECUTIVE_DAYS;
    const shouldRest = dayOfWeek === 0 || forceRest || chance(REST_CHANCE);

    if (shouldRest) {
      consecutiveDays = 0;
      cursor = addDays(cursor, 1);
      continue;
    }

    consecutiveDays++;

    // Determine week index from start (for deload logic)
    const weekIndex = Math.floor((cursor - START_DATE) / (7 * 24 * 60 * 60 * 1000));
    const isDeloadWeek = weekIndex > 0 && weekIndex % 5 === 0; // deload every 5th week

    // Cycle through Push → Pull → Legs
    const split = SPLITS[splitIndex % 3];
    splitIndex++;

    const dailyExercises = pickExercisesForSplit(split);

    if (dailyExercises.length === 0) {
      cursor = addDays(cursor, 1);
      continue;
    }

    // Build workout timestamps
    const startTime = buildStartTime(cursor);
    const duration  = isDeloadWeek ? randomInt(40, 55) : randomInt(65, 95);
    const endTime   = new Date(startTime.getTime() + duration * 60_000);

    // Calendar date = midnight UTC of this cursor day (what calendar service filters on)
    const calendarDate = new Date(
      Date.UTC(cursor.getFullYear(), cursor.getMonth(), cursor.getDate())
    );

    // Create Workout record
    const workout = await prisma.workout.create({
      data: {
        userId:      user.id,
        date:        calendarDate,
        startTime:   startTime,
        endTime:     endTime,
        duration:    duration,
        splitName:   `${split.name} Day — ${split.label}`,
        isCompleted: true,
        notes:       isDeloadWeek
          ? "Deload week — keeping it light and clean."
          : chance(0.15)
          ? "Felt really strong today. Hit some new rep PRs!"
          : null,
      },
    });

    let totalVolume = 0;
    let totalSets   = 0;
    let totalReps   = 0;

    for (let i = 0; i < dailyExercises.length; i++) {
      const ex = dailyExercises[i];

      const we = await prisma.workoutExercise.create({
        data: {
          workoutId:  workout.id,
          exerciseId: ex.id,
          order:      i,
        },
      });

      // Progressive overload: slight weight increase ~70% of sessions
      const roll = Math.random();
      let perfMult = 1.0;

      if (roll < 0.70) {
        // Improvement
        const gain = normalize(ex.equipment).includes("barbell")
          ? randomFloat(0.5, 1.5)
          : randomFloat(0.25, 0.75);
        weightTracker[ex.id] += gain;
        perfMult = 1.02;
      } else if (roll < 0.85) {
        // Plateau
        perfMult = 1.0;
      } else {
        // Bad day / fatigue
        perfMult = randomFloat(0.88, 0.96);
      }

      if (isDeloadWeek) perfMult *= 0.65;

      const setsCount = isDeloadWeek ? 2 : randomInt(3, 5);
      const baseWeight = weightTracker[ex.id];

      for (let s = 1; s <= setsCount; s++) {
        const fatigueDrop = 1 - s * 0.015; // slight fatigue per set
        let weight = Math.round((baseWeight * perfMult * fatigueDrop) / 0.5) * 0.5;
        const isBodyweight = normalize(ex.equipment).includes("bodyweight") || normalize(ex.equipment) === "body weight";
        if (isBodyweight) weight = 0;

        const reps = isDeloadWeek ? randomInt(10, 15) : randomInt(6, 12);
        const volume = reps * weight;

        await prisma.setLog.create({
          data: {
            workoutExerciseId: we.id,
            setNumber: s,
            reps,
            weight,
            volume,
          },
        });

        totalVolume += volume;
        totalSets++;
        totalReps += reps;
      }
    }

    // Write aggregate back to the workout row
    await prisma.workout.update({
      where: { id: workout.id },
      data: { totalVolume, totalSets, totalReps },
    });

    workoutsGenerated++;

    if (workoutsGenerated % 10 === 0) {
      console.log(`   ✔  ${workoutsGenerated} sessions generated…`);
    }

    cursor = addDays(cursor, 1);
  }

  // 7. Update profile PR lifts based on final tracker weights
  const bench    = allExercises.find((e) => normalize(e.name).includes("barbell bench press"));
  const squat    = allExercises.find((e) => normalize(e.name).includes("barbell squat") || normalize(e.name) === "squat");
  const deadlift = allExercises.find((e) => normalize(e.name).includes("deadlift"));

  if (user.profile) {
    await prisma.profile.update({
      where: { userId: user.id },
      data: {
        benchMax:    bench    ? Math.round(weightTracker[bench.id]    * 2) / 2 : undefined,
        squatMax:    squat    ? Math.round(weightTracker[squat.id]    * 2) / 2 : undefined,
        deadliftMax: deadlift ? Math.round(weightTracker[deadlift.id] * 2) / 2 : undefined,
        bio:
          "Consistent strength training since February 2026. Following a PPL split with progressive overload. ~10 weeks in and already seeing solid progress. Focused on building a strong, aesthetic physique.",
        goal: "Build Muscle & Strength",
      },
    });
    console.log("\n📊  Profile PR lifts updated.");
  } else {
    console.log("\n⚠️  No profile found for this user — skipping PR update.");
  }

  console.log();
  console.log("━".repeat(55));
  console.log(`🏆  DONE! Generated ${workoutsGenerated} workouts for ${DEMO_EMAIL}`);
  console.log("━".repeat(55));
}

runBackfill()
  .catch((err) => {
    console.error("❌  Fatal error:", err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
