import axios, {
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosResponse,
} from "axios";

// Tạo instance Axios
const axiosInstance: AxiosInstance = axios.create({
  baseURL: process.env.API_URL || "https://localhost:7220/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Thêm token vào header nếu có
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    // Log request (chỉ trong development)
    if (process.env.NODE_ENV === "development") {
      console.log("Request:", config);
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log response (chỉ trong development)
    if (process.env.NODE_ENV === "development") {
      console.log("Response:", response);
    }

    if (response && response.data) return response.data;
    return response;
  },
  (error) => {
    // Handle common errors
    if (error.response?.status === 401) {
      // Redirect to login page
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    }

    if (error.response?.status === 500) {
      console.error("Server error:", error);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
