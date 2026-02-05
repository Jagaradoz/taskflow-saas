// Libraries
import { z } from "zod";

export const createOrgSchema = z.object({
  name: z.string().min(1, "Name is required").max(255, "Name too long"),
  description: z.string().optional(),
});

export const updateOrgSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(255, "Name too long")
    .optional(),
  description: z.string().optional(),
});

export type CreateOrgInput = z.infer<typeof createOrgSchema>;
export type UpdateOrgInput = z.infer<typeof updateOrgSchema>;
