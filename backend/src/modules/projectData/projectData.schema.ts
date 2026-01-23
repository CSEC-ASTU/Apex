import { z } from "zod";

export const UpdateMissingInfoStatusSchema = z.object({
  addressed: z.boolean(),
  note: z.string().optional()
});

export const UpdateConflictStatusSchema = z.object({
  resolved: z.boolean(),
  resolution: z.string().optional()
});
