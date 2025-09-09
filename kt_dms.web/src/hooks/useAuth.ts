import { apiClient } from "@/lib/api";
import { authApiService } from "@/services/authService";
import { useAuthStore } from "@/stores/useUserStore";
import { LoginRequest } from "@/types/user";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export const useAuth = () => {
  const {
    user,
    accessToken,
    //refreshToken,
    isAuthenticated,
    isLoading: storeLoading,
    error: storeError,
    setLoading,
    setError,
    login: loginStore,
    logout: logoutStore,
    clearError,
    setTokens,
  } = useAuthStore();

  const router = useRouter();
  const queryClient = useQueryClient();

  const loginMutation = useMutation({
    mutationFn: (credentials: LoginRequest) =>
      authApiService.login(credentials),
    onMutate: () => {
      setLoading(true);
      clearError();
    },
    onSuccess: (response) => {
      if (!response.success) {
        throw new Error(response.message || "Login failed");
      }
      loginStore(response);
      apiClient.setToken(response.token);
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
    onError: (error: any) => {
      const errorMessage = error.message || "Invalid email or password";
      setError(errorMessage);
    },
    onSettled: () => {
      setLoading(false);
    },
  });

  const logoutMutation = useMutation({
    mutationFn: () => authApiService.logout(),
    onMutate: () => {
      setLoading(true);
    },
    onSuccess: () => {
      logoutStore();
      apiClient.clearToken();
      router.push("/auth/login");
    },
    onError: (error) => {
      console.warn("Logout API call failed:", error);
      logoutStore();
      apiClient.clearToken();
      router.push("/auth/login");
    },
    onSettled: () => {
      setLoading(false);
    },
  });
  // Refresh token mutation
  const refreshTokenMutation = useMutation({
    mutationFn: (refreshToken: string) =>
      authApiService.refreshToken(refreshToken),
    onSuccess: (response) => {
      setTokens(response.token, response.refreshToken);
      apiClient.setToken(response.token);
    },
    onError: (error) => {
      console.error("Token refresh failed:", error);
      logoutStore();
      apiClient.clearToken();
      router.push("/auth/login");
    },
  });

  // Profile query
  // const profileQuery = useQuery({
  //   queryKey: ['user'],
  //   queryFn: () => authApiService.getProfile(),
  //   enabled: !!accessToken, // Chỉ chạy khi có accessToken
  //   onSuccess: (user) => {
  //     useAuthStore.getState().setUser(user); // Cập nhật user vào store
  //   },
  //   onError: (error) => {
  //     console.error('Failed to fetch profile:', error);
  //     setError(error instanceof Error ? error.message : 'Failed to fetch profile');
  //   },
  // });

  // Initialize auth on app start
  useEffect(() => {
    if (accessToken) {
      apiClient.setToken(accessToken);
    }
  }, [accessToken]);

  return {
    user,
    isAuthenticated,
    isLoading:
      storeLoading ||
      loginMutation.isPending ||
      logoutMutation.isPending ||
      refreshTokenMutation.isPending,
    //profileQuery.isLoading,
    error:
      storeError ||
      loginMutation.error?.message ||
      logoutMutation.error?.message ||
      refreshTokenMutation.error?.message,
    //profileQuery.error?.message,
    login: loginMutation.mutateAsync,
    logout: logoutMutation.mutateAsync,
    refreshToken: refreshTokenMutation.mutateAsync,
    clearError,
    //profile: profileQuery.data,
  };
};
