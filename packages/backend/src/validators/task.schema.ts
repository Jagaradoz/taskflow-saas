// Libraries
import { z } from "zod";

export const createTaskSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(255, "Title must be 255 characters or less"),
});

export const updateTaskSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  isDone: z.boolean().optional(),
  isPinned: z.boolean().optional(),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
