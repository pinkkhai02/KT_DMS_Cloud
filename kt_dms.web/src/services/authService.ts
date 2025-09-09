import { apiClient } from "@/lib/api";
import { LoginRequest, LoginResponse, User } from "@/types/user";

class AuthApiService {
  private readonly endpoints = {
    login: "/auth/login",
    logout: "/auth/logout",
    refresh: "/auth/refresh",
    profile: "/auth/profile",
    forgotPassword: "/auth/forgot-password",
    resetPassword: "/auth/reset-password",
  };

  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>(
      this.endpoints.login,
      credentials
    );
    return response.data;
  }

  async logout(): Promise<void> {
    await apiClient.post(this.endpoints.logout);
  }

  async refreshToken(refreshToken: string): Promise<{
    token: string;
    refreshToken?: string;
  }> {
    const response = await apiClient.post<{
      token: string;
      refreshToken?: string;
    }>(this.endpoints.refresh, {
      refreshToken,
    });
    return response.data;
  }

  async getProfile(): Promise<User> {
    const response = await apiClient.get<User>(this.endpoints.profile);
    return response.data;
  }

  // async forgotPassword(email: string): Promise<{ message: string }> {
  //   const response = await apiClient.post(this.endpoints.forgotPassword, {
  //     email,
  //   });
  //   return response.data;
  // }

  // async resetPassword(token: string, password: string): Promise<{ message: string }> {
  //   const response = await apiClient.post(this.endpoints.resetPassword, {
  //     token,
  //     password,
  //   });
  //   return response.data;
  // }
}
export const authApiService = new AuthApiService();
