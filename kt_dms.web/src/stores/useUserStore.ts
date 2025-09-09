import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { AuthState, User, LoginResponse } from "@/types/user";

interface AuthStore extends AuthState {
  // Actions
  setUser: (user: User) => void;
  setTokens: (accessToken: string, refreshToken?: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  login: (response: LoginResponse) => void;
  logout: () => void;
  clearError: () => void;
  updateProfile: (userData: Partial<User>) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    //(set, get) => ({
    (set) => ({
      // Initial state
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Actions
      setUser: (user) => set({ user, isAuthenticated: !!user }),

      setTokens: (accessToken, refreshToken) =>
        set({ accessToken, refreshToken }),

      setLoading: (isLoading) => set({ isLoading }),

      setError: (error) => set({ error }),

      login: (response) =>
        set({
          user: response.user,
          accessToken: response.token, // Sử dụng response.token thay vì response.accessToken
          refreshToken: response.refreshToken || null, // refreshToken là optional
          isAuthenticated: !!response.user,
          isLoading: false,
          error: null,
        }),

      logout: () =>
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        }),

      clearError: () => set({ error: null }),

      updateProfile: (userData) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null,
        })),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
