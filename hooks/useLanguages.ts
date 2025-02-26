import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { z } from "zod";

export const LanguageSchema = z.object({
  code: z.string(),
  name: z.string(),
  has_tts: z.boolean(),
  id: z.number(),
});

export type Language = z.infer<typeof LanguageSchema>;

const getLanguages = async () =>
  api.get(`/languages`).then((res) => z.array(LanguageSchema).parse(res.data));

export const useLanguages = () => {
  return useQuery({ queryKey: ["languages"], queryFn: getLanguages });
};
