// lib/api.ts
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://localhost:7220/api";

export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}

import { useAuthStore } from "@/stores/useUserStore";

class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    // Chỉ truy cập store trong môi trường client-side
    if (typeof window !== "undefined") {
      this.token = useAuthStore.getState().accessToken; // Sử dụng accessToken từ useAuthStore
    }
  }

  setToken(token: string) {
    this.token = token;
    if (typeof window !== "undefined") {
      useAuthStore.getState().setTokens(token, undefined); // Gọi setTokens, refreshToken là undefined
    }
  }

  clearToken() {
    this.token = null;
    if (typeof window !== "undefined") {
      useAuthStore.getState().logout(); // Gọi logout từ useAuthStore
      window.location.href = "/auth/login"; // Điều hướng đến trang login
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    const headers = new Headers({
      "Content-Type": "application/json",
      ...(options.headers || {}),
    });

    if (this.token) {
      headers.set("Authorization", `Bearer ${this.token}`);
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    const responseData = await response.json().catch(() => ({})); // Xử lý trường hợp response không phải JSON

    if (!response.ok) {
      if (response.status === 401 && endpoint !== "/auth/login") {
        this.clearToken();
      }
      throw new Error(
        responseData.message || `HTTP error! status: ${response.status}`
      );
    }

    return {
      data: responseData.data || responseData, // Linh hoạt với cấu trúc response
      message: responseData.message,
      status: response.status,
    };
  }

  get<T>(endpoint: string, headers?: HeadersInit) {
    return this.request<T>(endpoint, {
      method: "GET",
      headers,
    });
  }

  post<T>(endpoint: string, data?: unknown, headers?: HeadersInit) {
    return this.request<T>(endpoint, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
      headers,
    });
  }

  put<T>(endpoint: string, data?: unknown, headers?: HeadersInit) {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
      headers,
    });
  }

  delete<T>(endpoint: string, headers?: HeadersInit) {
    return this.request<T>(endpoint, {
      method: "DELETE",
      headers,
    });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
