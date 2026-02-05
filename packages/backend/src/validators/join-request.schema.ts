// Libraries
import { z } from "zod";

export const createRequestSchema = z.object({
  message: z.string().max(500).optional(),
});

export const resolveRequestSchema = z.object({
  action: z.enum(["approve", "reject"], {
    errorMap: () => ({ message: "Action must be 'approve' or 'reject'" }),
  }),
  role: z
    .enum(["member"], {
      errorMap: () => ({ message: "Role must be 'member'" }),
    })
    .optional(),
});

export type CreateRequestInput = z.infer<typeof createRequestSchema>;
export type ResolveRequestInput = z.infer<typeof resolveRequestSchema>;
