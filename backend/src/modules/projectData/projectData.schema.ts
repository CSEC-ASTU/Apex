import { z } from "zod";

export const UpdateMissingInformationSchema = z.object({
  addressed: z.boolean(),
  note: z.string().optional()
});

export const UpdateConflictSchema = z.object({
  resolved: z.boolean(),
  resolution: z.string().optional()
});
