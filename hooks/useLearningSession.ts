"use client";

import { useAuth } from "./useAuth";
import { useUser } from "./useUser";

export const useLearningSession = () => {
  const { session, logout } = useAuth();
  const { data: user } = useUser(session ? session.userId : null);

  if (!session || !user) {
    throw new Error("Authenticated user requested but not found");
  }

  return { user, logout };
};
