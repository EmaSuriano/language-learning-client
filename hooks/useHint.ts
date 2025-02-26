import { api } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";

// Define schemas with Zod
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

// Types based on schemas
type HintRequest = z.infer<typeof HintRequestSchema>;
type HintResponse = z.infer<typeof HintResponseSchema>;

const getHint = async (params: HintRequest) =>
  api
    .post("/assistant/hint", params)
    .then((res) => HintResponseSchema.parse(res.data));

// Hook for fetching hints
export const useHint = () => {
  return useMutation<HintResponse, Error, HintRequest>({
    mutationFn: async (params: HintRequest) => {
      const validatedParams = HintRequestSchema.parse(params);
      return getHint(validatedParams);
    },
  });
};
