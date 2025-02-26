import axios from "axios";

// Base URL configuration
export const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5222";

// Create Axios instance
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to include token from localStorage in the header
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // Fetch token from localStorage
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`; // Add token to headers
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const api = {
  // Auth
  login: (data: any) => axiosInstance.post("/api/users/login", data),
  register: (data: any) => axiosInstance.post("/api/users/register", data),
};

export default axiosInstance;
