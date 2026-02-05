// Libraries
import { z } from "zod";

export const updateMemberSchema = z.object({
  role: z.enum(["owner", "member"], {
    errorMap: () => ({ message: "Role must be 'owner' or 'member'" }),
  }),
});

export type UpdateMemberInput = z.infer<typeof updateMemberSchema>;
