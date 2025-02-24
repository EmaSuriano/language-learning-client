"use client";

import { useAuth } from "@/hooks/useAuth";
import { useUserStore } from "@/hooks/useUserStore";
import { redirect, RedirectType } from "next/navigation";
import { PropsWithChildren, useEffect } from "react";

export const AuthGuard = ({ children }: PropsWithChildren) => {
  const { userSession, isAuthenticated } = useAuth();
  const { user, isLoading, fetchUser } = useUserStore();

  console.log(user, userSession);

  if (!isAuthenticated) {
    console.log("Nextjs is redirecting on the server ...");
    redirect("/login", RedirectType.replace);
  }

  useEffect(() => {
    if (userSession && !user) {
      fetchUser(userSession.userId);
    }
  }, [userSession, user, fetchUser]);

  if (isLoading || !user) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
};
