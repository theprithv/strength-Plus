import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ==========================================
// CONFIGURATION
// ==========================================
const START_DATE = "2024-01-01";
const END_DATE = new Date().toISOString().split("T")[0]; // Today's date
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

  const user = await prisma.user.findUnique({
    where: { email: "theprithv.2004@gmail.com" },
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

  // 2. CLEAR EXISTING WORKOUT & ROUTINE DATA for this user
  console.log("🧹 Clearing old workout and routine data...");
  await prisma.setLog.deleteMany({ where: { workoutExercise: { workout: { userId: user.id } } } });
  await prisma.workoutExercise.deleteMany({ where: { workout: { userId: user.id } } });
  await prisma.workout.deleteMany({ where: { userId: user.id } });
  
  await prisma.routineSet.deleteMany({ where: { routineExercise: { routine: { userId: user.id } } } });
  await prisma.routineExercise.deleteMany({ where: { routine: { userId: user.id } } });
  await prisma.routine.deleteMany({ where: { userId: user.id } });
  console.log("✨ Database clean.");

  // 2.5 Generate a beautiful Professional Routine for the UI
  console.log("📝 Generating Professional PPL Routine...");
  const routine = await prisma.routine.create({
    data: {
      userId: user.id,
      name: "Professional PPL Split",
      notes: "High-volume 6-day split designed for advanced hypertrophy and strength progression.",
      isCurrent: true,
      currentDay: 1,
    }
  });

  const generateRoutineExercises = async (muscles, dayNum) => {
    let order = 0;
    for (const m of muscles) {
      const pool = muscleToExercises[m] || [];
      if (pool.length > 0) {
        // Pick best 2 exercises
        const picked = pool.slice(0, 2);
        for (const ex of picked) {
          const re = await prisma.routineExercise.create({
            data: {
              routineId: routine.id,
              exerciseId: ex.id,
              day: dayNum,
              order: order++,
            }
          });
          // 4 working sets per exercise
          for (let s = 1; s <= 4; s++) {
            await prisma.routineSet.create({
              data: {
                routineExerciseId: re.id,
                targetReps: s === 1 ? 12 : s === 4 ? 6 : 8,
              }
            });
          }
        }
      }
    }
  };

  // Day 1: Push
  await generateRoutineExercises(["chest", "shoulders", "triceps"], 1);
  // Day 2: Pull
  await generateRoutineExercises(["back", "lats", "biceps", "traps"], 2);
  // Day 3: Legs
  await generateRoutineExercises(["quads", "quadriceps", "hamstrings", "glutes", "calves"], 3);
  // Day 4: Push (Heavy)
  await generateRoutineExercises(["chest", "shoulders", "triceps"], 4);
  // Day 5: Pull (Heavy)
  await generateRoutineExercises(["back", "lats", "biceps", "traps"], 5);
  // Day 6: Legs (Heavy)
  await generateRoutineExercises(["quads", "quadriceps", "hamstrings", "glutes", "calves"], 6);
  // Day 7: Rest (No exercises needed)


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

    let totalVolume = 0;
    let totalSets = 0;
    let totalReps = 0;
    
    const exercisesData = [];

    for (let i = 0; i < dailyExercises.length; i++) {
        const ex = dailyExercises[i];
        
        const setsData = [];

        // --- PERFORMANCE FLUCTUATIONS ---
        const roll = Math.random();
        let performanceMultiplier = 1;

        if (roll < 0.8) {
            const gain = (normalize(ex.equipment).includes("barbell")) ? randomFloat(0.1, 0.3) : randomFloat(0.05, 0.15);
            weightProgressTracker[ex.id] += gain;
            performanceMultiplier = 1.02;
        } else if (roll < 0.9) {
            performanceMultiplier = 1.0;
        } else {
            performanceMultiplier = randomFloat(0.9, 0.95);
        }

        if (isDeloadWeek) performanceMultiplier *= 0.7;

        const setsCount = isDeloadWeek ? 2 : randomInt(3, 4);
        const currentWeight = weightProgressTracker[ex.id];

        for (let s = 1; s <= setsCount; s++) {
            const fatigueDrop = 1 - (s * 0.02);
            let weight = Math.round((currentWeight * performanceMultiplier * fatigueDrop) / 0.5) * 0.5;
            if (normalize(ex.equipment).includes("bodyweight")) weight = 0;

            const reps = isDeloadWeek ? 12 : randomInt(6, 12);
            
            setsData.push({
              setNumber: s,
              reps,
              weight,
              volume: reps * weight,
            });

            totalVolume += (reps * weight);
            totalSets++;
            totalReps += reps;
        }
        
        exercisesData.push({
          exerciseId: ex.id,
          order: i,
          sets: { create: setsData }
        });
    }
    
    // Ensure the date field is purely the calendar date at midnight UTC
    const calendarDate = new Date(Date.UTC(
      currentDate.getUTCFullYear(),
      currentDate.getUTCMonth(),
      currentDate.getUTCDate(),
      0, 0, 0, 0
    ));

    const duration = isDeloadWeek ? randomInt(40, 55) : randomInt(70, 100);
    
    let success = false;
    let retries = 0;
    while (!success && retries < 3) {
      try {
        await prisma.workout.create({
          data: {
            userId: user.id,
            date: calendarDate,
            startTime: currentDate,
            endTime: new Date(currentDate.getTime() + duration * 60 * 1000),
            duration: duration,
            splitName: `Pro ${split.name} Day`,
            isCompleted: true,
            totalVolume,
            totalSets,
            totalReps,
            exercises: { create: exercisesData }
          }
        });
        success = true;
      } catch (err) {
        retries++;
        console.error(`Error saving workout, retrying (${retries}/3)...`, err.message);
        await new Promise(r => setTimeout(r, 2000));
      }
    }

    workoutsGenerated++;
    if (workoutsGenerated % 100 === 0) {
      console.log(`✅ Generated ${workoutsGenerated} sessions...`);
      // Small delay to let Neon breathe
      await new Promise(r => setTimeout(r, 500));
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
