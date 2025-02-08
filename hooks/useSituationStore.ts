// src/store/useSituationStore.ts
import { create } from "zustand";
import { z } from "zod";
import { persist } from "zustand/middleware";

export const SituationSchema = z.object({
  id: z.number(),
  name: z.string(),
  scenario_description: z.string(),
  user_goals: z.array(z.string()),
});

export const SituationProgressSchema = z.array(
  z.object({
    name: z.string(),
    done: z.boolean(),
  })
);

export type SituationProgress = z.infer<typeof SituationProgressSchema>;

export type Situation = z.infer<typeof SituationSchema>;

interface SituationState {
  situations: Situation[];
  selectedSituation: Situation | null;
  isLoading: boolean;
  error: string | null;
  progress: SituationProgress;
  fetchSituations: () => Promise<void>;
  selectSituation: (situationId: number) => void;
}

const API_URL = `${process.env["NEXT_PUBLIC_ASSISTANT_URL"]}/situations`;

export const useSituationStore = create<SituationState>()(
  persist(
    (set, get) => ({
      situations: [],
      selectedSituation: null,
      progress: [],
      isLoading: false,
      error: null,

      fetchSituations: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch(API_URL);
          if (!response.ok) throw new Error("Failed to fetch situations");

          const data = await response.json();
          const situations = z.array(SituationSchema).parse(data);

          const sortedSituations = [...situations].sort((a, b) => a.id - b.id);

          set({ situations: sortedSituations, isLoading: false });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "Invalid data",
            isLoading: false,
          });
        }
      },

      selectSituation: (situationId: number) => {
        const { situations } = get();
        const situation = situations.find((s) => s.id === situationId);
        if (situation) {
          set({ selectedSituation: situation });
        } else {
          set({ error: `Situation with id ${situationId} not found` });
        }
      },
    }),
    { name: "situation-store" }
  )
);
