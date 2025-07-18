// src/services/authService.ts
import axiosInstance from "@/lib/axios.customize";

// Types cho login
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
  refreshToken?: string;
  expiresIn: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

// Auth Service
export class AuthService {
  // Login
  static async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await axiosInstance.post<LoginResponse>(
        "/auth/login",
        credentials
      );
      return response.data;
    } catch (error) {
      //throw this.handleError(error);
      throw error;
    }
  }

  // Logout
  static async logout(): Promise<void> {
    try {
      await axiosInstance.post("/auth/logout");
    } catch (error) {
      console.error("Logout error:", error);
      // Vẫn tiếp tục logout local nếu API lỗi
    }
  }

  // Get current user
  static async getCurrentUser(): Promise<User> {
    try {
      const response = await axiosInstance.get<User>("/auth/me");
      return response.data;
    } catch (error) {
      // throw this.handleError(error);
      throw error;
    }
  }
}
