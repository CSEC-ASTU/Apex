import { z } from "zod";

export const CreateTaskSchema = z.object({
  title: z.string().min(3),
  description: z.string().optional(),
  weight: z.number().min(1).optional(),
  origin: z.enum(["USER", "AGENT"]).optional()
});

export const UpdateTaskSchema = z.object({
  title: z.string().min(3).optional(),
  description: z.string().optional(),
  status: z.enum(["TODO", "IN_PROGRESS", "DONE"]).optional(),
  weight: z.number().min(1).optional(),
  origin: z.enum(["USER", "AGENT"]).optional()
});

export const RecommendTasksSchema = z.object({
  projectId: z.string()
});
