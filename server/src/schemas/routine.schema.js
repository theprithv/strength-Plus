import { z } from "zod";

const idParam = z.object({
  id: z.string().min(1, "ID is required"),
});

// === POST / ===
export const createRoutineBody = z.object({
  name: z.string().min(1, "Routine name is required").max(100),
}).passthrough();

// === PATCH /:id ===
export const updateRoutineParams = idParam;
export const updateRoutineBody = z.object({
  name: z.string().min(1).max(100).optional(),
  currentDay: z.number().int().min(1).optional(),
}).passthrough();

// === PATCH /:id/set-current, DELETE /:id, GET /:id/exercises ===
export const routineIdParams = idParam;

// === POST /:id/exercises ===
export const addExerciseBody = z.object({
  exerciseId: z.string().min(1, "exerciseId is required"),
  day: z.number().int().min(1).optional(),
});

// === POST /exercises/:id/sets ===
export const addSetBody = z.object({
  targetReps: z.number().int().min(0).optional(),
  targetWeight: z.number().min(0).optional(),
});

// === PATCH /:id/reorder ===
export const reorderBody = z.object({
  exercises: z.array(
    z.object({
      id: z.string().min(1),
      order: z.number().int().min(0),
    })
  ).min(1, "exercises array is required"),
});

// === GET /:id/exercises ===
export const routineExercisesQuery = z.object({
  day: z.coerce.number().int().min(1).optional(),
});

// === DELETE /:routineId/exercises/by-exercise/:exerciseId ===
export const removeByExerciseParams = z.object({
  routineId: z.string().min(1),
  exerciseId: z.string().min(1),
});
