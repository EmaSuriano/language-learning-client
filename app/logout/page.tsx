"use client";

import { useAuth } from "@/hooks/useAuth";
import { redirect } from "next/navigation";
import { useEffect } from "react";

export default function Logout() {
  const { logout } = useAuth();

  useEffect(() => {
    logout();
    redirect("/login");
  }, []);

  return "Logging out...";
}
