// Base API configuration
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://localhost:7220/api";

export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}

class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    // Lấy token từ localStorage nếu có
    if (typeof window !== "undefined") {
      this.token = localStorage.getItem("access_token");
    }
  }

  setToken(token: string) {
    this.token = token;
    if (typeof window !== "undefined") {
      localStorage.setItem("access_token", token);
    }
  }

  clearToken() {
    this.token = null;
    if (typeof window !== "undefined") {
      localStorage.removeItem("access_token");
    }
  }

  // Method chung để call API
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
      throw new Error(error || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // GET method
  get<T>(endpoint: string, headers?: HeadersInit) {
    return this.request<T>(endpoint, {
      method: "GET",
      headers,
    });
  }

  // POST method
  post<T>(endpoint: string, data?: unknown, headers?: HeadersInit) {
    return this.request<T>(endpoint, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
      headers,
    });
  }

  // PUT method
  put<T>(endpoint: string, data?: unknown, headers?: HeadersInit) {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
      headers,
    });
  }

  // DELETE method
  delete<T>(endpoint: string, headers?: HeadersInit) {
    return this.request<T>(endpoint, {
      method: "DELETE",
      headers,
    });
  }
}

// Export instance để sử dụng
export const apiClient = new ApiClient(API_BASE_URL);
