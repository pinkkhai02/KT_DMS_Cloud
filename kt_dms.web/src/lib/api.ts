// lib/api.ts
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://localhost:7220/api";

export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}

import { useUserStore } from "@/stores/useUserStore";

class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    if (typeof window !== "undefined") {
      this.token = useUserStore.getState().token;
    }
  }

  setToken(token: string) {
    this.token = token;
    if (typeof window !== "undefined") {
      useUserStore.getState().setToken(token);
    }
  }

  clearToken() {
    this.token = null;
    if (typeof window !== "undefined") {
      useUserStore.getState().clearUser();
      window.location.href = "/login";
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
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

    if (!response.ok) {
      const error = await response.text();
      if (response.status === 401) {
        this.clearToken();
      }
      throw new Error(error || `HTTP error! status: ${response.status}`);
    }

    return response.json();
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
