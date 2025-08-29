import { apiClient } from "@/lib/api";
import { User } from "@/stores/useUserStore";

interface LoginCredentials {
  code: string;
  password: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface LoginResponse {
  success: boolean;
  token: string;
  message: string;
  user: User;
}

const authService = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    return await apiClient.post<LoginResponse>("/auth/login", credentials);
  },

  register: async (userData: RegisterData): Promise<LoginResponse> => {
    return await apiClient.post<LoginResponse>("/auth/register", userData);
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await apiClient.get<LoginResponse>("/auth/me");
    if (!response.success) {
      throw new Error(response.message || "Không thể lấy thông tin người dùng");
    }
    return response.user;
  },
};
export default authService;
