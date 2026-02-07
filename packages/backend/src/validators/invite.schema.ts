// Libraries
import { z } from "zod";

export const createInviteSchema = z.object({
  userId: z.string().uuid({ message: "Invalid user ID format" }),
  role: z.enum(["member"], {
    errorMap: () => ({ message: "Role must be 'member'" }),
  }),
});

export type CreateInviteInput = z.infer<typeof createInviteSchema>;
