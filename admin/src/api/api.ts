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
  
  // Jobs
  getJobs: () => axiosInstance.get("/api/jobs"),
  getJobById: (jobId: string) => axiosInstance.get(`/api/jobs/${jobId}`),
  createJob: (data: any) => axiosInstance.post("/api/jobs", data),
  updateJob: (jobId: string, data: any) => axiosInstance.put(`/api/jobs/${jobId}`, data),
  deleteJob: (jobId: string) => axiosInstance.delete(`/api/jobs/${jobId}`),
  
  // Applications
  applyForJob: (jobId: string, data: any) => axiosInstance.post(`/api/applications/${jobId}`, data),
  getApplications: () => axiosInstance.get("/api/applications"),
  updateApplication: (applicationId: string, data: any) => axiosInstance.put(`/api/applications/${applicationId}`, data),
  
  // Bookmarks
  getBookmarkedJobs: () => axiosInstance.get("/api/bookmarks"),
  addBookmark: (jobId: string) => axiosInstance.post(`/api/bookmarks/${jobId}`),
  removeBookmark: (jobId: string) => axiosInstance.delete(`/api/bookmarks/${jobId}`),
};

export default axiosInstance;
