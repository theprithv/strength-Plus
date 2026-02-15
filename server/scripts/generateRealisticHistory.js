import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ---------- helpers ----------
const rand = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const chance = (p) => Math.random() < p;

const addDays = (date, d) => {
  const n = new Date(date);
  n.setDate(n.getDate() + d);
  return n;
};

// ---------- muscle maps ----------
const MUSCLE_GROUPS = {
  chest: ["chest"],
  back: ["back", "lats"],
  shoulders: ["shoulders"],
  arms: ["biceps", "triceps", "forearms"],
  legs: ["quads", "hamstrings", "glutes", "calves"],
  full: ["chest", "back", "shoulders", "biceps", "triceps", "legs"],
};

// ---------- phase config ----------
const PHASES = [
  {
    name: "Bro Split",
    start: "2025-01-01",
    end: "2025-01-31",
    exercises: [4, 5],
    days: ["chest", "back", "shoulders", "arms", "legs"],
    trainChance: 0.75,
  },
  {
    name: "Push Pull Legs",
    start: "2025-02-01",
    end: "2025-02-28",
    exercises: [6, 7],
    days: ["push", "pull", "legs"],
    trainChance: 0.8,
  },
  {
    name: "Full Body",
    start: "2025-03-01",
    end: "2025-04-30",
    exercises: [7, 8],
    days: ["full"],
    trainChance: 0.6,
  },
  {
    name: "Arnold Split",
    start: "2025-05-01",
    end: "2026-01-30",
    exercises: [5, 6],
    days: ["chest_back", "shoulders_arms", "legs"],
    trainChance: 0.8,
  },
];

// ---------- exercise selection ----------
function pickExercises(all, muscles, count) {
  const filtered = all.filter((e) =>
    muscles.includes(e.primaryMuscle)
  );

  return filtered
    .sort(() => 0.5 - Math.random())
    .slice(0, count);
}

// ---------- main ----------
async function generate() {
  console.log("🔥 Generating realistic history...");

  const user = await prisma.user.findFirst();
  if (!user) throw new Error("No user found");

  const exercises = await prisma.exercise.findMany({
    where: { isCustom: false },
  });

  // CLEAN OLD DATA (TEST DB)
  await prisma.setLog.deleteMany();
  await prisma.workoutExercise.deleteMany();
  await prisma.workout.deleteMany();
  await prisma.routineExercise.deleteMany();
  await prisma.routine.deleteMany();

  for (const phase of PHASES) {
    // create routine
    const routine = await prisma.routine.create({
      data: {
        userId: user.id,
        name: phase.name,
        isCurrent: true,
      },
    });

    // disable previous routines
    await prisma.routine.updateMany({
      where: {
        userId: user.id,
        id: { not: routine.id },
      },
      data: { isCurrent: false },
    });

    let dayIndex = 0;
    let date = new Date(phase.start);
    const end = new Date(phase.end);

    while (date <= end) {
      const isSunday = date.getDay() === 0;

      if ((isSunday && !chance(0.2)) || !chance(phase.trainChance)) {
        date = addDays(date, 1);
        continue;
      }

      const splitDay = phase.days[dayIndex % phase.days.length];
      dayIndex++;

      let muscles = [];

      if (splitDay === "push") muscles = ["chest", "shoulders", "triceps"];
      else if (splitDay === "pull") muscles = ["back", "biceps"];
      else if (splitDay === "legs") muscles = MUSCLE_GROUPS.legs;
      else if (splitDay === "chest_back")
        muscles = ["chest", "back"];
      else if (splitDay === "shoulders_arms")
        muscles = ["shoulders", "biceps", "triceps"];
      else if (splitDay === "full")
        muscles = MUSCLE_GROUPS.full;
      else muscles = MUSCLE_GROUPS[splitDay];

      const workout = await prisma.workout.create({
        data: {
          userId: user.id,
          splitName: phase.name,
          startTime: date,
          endTime: addDays(date, 0),
          isCompleted: true,
        },
      });

      const picked = pickExercises(
        exercises,
        muscles,
        rand(...phase.exercises)
      );

      let order = 0;
      for (const ex of picked) {
        const we = await prisma.workoutExercise.create({
          data: {
            workoutId: workout.id,
            exerciseId: ex.id,
            order: order++,
          },
        });

        const sets = rand(3, 5);
        for (let s = 1; s <= sets; s++) {
          await prisma.setLog.create({
            data: {
              workoutExerciseId: we.id,
              setNumber: s,
              reps: rand(6, 12),
              weight: rand(20, 100),
              volume: 0,
            },
          });
        }
      }

      date = addDays(date, 1);
    }
  }

  console.log("✅ Realistic history generated successfully");
  await prisma.$disconnect();
}

generate().catch(console.error);
