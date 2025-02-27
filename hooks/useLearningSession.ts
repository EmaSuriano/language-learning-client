"use client";

import { useState } from "react";
import { useAuth } from "./useAuth";
import { useUser } from "./useUser";
import { Situation } from "./useSituations";
import { create } from "zustand";

type BaseLearningSession = {
  selectedSituation: Situation | null;
  setSelectedSituation: (selectedSituation: Situation) => void;
};

const useBaseAppConfigStore = create<BaseLearningSession>()((set, get) => ({
  selectedSituation: null,
  setSelectedSituation: (selectedSituation) => set({ selectedSituation }),
}));

export const useLearningSession = () => {
  const { session, logout } = useAuth();
  const { data: user } = useUser(session ? session.userId : null);
  const { selectedSituation, setSelectedSituation } = useBaseAppConfigStore();

  if (!session || !user) {
    throw new Error("Authenticated user requested but not found");
  }

  return { user, logout, selectedSituation, setSelectedSituation };
};
