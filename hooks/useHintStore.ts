// src/store/useHintStore.ts
import { create } from "zustand";
import { z } from "zod";

const HintRequestSchema = z.object({
  messages: z.array(
    z.object({
      role: z.enum(["human", "ai"]),
      content: z.string(),
    })
  ),
  user_id: z.number(),
  situation_id: z.number(),
});

const HintResponseSchema = z.object({
  hint: z.string(),
});

interface HintState {
  hint: string | null;
  isLoading: boolean;
  error: string | null;
  fetchHint: (params: z.infer<typeof HintRequestSchema>) => Promise<string>;
}

export const useHintStore = create<HintState>((set) => ({
  hint: null,
  isLoading: false,
  error: null,

  fetchHint: async (params) => {
    set({ isLoading: true });
    try {
      // Validate request parameters
      const validatedParams = HintRequestSchema.parse(params);

      const response = await fetch(
        `${process.env["NEXT_PUBLIC_ASSISTANT_URL"]}/assistant/hint`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(validatedParams),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Validate response
      const validatedResponse = HintResponseSchema.parse(data);

      set({
        hint: validatedResponse.hint,
        isLoading: false,
        error: null,
      });

      return validatedResponse.hint;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to fetch hint",
        isLoading: false,
      });
      return "";
    }
  },
}));
