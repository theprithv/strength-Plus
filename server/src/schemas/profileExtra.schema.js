import { z } from "zod";

export const saveNoteBody = z.object({
  title: z.string().max(200).optional(),
  text: z.string().max(5000).optional(),
});

export const createTodoBody = z.object({
  text: z.string().min(1, "Todo text is required").max(500),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD format"),
});

export const todoIdParams = z.object({
  id: z.string().min(1, "ID is required"),
});

export const prSlotBody = z.object({
  slotIndex: z.number().int().min(0, "slotIndex is required"),
  exerciseId: z.string().min(1, "exerciseId is required"),
});
