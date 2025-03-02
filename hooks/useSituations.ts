// src/hooks/useSituations.ts
import { api } from "@/lib/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";

export const SituationSchema = z.object({
  id: z.number(),
  name: z.string(),
  scenario_description: z.string(),
  user_goals: z.array(z.string()),
  difficulty: z.enum(["easy", "medium", "hard"]),
});

export const SituationProgressSchema = z.object({
  conversation_over: z.boolean(),
  goals: z.array(z.object({ name: z.string(), done: z.boolean() })),
});

const SituationProgressRequestSchema = z.object({
  messages: z.array(
    z.object({ role: z.enum(["human", "ai"]), content: z.string() })
  ),
  user_id: z.number(),
  situation_id: z.number(),
});

export type SituationProgress = z.infer<typeof SituationProgressSchema>;
export type SituationProgressRequest = z.infer<
  typeof SituationProgressRequestSchema
>;
export type Situation = z.infer<typeof SituationSchema>;

const getSituations = () =>
  api
    .get("/situations")
    .then((res) => z.array(SituationSchema).parse(res.data));

const getSituationById = (id: string) =>
  api.get(`/situations/${id}`).then((res) => SituationSchema.parse(res.data));

const getSituationProgress = (params: SituationProgressRequest) =>
  api
    .post(`/assistant/chat/progress`, params)
    .then((res) => SituationProgressSchema.parse(res.data));

// Fetch all situations
export const useSituations = () => {
  return useQuery<Situation[]>({
    queryKey: ["situations"],
    queryFn: getSituations,
  });
};

// Get a single situation by ID
export const useSituation = (situationId: string | null) => {
  return useQuery<Situation | null, Error>({
    queryKey: ["situation", situationId],
    queryFn: () => {
      if (!situationId) throw new Error("Situation ID is required");
      return getSituationById(situationId);
    },
    enabled: !!situationId,
  });
};

// Hook for situation progress
// export const useSituationProgress = (situationId: number | null) => {
//   const { data: situation } = useSituation(situationId);
//   const [progress, setProgress] = useState<SituationProgress>(
//     situation?.user_goals.map((name) => ({ name, done: false })) || []
//   );

//   // Update progress when situation changes
//   useEffect(() => {
//     if (situation) {
//       setProgress(situation.user_goals.map((name) => ({ name, done: false })));
//     }
//   }, [situation]);

//   return { progress, setProgress };
// };

// Fetch progress from API
export const useSituationProgress = (params: SituationProgressRequest) => {
  return useQuery<SituationProgress>({
    queryKey: ["situation-progress", params.situation_id],
    queryFn: () => getSituationProgress(params),
    enabled: params.messages.length > 0,
    gcTime: 0,
  });
};
