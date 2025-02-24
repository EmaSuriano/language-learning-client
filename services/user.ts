import { UserSchema, UserUpdate } from "@/schemas/user";
import { api } from "./api";

export const getUser = async (userId: string) =>
  api.get(`/users/${userId}`).then((res) => UserSchema.parse(res.data));

export const updateUser = async (userId: string, params: UserUpdate) =>
  api
    .patch(`/users/${userId}`, params)
    .then((res) => UserSchema.parse(res.data));
