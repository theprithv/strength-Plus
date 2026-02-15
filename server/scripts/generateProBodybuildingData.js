import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ==========================================
// CONFIGURATION
// ==========================================
const START_DATE = "2024-01-01";
const END_DATE = "2026-02-13";
const REST_CHANCE = 0.15; // 15% chance to take a rest day randomly
const MAX_CONSECUTIVE_TRAINING_DAYS = 6;

// ==========================================
// HELPERS
// ==========================================
const randomFloat = (min, max) => Math.random() * (max - min) + min;
const randomInt = (min, max) => Math.floor(randomFloat(min, max + 1));
const chance = (p) => Math.random() < p;

function addDays(date, d) {
  const n = new Date(date);
  n.setDate(n.getDate() + d);
  return n;
}

const normalize = (s) => s?.toLowerCase().replace(/_/g, " ").trim();

// ==========================================
// DATA GENERATION
// ==========================================
async function runGenerator() {
  console.log("🚀 Starting Refined Professional Athlete Data Generation...");

  const user = await prisma.user.findFirst({
    include: { profile: true }
  });

  if (!user) {
    console.error("❌ ERROR: No user found. Please register a user first.");
    process.exit(1);
  }

  console.log(`👤 Targeted User: ${user.name} (${user.email})`);

  // 1. Fetch Exercises and group by Primary Muscle
  const allExercises = await prisma.exercise.findMany();
  if (allExercises.length === 0) {
    console.error("❌ ERROR: No exercises found in database. Run global seed first.");
    process.exit(1);
  }

  const muscleToExercises = {};
  allExercises.forEach(ex => {
    const muscle = normalize(ex.primaryMuscle);
    if (!muscleToExercises[muscle]) muscleToExercises[muscle] = [];
    muscleToExercises[muscle].push(ex);
  });

  // 2. CLEAR EXISTING WORKOUT DATA for this user
  console.log("🧹 Clearing old workout data...");
  await prisma.setLog.deleteMany({ where: { workoutExercise: { workout: { userId: user.id } } } });
  await prisma.workoutExercise.deleteMany({ where: { workout: { userId: user.id } } });
  await prisma.workout.deleteMany({ where: { userId: user.id } });
  console.log("✨ Database clean.");

  // 3. Define Training Splits
  const PPL_SPLITS = [
    { name: "Push", muscles: ["chest", "shoulders", "triceps"] },
    { name: "Pull", muscles: ["back", "lats", "biceps", "traps"] },
    { name: "Legs", muscles: ["quads", "quadriceps", "hamstrings", "glutes", "calves"] }
  ];

  const weightProgressTracker = {}; // exerciseId -> currentBaseWeight
  allExercises.forEach(ex => {
    // Assign a reasonable starting weight based on equipment
    const equip = normalize(ex.equipment);
    if (equip.includes("barbell")) {
        if (normalize(ex.name).includes("deadlift") || normalize(ex.name).includes("squat")) weightProgressTracker[ex.id] = 60;
        else weightProgressTracker[ex.id] = 40;
    } else if (equip.includes("dumbbell")) {
        weightProgressTracker[ex.id] = 12;
    } else if (equip.includes("machine") || equip.includes("cable")) {
        weightProgressTracker[ex.id] = 30;
    } else {
        weightProgressTracker[ex.id] = 0; // bodyweight
    }
  });

  let currentDate = new Date(START_DATE + "T10:00:00Z");
  const endDate = new Date(END_DATE + "T10:00:00Z");
  let splitIndex = 0;
  let consecutiveTrainingDays = 0;
  let workoutsGenerated = 0;
  let totalWeeks = 0;

  console.log("🏋️ Generating 2-year timeline...");

  while (currentDate <= endDate) {
    const dayOfWeek = currentDate.getUTCDay();

    // REST DAY LOGIC
    // 1. Forced rest after 6 days
    // 2. Random 15% chance
    const shouldRest = consecutiveTrainingDays >= MAX_CONSECUTIVE_TRAINING_DAYS || chance(REST_CHANCE);

    if (shouldRest) {
      consecutiveTrainingDays = 0;
      currentDate = addDays(currentDate, 1);
      if (dayOfWeek === 0) totalWeeks++; // Increment week on Sundays
      continue;
    }

    consecutiveTrainingDays++;
    
    // Determine Split
    const split = PPL_SPLITS[splitIndex % 3];
    splitIndex++;

    // --- PROGRESSION & DELOAD LOGIC ---
    const currentWeek = Math.floor((currentDate - new Date(START_DATE)) / (1000 * 60 * 60 * 24 * 7));
    const isDeloadWeek = currentWeek > 0 && currentWeek % 9 === 0;

    // --- SELECT EXERCISES FOR THE DAY ---
    let dailyExercises = [];
    split.muscles.forEach(m => {
        const pool = muscleToExercises[m] || [];
        if (pool.length > 0) {
            // Pick 2 random exercises for each muscle in the split
            const picked = pool.sort(() => 0.5 - Math.random()).slice(0, 2);
            dailyExercises.push(...picked);
        }
    });

    if (dailyExercises.length === 0) {
        currentDate = addDays(currentDate, 1);
        continue;
    }

    // --- CREATE WORKOUT ---
    const duration = isDeloadWeek ? randomInt(40, 55) : randomInt(70, 100);
    const workout = await prisma.workout.create({
      data: {
        userId: user.id,
        date: currentDate,
        startTime: currentDate,
        endTime: new Date(currentDate.getTime() + duration * 60 * 1000),
        duration: duration,
        splitName: `Pro ${split.name} Day`,
        isCompleted: true,
      }
    });

    let totalVolume = 0;
    let totalSets = 0;
    let totalReps = 0;

    for (let i = 0; i < dailyExercises.length; i++) {
        const ex = dailyExercises[i];
        const we = await prisma.workoutExercise.create({
          data: {
            workoutId: workout.id,
            exerciseId: ex.id,
            order: i,
          }
        });

        // --- PERFORMANCE FLUCTUATIONS ---
        const roll = Math.random();
        let performanceMultiplier = 1;

        if (roll < 0.8) {
            // IMPROVEMENT (80%)
            // Increase base weight by a tiny bit for next time
            const gain = (normalize(ex.equipment).includes("barbell")) ? randomFloat(0.1, 0.3) : randomFloat(0.05, 0.15);
            weightProgressTracker[ex.id] += gain;
            performanceMultiplier = 1.02; // Small boost this session
        } else if (roll < 0.9) {
            // PLATEAU (10%)
            performanceMultiplier = 1.0;
        } else {
            // REGRESSION / FATIGUE (10%)
            performanceMultiplier = randomFloat(0.9, 0.95);
        }

        // Apply Deload Week modifier
        if (isDeloadWeek) performanceMultiplier *= 0.7;

        const setsCount = isDeloadWeek ? 2 : randomInt(3, 4);
        const currentWeight = weightProgressTracker[ex.id];

        for (let s = 1; s <= setsCount; s++) {
            const fatigueDrop = 1 - (s * 0.02);
            let weight = Math.round((currentWeight * performanceMultiplier * fatigueDrop) / 0.5) * 0.5;
            if (normalize(ex.equipment).includes("bodyweight")) weight = 0;

            const reps = isDeloadWeek ? 12 : randomInt(6, 12);
            
            await prisma.setLog.create({
              data: {
                workoutExerciseId: we.id,
                setNumber: s,
                reps,
                weight,
                volume: reps * weight,
              }
            });

            totalVolume += (reps * weight);
            totalSets++;
            totalReps += reps;
        }
    }

    // Update aggregate stats
    await prisma.workout.update({
      where: { id: workout.id },
      data: { totalVolume, totalSets, totalReps }
    });

    workoutsGenerated++;
    if (workoutsGenerated % 100 === 0) {
      console.log(`✅ Generated ${workoutsGenerated} sessions...`);
    }

    currentDate = addDays(currentDate, 1);
  }

  // Final PR sync to profile
  const bench = allExercises.find(e => normalize(e.name) === "barbell bench press");
  const squat = allExercises.find(e => normalize(e.name) === "barbell squat");
  const deadlift = allExercises.find(e => normalize(e.name) === "deadlift");

  await prisma.profile.update({
    where: { userId: user.id },
    data: {
      benchMax: bench ? weightProgressTracker[bench.id] : null,
      squatMax: squat ? weightProgressTracker[squat.id] : null,
      deadliftMax: deadlift ? weightProgressTracker[deadlift.id] : null,
      bio: "Professional Athlete. 2 years of consistent high-intensity training data generated with progressive overload and fatigue management.",
      goal: "Bodybuilding / Strength"
    }
  });

  console.log("------------------------------------------");
  console.log(`🏆 SUCCESS: Generated ${workoutsGenerated} pro-level workouts.`);
  console.log("------------------------------------------");
}

runGenerator()
  .catch(err => console.error(err))
  .finally(() => prisma.$disconnect());
