import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role?: string;
}

interface UserState {
  // State
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;

  // Actions
  setUser: (user: User, token?: string) => void;
  clearUser: () => void;
  updateUser: (updates: Partial<User>) => void;
  setToken: (token: string) => void;
  isTokenValid: () => boolean;
  initializeAuth: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      token: null,
      isAuthenticated: false,

      // Actions
      setUser: (user, token) =>
        set({
          user,
          token: token || get().token,
          isAuthenticated: true,
        }),

      clearUser: () =>
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        }),

      updateUser: (updates) => {
        const currentUser = get().user;
        if (currentUser) {
          set({ user: { ...currentUser, ...updates } });
        }
      },

      setToken: (token) => set({ token }),

      isTokenValid: (): boolean => {
        const { token } = get();
        if (!token) return false;

        try {
          const payload = JSON.parse(atob(token.split(".")[1]));
          return payload.exp > Date.now() / 1000;
        } catch {
          return false;
        }
      },

      initializeAuth: () => {
        const { token, isTokenValid, clearUser } = get();
        if (token && !isTokenValid()) {
          clearUser();
        }
      },
    }),
    {
      name: "user-storage", // localStorage key
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
