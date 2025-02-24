import { z } from "zod";

export const LanguageSchema = z.object({
  code: z.string(),
  name: z.string(),
  has_tts: z.boolean(),
  id: z.number(),
});

export type Language = z.infer<typeof LanguageSchema>;
