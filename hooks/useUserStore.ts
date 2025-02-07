// src/store/useUserStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

import { z } from "zod";
import { Language, LanguageSchema } from "./useLanguageStore";

const UserSchema = z.object({
  id: z.number(),
  email: z.string().email(),
  current_language: LanguageSchema,
  language_level: z.number().min(1).max(5),
  interests: z.array(z.string()),
});

export type User = z.infer<typeof UserSchema>;

export type UserUpdate = Partial<{
  language_code: Language["code"];
  language_level: User["language_level"];
  interests: User["interests"];
}>;

interface UserState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  fetchUser: () => Promise<void>;
  createUser: (email: string) => Promise<void>;
  updateUser: (userData: UserUpdate) => Promise<void>;
}

const userId = 1;
const API_URL = `${process.env["NEXT_PUBLIC_ASSISTANT_URL"]}/users`;

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,
      error: null,

      fetchUser: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch(`${API_URL}/${userId}`);
          if (!response.ok) throw new Error("Failed to fetch user");
          const userData = await response.json();
          const validatedUser = UserSchema.parse(userData);
          set({ user: validatedUser, isLoading: false });
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false });
        }
      },

      createUser: async (email: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email,
              language: "en",
              level: "beginner",
              interests: [],
            }),
          });
          if (!response.ok) throw new Error("Failed to create user");
          const userData = await response.json();
          const validatedUser = UserSchema.parse(userData);
          set({ user: validatedUser, isLoading: false });
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false });
        }
      },

      updateUser: async (userData: UserUpdate) => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch(`${API_URL}/${userId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userData),
          });
          if (!response.ok) throw new Error("Failed to update user");
          const updatedData = await response.json();
          const validatedUser = UserSchema.parse(updatedData);
          set({ user: validatedUser, isLoading: false });
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false });
        }
      },
    }),
    { name: "user-storage" }
  )
);
