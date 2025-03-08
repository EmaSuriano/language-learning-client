"use client";

import { useSelectedSituationStore } from "@/hooks/useLearningSession";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function NewChat() {
  const { selectedSituation, setSelectedSituation } =
    useSelectedSituationStore();
  const router = useRouter();

  useEffect(() => {
    if (selectedSituation === null) {
      router.replace("/chat");
    } else {
      setSelectedSituation(null);
    }
  }, [selectedSituation, setSelectedSituation, router]);

  return null;
}
