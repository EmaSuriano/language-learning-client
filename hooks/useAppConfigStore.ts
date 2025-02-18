import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AppConfig {
  enableAutoPlay: boolean;
  setEnableAutoPlay: (enableAutoPlay: boolean) => void;
}

export const useAppConfigStore = create<AppConfig>()(
  persist(
    (set, get) => ({
      enableAutoPlay: true,

      setEnableAutoPlay: (enableAutoPlay: boolean) => set({ enableAutoPlay }),
    }),
    { name: "user-storage" }
  )
);
