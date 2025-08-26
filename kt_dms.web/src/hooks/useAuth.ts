// hooks/useAuth.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { apiClient } from "@/lib/api";
import { User, useUserStore } from "@/stores/useUserStore";

interface LoginCredentials {
  code: string;
  password: string;
}

interface LoginResponse {
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
  token: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export const useAuth = () => {
  const queryClient = useQueryClient();
  const { setUser, clearUser, user, isAuthenticated } = useUserStore();

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: async (
      credentials: LoginCredentials
    ): Promise<LoginResponse> => {
      return await apiClient.post<LoginResponse>("/auth/login", credentials);
    },
    onSuccess: (data) => {
      apiClient.setToken(data.token);
      setUser(data.user);
      queryClient.setQueryData(["user"], data.user);
    },
  });

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: async (userData: RegisterData): Promise<LoginResponse> => {
      return await apiClient.post<LoginResponse>("/auth/register", userData);
    },
    onSuccess: (data) => {
      apiClient.setToken(data.token);
      setUser(data.user);
      queryClient.setQueryData(["user"], data.user);
    },
  });

  // Get current user query
  const { data: currentUser, isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const response = await apiClient.get<{ user: User }>("/auth/me");
      return response.user;
    },
    enabled:
      !!apiClient &&
      typeof window !== "undefined" &&
      !!localStorage.getItem("access_token"),
  });

  useEffect(() => {
    if (currentUser) {
      setUser(currentUser);
    }
  }, [currentUser, setUser]);

  // Logout function
  const logout = () => {
    apiClient.clearToken();
    clearUser();
    queryClient.clear();
  };

  return {
    login: loginMutation.mutateAsync, // ✅ đổi sang mutateAsync
    register: registerMutation.mutateAsync, // ✅ đổi sang mutateAsync
    logout,
    user: user || currentUser,
    isAuthenticated,
    isLoading:
      loginMutation.isPending || registerMutation.isPending || isLoading,
    loginError: loginMutation.error,
    registerError: registerMutation.error,
  };
};
