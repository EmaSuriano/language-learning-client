import { create } from "zustand";
import { z } from "zod";

const MessageSchema = z.object({
  role: z.enum(["human", "ai"]),
  content: z.string(),
});

const MetricsRequestSchema = z.object({
  messages: z.array(MessageSchema),
  user_id: z.number(),
  situation_id: z.number(),
});

const MetricsResponseSchema = z.object({
  metrics: z.object({
    grammar: z.number(),
    vocabulary: z.number(),
    fluency: z.number(),
  }),
});

export type Metrics = z.infer<typeof MetricsResponseSchema>["metrics"];
export type MetricsRequest = z.infer<typeof MetricsRequestSchema>;

interface MetricsState {
  report: string;
  metrics: Metrics | null;
  isStreaming: boolean;
  error: string | null;
  fetchReport: (params: MetricsRequest) => Promise<void>;
  resetState: () => void;
}

export const useMetricsStore = create<MetricsState>((set) => ({
  report: "",
  metrics: null,
  isStreaming: false,
  error: null,

  resetState: () => {
    set({
      report: "",
      metrics: null,
      isStreaming: false,
      error: null,
    });
  },

  fetchReport: async (params) => {
    set({ isStreaming: true, report: "", error: null });

    try {
      // Validate request parameters
      const validatedParams = MetricsRequestSchema.parse(params);

      const response = await fetch(
        `${process.env["NEXT_PUBLIC_ASSISTANT_URL"]}/evaluator/report`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "text/event-stream",
          },
          body: JSON.stringify(validatedParams),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      if (!response.body) {
        throw new Error("No response body received");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulatedReport = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) {
          set({ isStreaming: false });
          break;
        }

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(5).trim();

            if (data === "[DONE]") {
              set({ isStreaming: false });
              return;
            }

            try {
              const { content } = JSON.parse(data);
              console.log(content);
              accumulatedReport += content;
              set({ report: accumulatedReport });
            } catch (e) {
              console.error("JSON parsing error:", e);
              set({
                error: `JSON parse error: ${String(e)}`,
                isStreaming: false,
              });
            }
          }
        }
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch report";

      set({
        error: errorMessage,
        isStreaming: false,
      });
    }
  },
}));
