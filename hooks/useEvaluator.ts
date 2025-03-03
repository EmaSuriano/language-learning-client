import { api } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { z } from "zod";

// Define schemas with Zod
const EvaluatorRequestSchema = z.object({
  messages: z.array(
    z.object({ role: z.enum(["human", "ai"]), content: z.string() })
  ),
  user_id: z.number(),
  situation_id: z.number(),
});

const EvaluatorOverviewSchema = z.object({
  grammar: z.number(),
  vocabulary: z.number(),
  fluency: z.number(),
});

// Types based on schemas
type EvaluatorRequest = z.infer<typeof EvaluatorRequestSchema>;
export type EvaluatorOverviewResponse = z.infer<typeof EvaluatorOverviewSchema>;

const getOverview = async (params: EvaluatorRequest) =>
  api
    .post("/evaluator/overview", params)
    .then((res) => EvaluatorOverviewSchema.parse(res.data));

export const useEvaluatorOverview = () => {
  return useMutation<EvaluatorOverviewResponse, Error, EvaluatorRequest>({
    mutationFn: getOverview,
  });
};

// Simple metrics report with simulated streaming effect
export const useMetricsReport = () => {
  const [partialReport, setPartialReport] = useState("");

  const mutation = useMutation({
    mutationFn: async (params: EvaluatorRequest) => {
      // Clear previous content
      setPartialReport("");

      // Get the data
      const response = await api.post("/evaluator/report", params, {
        headers: {
          "Content-Type": "application/json",
          Accept: "text/event-stream",
        },
        responseType: "text",
      });

      // Process the response
      const lines = response.data.split("\n");
      let report = "";

      // Process in chunks to simulate streaming
      for (const line of lines) {
        if (!line.startsWith("data: ")) continue;

        const data = line.slice(5).trim();
        if (data === "[DONE]") break;

        try {
          const { content } = JSON.parse(data);
          report += content;

          // Update partial report with small delay to simulate streaming
          setPartialReport(report);
          await new Promise((r) => setTimeout(r, 10));
        } catch (e) {
          console.error("JSON parsing error:", e);
        }
      }

      return report;
    },
  });

  return {
    ...mutation,
    data: partialReport || mutation.data,
  };
};
