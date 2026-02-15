import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ===== CONFIGURATION =====
const START_DATE = "2025-01-01";
const END_DATE = "2026-01-31"; // 👈 NOW GOES UNTIL TODAY
const SKIP_CHANCE = 0.3;       // 30% chance to skip a day

// Muscle Group Mappings
const SPLITS = {
  "Push Day": ["chest", "shoulders", "triceps", "neck"],
  "Pull Day": ["lats", "upper back", "traps", "lower back", "biceps", "forearms"],
  "Legs": ["quadriceps", "hamstrings", "calves", "glutes", "abductors", "adductors"],
  "Upper Body": ["chest", "shoulders", "triceps", "lats", "upper back", "biceps"],
  "Lower Body": ["quadriceps", "hamstrings", "calves", "glutes"],
  "Full Body": ["chest", "lats", "shoulders", "quadriceps", "hamstrings", "biceps", "triceps"]
};

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const normalize = (s) => s?.toLowerCase().replace(/_/g, " ").trim();

function getSplitForDate(date) {
  const day = date.getUTCDay();
  switch (day) {
    case 1: return "Push Day";   // Mon
    case 2: return "Pull Day";   // Tue
    case 3: return "Legs";       // Wed
    case 4: return "Push Day";   // Thu
    case 5: return "Pull Day";   // Fri
    case 6: return "Legs";       // Sat
    case 0: return "Rest";       // Sun
    default: return "Full Body";
  }
}

async function getGroupedExercises() {
  const allExercises = await prisma.exercise.findMany();
  if (allExercises.length === 0) throw new Error("No exercises found! Run 'npm run seed' first.");

  return {
    all: allExercises,
    getBySplit: (splitName) => {
      const targetMuscles = SPLITS[splitName] || [];
      return allExercises.filter(ex => 
        targetMuscles.includes(normalize(ex.primaryMuscle))
      );
    }
  };
}

async function createWorkoutForDate(userId, date, exerciseLibrary, progress) {
  const split = getSplitForDate(date);
  if (split === "Rest") return false;

  let pool = exerciseLibrary.getBySplit(split);
  if (pool.length < 3) pool = exerciseLibrary.all;

  const selected = pool
    .sort(() => 0.5 - Math.random())
    .slice(0, randomInt(4, 6)); // 4-6 exercises

  if (selected.length === 0) return false;

  const workout = await prisma.workout.create({
    data: {
      userId,
      splitName: split,
      date: date,
      startTime: date,
      endTime: new Date(date.getTime() + 60 * 60 * 1000),
      isCompleted: true,
      totalSets: 0, 
      totalVolume: 0,
      totalReps: 0
    },
  });

  let totalVolume = 0;
  let totalSets = 0;
  let totalReps = 0;
  let orderIndex = 0;

  for (const exercise of selected) {
    const workoutExercise = await prisma.workoutExercise.create({
      data: {
        workoutId: workout.id,
        exerciseId: exercise.id,
        order: orderIndex++,
      },
    });

    const isHeavy = ["barbell", "machine", "plate"].includes(normalize(exercise.equipment));
    
    // Progress: Start light (30kg), end heavy (90kg)
    const strengthGain = Math.floor(progress * (isHeavy ? 40 : 15)); 
    const baseWeight = isHeavy ? 40 : 10;
    
    const weight = baseWeight + strengthGain + randomInt(-2, 5); // Add some daily fluctuation
    const setsCount = randomInt(3, 4);

    for (let i = 0; i < setsCount; i++) {
      const reps = randomInt(8, 12);
      await prisma.setLog.create({
        data: {
          workoutExerciseId: workoutExercise.id,
          setNumber: i + 1,
          reps: reps,
          weight: weight,
          volume: reps * weight,
        },
      });
      totalVolume += reps * weight;
      totalSets++;
      totalReps += reps;
    }
  }

  await prisma.workout.update({
    where: { id: workout.id },
    data: { totalVolume, totalSets, totalReps }
  });

  return true;
}

async function generate() {
  console.log("🧹 Clearing old history first...");
  
  // 1. DELETE OLD DATA (Clean Slate)
  await prisma.setLog.deleteMany({});
  await prisma.workoutExercise.deleteMany({});
  await prisma.workout.deleteMany({});
  
  console.log("🚀 Generating Fresh History (Jan 2025 -> Jan 2026)...");

  try {
    const user = await prisma.user.findFirst();
    if (!user) return console.log("❌ No user found.");

    const exerciseLibrary = await getGroupedExercises();
    
    const start = new Date(START_DATE + "T10:00:00Z");
    const end = new Date(END_DATE + "T10:00:00Z");
    const totalDays = (end - start) / (1000 * 60 * 60 * 24);

    let current = new Date(start);
    let count = 0;

    while (current <= end) {
      const daysPassed = (current - start) / (1000 * 60 * 60 * 24);
      const progress = daysPassed / totalDays;

      if (Math.random() > SKIP_CHANCE) {
        const workoutDate = new Date(current);
        const created = await createWorkoutForDate(user.id, workoutDate, exerciseLibrary, progress);
        if (created) {
          process.stdout.write(".");
          count++;
        }
      }
      current.setDate(current.getDate() + 1);
    }

    console.log(`\n✅ Generated ${count} workouts ending TODAY!`);
    console.log("   Refresh your Dashboard now.");

  } catch (error) {
    console.error("\n❌ Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

generate();