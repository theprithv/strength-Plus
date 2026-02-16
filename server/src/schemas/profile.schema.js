import { z } from "zod";

// === POST / and PUT / ===
export const upsertProfileBody = z.object({
  name: z.string().min(1).max(100).optional(),
  goal: z.string().max(100).optional(),
  age: z.number().int().min(0).max(150).optional(),
  height: z.number().min(0).max(300).optional(),
  weight: z.number().min(0).max(500).optional(),
  imageUrl: z.string().optional(),
}).passthrough();

// === GET /duration-stats ===
export const durationStatsQuery = z.object({
  range: z.coerce.number().int().min(1).max(365).optional(),
});
