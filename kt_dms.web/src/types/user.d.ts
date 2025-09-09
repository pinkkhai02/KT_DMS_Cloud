// Interface for User
export interface User {
  code: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  cpnyCode: string;
  siteCode: string;
  managerCode: string;
  categoryCode: string;
  groupCode: string;
  customerCode: string;
  status: string;
  recentLogin: string;
  mac?: string;
  homeScreen?: string;
}

// Interface for request login
export interface LoginRequest {
  code: string;
  password: string;
  remember?: boolean; // Giữ nguyên từ yêu cầu của bạn
}

// Interface cho response từ API đăng nhập
export interface LoginResponse {
  success: boolean;
  token: string;
  message: string;
  user: User;
  refreshToken?: string;
  expiresIn?: number;
}

// Interface cho trạng thái xác thực
export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
