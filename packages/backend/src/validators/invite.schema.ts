// Libraries
import { z } from "zod";

export const createInviteSchema = z.object({
  userId: z.string().uuid({ message: "Invalid user ID format" }),
  role: z.enum(["admin", "member"], {
    errorMap: () => ({ message: "Role must be 'admin' or 'member'" }),
  }),
});

export type CreateInviteInput = z.infer<typeof createInviteSchema>;
