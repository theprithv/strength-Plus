import { z } from "zod";

export const startWorkoutBody = z.object({
  splitName: z.string().min(1, "splitName is required"),
});

export const addExerciseParams = z.object({
  workoutId: z.string().min(1, "workoutId is required"),
});
export const addExerciseBody = z.object({
  exerciseId: z.string().min(1, "exerciseId is required"),
  order: z.number().int().optional(),
});

export const addSetParams = z.object({
  workoutExerciseId: z.string().min(1, "workoutExerciseId is required"),
});
export const addSetBody = z.object({
  reps: z.coerce.number().min(0, "reps must be >= 0"),
  weight: z.coerce.number().min(0, "weight must be >= 0"),
});

export const finishWorkoutParams = z.object({
  workoutId: z.string().min(1, "workoutId is required"),
});

export const exerciseIdParams = z.object({
  id: z.string().min(1, "ID is required"),
});
export const updateWorkoutExerciseBody = z.object({
  exerciseId: z.string().min(1, "exerciseId is required"),
});

export const setIdParams = z.object({
  setId: z.string().min(1, "setId is required"),
});
export const updateSetBody = z.object({
  reps: z.coerce.number().min(0, "reps must be >= 0"),
  weight: z.coerce.number().min(0, "weight must be >= 0"),
});

export const dateParams = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD format"),
});
