// src/store/useUserStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

import { z } from "zod";
import { Language, LanguageSchema } from "./useLanguageStore";
import { getUser, updateUser } from "@/services/user";
import { User, UserUpdate } from "@/schemas/user";

interface UserState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  fetchUser: (id: string) => Promise<User>;
  updateUser: (id: string, userData: UserUpdate) => Promise<User>;
}

export const useUserStore = create<UserState>()((set, get) => ({
  user: null,
  isLoading: false,
  error: null,

  fetchUser: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await getUser(id);
      set({ user: response, isLoading: false });
      return response;
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },

  updateUser: async (id: string, userData: UserUpdate) => {
    set({ isLoading: true, error: null });
    try {
      const response = await updateUser(id, userData);
      set({ user: response, isLoading: false });
      return response;
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },
}));
