import { api } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";
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

// Hook for fetching hints
export const useEvaluatorOverview = () => {
  return useMutation<EvaluatorOverviewResponse, Error, EvaluatorRequest>({
    mutationFn: async (params: EvaluatorRequest) => {
      const validatedParams = EvaluatorRequestSchema.parse(params);
      return getOverview(validatedParams);
    },
  });
};
