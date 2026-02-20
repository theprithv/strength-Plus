import { z } from "zod";

const idParam = z.object({
  id: z.string().min(1, "ID is required"),
});

export const createRoutineBody = z.object({
  name: z.string().min(1, "Routine name is required").max(100),
}).passthrough();

export const updateRoutineParams = idParam;
export const updateRoutineBody = z.object({
  name: z.string().min(1).max(100).optional(),
  currentDay: z.number().int().min(1).optional(),
}).passthrough();

export const routineIdParams = idParam;

export const addExerciseBody = z.object({
  exerciseId: z.string().min(1, "exerciseId is required"),
  day: z.number().int().min(1).optional(),
});

export const addSetBody = z.object({
  targetReps: z.number().int().min(0).optional(),
  targetWeight: z.number().min(0).optional(),
});

export const reorderBody = z.object({
  exercises: z.array(
    z.object({
      id: z.string().min(1),
      order: z.number().int().min(0),
    })
  ).min(1, "exercises array is required"),
});

export const routineExercisesQuery = z.object({
  day: z.coerce.number().int().min(1).optional(),
});

export const removeByExerciseParams = z.object({
  routineId: z.string().min(1),
  exerciseId: z.string().min(1),
});
