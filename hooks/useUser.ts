import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { LanguageSchema, Language } from "./useLanguages";
import { api } from "@/lib/api";

const UserSchema = z.object({
  id: z.number(),
  email: z.string().email(),
  current_language: LanguageSchema,
  language_level: z.number().min(1).max(5),
  voice_id: z.string().nullable(),
});

export type User = z.infer<typeof UserSchema>;

export type UserUpdate = Partial<{
  language_code: Language["code"];
  language_level: User["language_level"];
  voice_id: User["voice_id"];
}>;

const getUser = async (userId: string) =>
  api.get(`/users/${userId}`).then((res) => UserSchema.parse(res.data));

const updateUser = async (userId: string, params: UserUpdate) =>
  api
    .patch(`/users/${userId}`, params)
    .then((res) => UserSchema.parse(res.data));

export const useUser = (userId: string | null) => {
  return useQuery<User, Error>({
    queryKey: ["user", userId],
    queryFn: () => {
      if (!userId) throw new Error("User ID is required");
      return getUser(userId);
    },
    enabled: !!userId,
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation<User, Error, { id: string; userData: UserUpdate }>({
    mutationFn: ({ id, userData }) => updateUser(id, userData),
    onSuccess: (updatedUser, variables) => {
      queryClient.setQueryData(["user", variables.id], updatedUser);
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
};
