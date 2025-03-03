"use client";

import { useAuth } from "@/hooks/useAuth";
import { useUser } from "@/hooks/useUser";
import { redirect, RedirectType, useRouter } from "next/navigation";
import { PropsWithChildren, useEffect } from "react";

export const AuthGuard = ({ children }: PropsWithChildren) => {
  const { session } = useAuth();
  const { data: user, isLoading } = useUser(session ? session.userId : null);
  const router = useRouter(); // Add this line

  if (!session) {
    console.log("Nextjs is redirecting on the server ...");
    try {
      router.replace("/login");
    } catch (error) {}
  }

  if (isLoading || !user) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
};
