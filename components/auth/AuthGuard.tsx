"use client";

import { useAuth } from "@/hooks/useAuth";
import { useUser } from "@/hooks/useUser";
import { redirect, RedirectType } from "next/navigation";
import { PropsWithChildren, useEffect } from "react";

export const AuthGuard = ({ children }: PropsWithChildren) => {
  const { session } = useAuth();
  const { data: user, isLoading } = useUser(session ? session.userId : null);

  if (!session) {
    console.log("Nextjs is redirecting on the server ...");
    redirect("/login", RedirectType.replace);
  }

  if (isLoading || !user) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
};
