"use client";

import { useAuth } from "@/hooks/useAuth";
import { useIsMounted } from "@/hooks/useIsMounted";
import { useUser } from "@/hooks/useUser";
import { useRouter } from "next/navigation";
import { PropsWithChildren } from "react";

export const AuthGuard = ({ children }: PropsWithChildren) => {
  const { session } = useAuth();
  const { data: user, isLoading } = useUser(session ? session.userId : null);
  const router = useRouter();
  const isMounted = useIsMounted();

  // This avoid an hydration issue when using SSR
  if (isMounted && !session) {
    router.replace("/login");
  }

  if (isLoading || !user) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
};
