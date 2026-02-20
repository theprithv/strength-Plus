import { z } from "zod";

export const muscleStatsQuery = z.object({
  muscle: z.string().min(1, "muscle is required"),
  range: z.enum(["week", "month"]).optional(),
});

export const calendarQuery = z.object({
  month: z.string().regex(/^\d{4}-\d{2}$/, "month must be YYYY-MM format"),
});

export const yearCalendarQuery = z.object({
  year: z.coerce.number().int().min(2000).max(2100).optional(),
});

export const rangeQuery = z.object({
  range: z.enum(["week", "month"]).optional(),
});

export const muscleOverloadQuery = z.object({
  muscle: z.string().min(1, "muscle is required"),
  range: z.coerce.number().int().min(1).optional(),
  exercise: z.string().optional(),
});
