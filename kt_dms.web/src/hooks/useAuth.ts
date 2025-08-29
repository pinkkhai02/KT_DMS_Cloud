"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { apiClient } from "@/lib/api";
import authService from "@/services/authService";
import { useUserStore } from "@/stores/useUserStore";

export const useAuth = () => {
  const queryClient = useQueryClient();
  const {
    setUser,
    clearUser,
    user,
    isAuthenticated,
    isTokenValid,
    initializeAuth,
  } = useUserStore();

  // Initialize auth on mount
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: (response) => {
      if (response.success) {
        apiClient.setToken(response.token);
        setUser(response.user, response.token);
        queryClient.setQueryData(["user"], response.user);
        // Lưu token vào cookie
        document.cookie = `token=${response.token}; path=/; max-age=3600; secure; samesite=strict`;
      } else {
        throw new Error(response.message || "Đăng nhập thất bại");
      }
    },
    onError: (error: Error) => {
      if (error.message.includes("401")) {
        apiClient.clearToken();
        clearUser();
        document.cookie = "token=; path=/; max-age=0";
      }
    },
  });

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: authService.register,
    onSuccess: (response) => {
      if (response.success) {
        apiClient.setToken(response.token);
        setUser(response.user, response.token);
        queryClient.setQueryData(["user"], response.user);
        // Lưu token vào cookie
        document.cookie = `token=${response.token}; path=/; max-age=3600; secure; samesite=strict`;
      } else {
        throw new Error(response.message || "Đăng ký thất bại");
      }
    },
    onError: (error: Error) => {
      if (error.message.includes("401")) {
        apiClient.clearToken();
        clearUser();
        document.cookie = "token=; path=/; max-age=0";
      }
    },
  });

  // Get current user query
  const {
    data: currentUser,
    isLoading,
    error: userQueryError,
  } = useQuery({
    queryKey: ["user"],
    queryFn: authService.getCurrentUser,
    enabled: !!apiClient && typeof window !== "undefined" && isTokenValid(),
    retry: (failureCount, error) => {
      if (error?.message?.includes("401")) {
        apiClient.clearToken();
        clearUser();
        document.cookie = "token=; path=/; max-age=0";
        return false;
      }
      return failureCount < 3;
    },
  });

  // Handle query errors
  useEffect(() => {
    if (userQueryError && userQueryError.message.includes("401")) {
      apiClient.clearToken();
      clearUser();
      queryClient.clear();
      document.cookie = "token=; path=/; max-age=0";
    }
  }, [userQueryError, clearUser, queryClient]);

  // Sync currentUser with store
  useEffect(() => {
    if (currentUser && (!user || user.code !== currentUser.code)) {
      setUser(currentUser);
    }
  }, [currentUser, setUser, user]);

  // Logout function
  const logout = () => {
    apiClient.clearToken();
    clearUser();
    queryClient.clear();
    document.cookie = "token=; path=/; max-age=0";
  };

  return {
    login: loginMutation.mutateAsync,
    register: registerMutation.mutateAsync,
    logout,
    user: user || currentUser || null,
    isAuthenticated,
    isLoading:
      loginMutation.isPending || registerMutation.isPending || isLoading,
    loginError: loginMutation.error,
    registerError: registerMutation.error,
  };
};
