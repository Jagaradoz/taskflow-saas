// Libraries
import { z } from "zod";

// Local
import { toTitleCase } from "../utils/string.js";

export const createOrgSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(255, "Name too long")
    .transform((val) => toTitleCase(val.trim())),
  description: z.string().optional(),
});

export const updateOrgSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(255, "Name too long")
    .transform((val) => toTitleCase(val.trim()))
    .optional(),
  description: z.string().optional(),
});

export type CreateOrgInput = z.infer<typeof createOrgSchema>;
export type UpdateOrgInput = z.infer<typeof updateOrgSchema>;
