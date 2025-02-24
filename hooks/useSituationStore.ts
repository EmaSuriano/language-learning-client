// src/store/useSituationStore.ts
import { create } from "zustand";
import { z } from "zod";
import { User } from "./useUserStore";

export const SituationSchema = z.object({
  id: z.number(),
  name: z.string(),
  scenario_description: z.string(),
  user_goals: z.array(z.string()),
  difficulty: z.enum(["easy", "medium", "hard"]),
});

export const SituationProgressSchema = z.array(
  z.object({
    name: z.string(),
    done: z.boolean(),
  })
);

const SituationProgressRequestSchema = z.object({
  messages: z.array(
    z.object({
      role: z.enum(["human", "ai"]),
      content: z.string(),
    })
  ),
  user_id: z.number(),
  situation_id: z.number(),
});

export type SituationProgress = z.infer<typeof SituationProgressSchema>;
export type SituationProgressRequest = z.infer<
  typeof SituationProgressRequestSchema
>;

export type Situation = z.infer<typeof SituationSchema>;

interface SituationState {
  situations: Situation[];
  selectedSituation: Situation | null;
  isLoading: boolean;
  error: string | null;
  progress: SituationProgress;
  fetchSituations: () => Promise<void>;
  selectSituation: (situationId: number) => void;
  fetchProgress: (params: SituationProgressRequest) => Promise<void>;
}

const API_URL = `${process.env["NEXT_PUBLIC_ASSISTANT_URL"]}/situations`;
const PROGRESS_API_URL = `${process.env["NEXT_PUBLIC_ASSISTANT_URL"]}/assistant/chat/progress`;

export const useSituationStore = create<SituationState>()((set, get) => ({
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
      set({
        selectedSituation: situation,
        progress: situation.user_goals.map((name) => ({ name, done: false })),
      });
    } else {
      set({ error: `Situation with id ${situationId} not found` });
    }
  },

  fetchProgress: async (params) => {
    try {
      const validatedParams = SituationProgressRequestSchema.parse(params);

      const response = await fetch(PROGRESS_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validatedParams),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const progress = SituationProgressSchema.parse(data.progress);

      set({ progress, error: null });
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "Failed to fetch progress",
        progress: [], // Reset progress on error
      });
    }
  },
}));
