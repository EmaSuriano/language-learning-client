import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { z } from "zod";

const LevelChangeSchema = z.enum(["MAINTAIN", "INCREASE", "DECREASE"]);

const LearningSessionSchema = z.object({
  user_id: z.number(),
  situation_id: z.number(),
  language_id: z.number(),
  level: z.number(),
  date: z.string(), // Accept any string without datetime validation
  grammar_score: z.number(),
  vocabulary_score: z.number(),
  fluency_score: z.number(),
  goals_score: z.number(),
  id: z.number(),
  level_change: LevelChangeSchema,
});

const LearningHistorySchema = z.array(LearningSessionSchema);

export type UserLearningHistory = z.infer<typeof LearningHistorySchema>;
export type UserLearningLevelChange = z.infer<typeof LevelChangeSchema>;
export type LearningSessionInput = Omit<
  z.infer<typeof LearningSessionSchema>,
  "id" | "level_change"
>;

const getUserLearningHistory = async (userId: number) =>
  api
    .get(`/learning-history/users/${userId}`)
    .then((res) => LearningHistorySchema.parse(res.data));

const getUserLearningProgression = async (userId: number) =>
  api
    .get(`/learning-history/users/${userId}/progression`)
    .then((res) => LevelChangeSchema.parse(res.data));

const addLearningSession = async (learningData: LearningSessionInput) => {
  return api
    .post(`/learning-history/users/${learningData.user_id}`, learningData)
    .then((res) => LearningSessionSchema.parse(res.data));
};

export const useUserLearningHistory = (userId: number) => {
  return useQuery({
    queryKey: ["learning-history", userId],
    queryFn: () => getUserLearningHistory(userId),
    gcTime: 0,
  });
};

export const useUserLearningProgression = (userId: number) => {
  return useQuery({
    queryKey: ["learning-history", userId, "progression"],
    queryFn: () => getUserLearningProgression(userId),
    gcTime: 0,
  });
};

export const useAddLearningSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addLearningSession,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["learning-history"] });
    },
  });
};
