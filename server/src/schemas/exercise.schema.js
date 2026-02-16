import { z } from "zod";

const idParam = z.object({
  id: z.string().min(1, "ID is required"),
});

// === POST / ===
export const createExerciseBody = z.object({
  name: z.string().min(1, "Name is required").max(100),
  primaryMuscle: z.string().min(1, "Primary muscle is required"),
  equipment: z.string().min(1, "Equipment is required"),
  otherMuscles: z.array(z.string()).optional(),
  howToSteps: z.array(z.string()).optional(),
});

// === PUT /:id ===
export const updateExerciseParams = idParam;
export const updateExerciseBody = createExerciseBody;

// === DELETE /:id, GET /:id/stats, GET /:id/history, GET /:id/pr ===
export const exerciseIdParams = idParam;
