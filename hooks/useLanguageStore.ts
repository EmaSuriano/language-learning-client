// src/store/useLanguageStore.ts
import { create } from "zustand";
import { z } from "zod";
import { persist } from "zustand/middleware";

export const LanguageSchema = z.object({
  code: z.string(),
  name: z.string(),
  has_tts: z.boolean(),
  id: z.number(),
});

export type Language = z.infer<typeof LanguageSchema>;

interface LanguageState {
  languages: Language[];
  isLoading: boolean;
  error: string | null;
  fetchLanguages: () => Promise<void>;
}

const API_URL = `${process.env["NEXT_PUBLIC_ASSISTANT_URL"]}/languages`;

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      languages: [],
      isLoading: false,
      error: null,

      fetchLanguages: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch(API_URL);
          if (!response.ok) throw new Error("Failed to fetch languages");
          const data = await response.json();
          const languages = z.array(LanguageSchema).parse(data);
          set({ languages, isLoading: false });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "Invalid data",
            isLoading: false,
          });
        }
      },
    }),
    { name: "language-store" }
  )
);
