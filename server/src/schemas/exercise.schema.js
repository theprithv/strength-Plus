import { z } from "zod";

const idParam = z.object({
  id: z.string().min(1, "ID is required"),
});

export const createExerciseBody = z.object({
  name: z.string().min(1, "Name is required").max(100),
  primaryMuscle: z.string().min(1, "Primary muscle is required"),
  equipment: z.string().min(1, "Equipment is required"),
  otherMuscles: z.array(z.string()).optional(),
  howToSteps: z.array(z.string()).optional(),
});

export const updateExerciseParams = idParam;
export const updateExerciseBody = createExerciseBody;

export const exerciseIdParams = idParam;
