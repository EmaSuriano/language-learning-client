import { useQuery } from "@tanstack/react-query";
import { formatVoiceTitle } from "@/lib/helpers";
import { z } from "zod";
import { api } from "@/lib/api";

const TTSLanguagesSchema = z.array(z.string());
const TTSVoicesSchema = z.array(z.string());

const fetchLanguages = async () =>
  api.get(`/tts/languages`).then((res) => TTSLanguagesSchema.parse(res.data));

const fetchVoices = async (lang: string) =>
  api.get(`/tts/voices/${lang}`).then((res) => TTSVoicesSchema.parse(res.data));

export const useTTSLanguages = () => {
  return useQuery<string[], Error>({
    queryKey: ["tts", "languages"],
    queryFn: fetchLanguages,
    staleTime: 24 * 60 * 60 * 1000, // 24 hours - TTS languages rarely change
  });
};

export const useTTSVoices = (lang: string | null) => {
  return useQuery<string[], Error>({
    queryKey: ["tts", "voices", lang],
    queryFn: async () => {
      if (!lang) throw new Error("Language is required");

      const voices = await fetchVoices(lang);
      return voices.sort((a: string, b: string) =>
        formatVoiceTitle(a).localeCompare(formatVoiceTitle(b))
      );
    },
    enabled: !!lang, // Only run the query if language is provided
    staleTime: 60 * 60 * 1000, // 1 hour
  });
};
