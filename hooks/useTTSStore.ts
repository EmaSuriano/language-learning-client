// src/store/useTTSStore.ts
import { formatVoiceTitle } from "@/lib/helpers";
import { create } from "zustand";

interface TTSState {
  supportedLanguages: string[];
  voices: string[];
  isLoading: boolean;
  error: string | null;
  fetchSupportedLanguages: () => Promise<void>;
  fetchVoices: (lang: string) => Promise<void>;
}

export const useTTSStore = create<TTSState>((set) => ({
  supportedLanguages: [],
  voices: [],
  isLoading: false,
  error: null,

  fetchSupportedLanguages: async () => {
    set({ isLoading: true });
    try {
      const response = await fetch(
        `${process.env["NEXT_PUBLIC_ASSISTANT_URL"]}/tts/languages`
      );
      const data = await response.json();
      set({ supportedLanguages: data, isLoading: false });
    } catch (error) {
      set({ error: "Failed to fetch TTS languages", isLoading: false });
    }
  },

  fetchVoices: async (lang: string) => {
    set({ isLoading: true });
    try {
      const response = await fetch(
        `${process.env["NEXT_PUBLIC_ASSISTANT_URL"]}/tts/voices/${lang}`
      );
      const data: string[] = await response.json();

      // sort the voices by alphabetical order
      data.sort((a, b) =>
        formatVoiceTitle(a).localeCompare(formatVoiceTitle(b))
      );

      set({ voices: data, isLoading: false });
    } catch (error) {
      set({ error: "Failed to fetch voices", isLoading: false });
    }
  },
}));
