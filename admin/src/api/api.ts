import axios from "axios";

// Base URL configuration
export const BASE_URL = "http://localhost:5123";

// Create Axios instance
const axiosInstance = axios.create({
  baseURL: BASE_URL,
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

export default axiosInstance;
