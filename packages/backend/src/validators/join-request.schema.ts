// Libraries
import { z } from "zod";

export const createRequestSchema = z.object({
  message: z.string().max(500).optional(),
});

export const approveRequestSchema = z.object({
  role: z
    .enum(["owner", "member"], {
      errorMap: () => ({ message: "Role must be 'owner' or 'member'" }),
    })
    .optional(),
});

export type CreateRequestInput = z.infer<typeof createRequestSchema>;
export type ApproveRequestInput = z.infer<typeof approveRequestSchema>;
