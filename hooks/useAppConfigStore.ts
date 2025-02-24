import { useTheme, UseThemeProps } from "next-themes";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type ThemeConfig = Pick<UseThemeProps, "theme" | "setTheme">;

type BaseAppConfig = {
  enableAutoPlay: boolean;
  setEnableAutoPlay: (enableAutoPlay: boolean) => void;
};

const useBaseAppConfigStore = create<BaseAppConfig>()(
  persist(
    (set, get) => ({
      enableAutoPlay: true,

      setEnableAutoPlay: (enableAutoPlay: boolean) => set({ enableAutoPlay }),
    }),
    { name: "app-config" }
  )
);

export const useAppConfigStore = (): BaseAppConfig & ThemeConfig => {
  const { theme, setTheme } = useTheme();
  const baseAppConfig = useBaseAppConfigStore();

  return { theme, setTheme, ...baseAppConfig };
};
