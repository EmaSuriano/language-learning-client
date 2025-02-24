// src/hooks/useAuthUser.ts
"use client";

import { UserUpdate } from "@/schemas/user";
import { useUserStore } from "./useUserStore";

export const useAuthUser = () => {
  const { user, updateUser } = useUserStore();

  if (!user) {
    throw new Error("Authenticated user requested but not found");
  }

  return {
    user,
    updateUser: (update: UserUpdate) => updateUser(user.id.toString(), update),
  };
};
