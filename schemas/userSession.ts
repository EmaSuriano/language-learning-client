import { z } from "zod";

export const UserSessionSchema = z.object({
  userId: z.string(),
  email: z.string().email(),
});

export type UserSession = z.infer<typeof UserSessionSchema>;
