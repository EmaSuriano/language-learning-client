"use client";

import { useState } from "react";
import { useAuth } from "./useAuth";
import { useUser } from "./useUser";
import { Situation } from "./useSituations";
import { create } from "zustand";

type BaseLearningSession = {
  selectedSituation: Situation | null;
  setSelectedSituation: (selectedSituation: Situation | null) => void;
};

export const useSelectedSituationStore = create<BaseLearningSession>()(
  (set, get) => ({
    selectedSituation: null,
    setSelectedSituation: (selectedSituation) => set({ selectedSituation }),
  })
);

export const useAuthUser = () => {
  const { session } = useAuth();
  const { data: user } = useUser(session ? session.userId : null);

  return { user };
};

export const useLearningSession = () => {
  const { user } = useAuthUser();
  const { selectedSituation } = useSelectedSituationStore();

  if (!user) {
    throw new Error("Authenticated user requested but not found");
  }

  if (!selectedSituation) {
    throw new Error("Selected situation requested but not found");
  }

  return { user, selectedSituation };
};
