import { z } from "zod";
import { Language, LanguageSchema } from "./language";

export const UserSchema = z.object({
  id: z.number(),
  email: z.string().email(),
  current_language: LanguageSchema,
  language_level: z.number().min(1).max(5),
  interests: z.array(z.string()),
  voice_id: z.string().nullable(),
});

export type User = z.infer<typeof UserSchema>;

export type UserUpdate = Partial<{
  language_code: Language["code"];
  language_level: User["language_level"];
  interests: User["interests"];
  voice_id: User["voice_id"];
}>;
