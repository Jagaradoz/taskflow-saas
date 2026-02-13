// Libraries
import { z } from "zod";

export const createInviteSchema = z.object({
  email: z.string().email({ message: "Invalid email format" }),
  role: z.enum(["member"], {
    errorMap: () => ({ message: "Role must be 'member'" }),
  }),
});

export type CreateInviteInput = z.infer<typeof createInviteSchema>;
