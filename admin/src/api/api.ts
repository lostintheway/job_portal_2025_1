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

  // Users
  getUsers: () => axiosInstance.get("/api/users"),
  getUserById: (id: number) => axiosInstance.get(`/api/users/${id}`),
  createUser: (data: any) => axiosInstance.post("/api/users", data),
  updateUser: (id: number, data: any) =>
    axiosInstance.put(`/api/users/${id}`, data),
  deleteUser: (id: number) => axiosInstance.delete(`/api/users/${id}`),

  // Applications
  getApplications: () => axiosInstance.get("/api/applications"),
  getApplicationById: (id: number) =>
    axiosInstance.get(`/api/applications/${id}`),
  createApplication: (data: any) =>
    axiosInstance.post("/api/applications", data),
  updateApplication: (id: number, data: any) =>
    axiosInstance.put(`/api/applications/${id}`, data),
  deleteApplication: (id: number) =>
    axiosInstance.delete(`/api/applications/${id}`),

  // Job Descriptions
  getJobDescriptions: () => axiosInstance.get("/api/job-descriptions"),
  getJobDescriptionById: (id: number) =>
    axiosInstance.get(`/api/job-descriptions/${id}`),
  createJobDescription: (data: any) =>
    axiosInstance.post("/api/job-descriptions", data),
  updateJobDescription: (id: number, data: any) =>
    axiosInstance.put(`/api/job-descriptions/${id}`, data),
  deleteJobDescription: (id: number) =>
    axiosInstance.delete(`/api/job-descriptions/${id}`),

  // Vendor Organizations
  getVendorOrganizations: () => axiosInstance.get("/api/vendor-organizations"),
  getVendorOrganizationById: (id: number) =>
    axiosInstance.get(`/api/vendor-organizations/${id}`),
  createVendorOrganization: (data: any) =>
    axiosInstance.post("/api/vendor-organizations", data),
  updateVendorOrganization: (id: number, data: any) =>
    axiosInstance.put(`/api/vendor-organizations/${id}`, data),
  deleteVendorOrganization: (id: number) =>
    axiosInstance.delete(`/api/vendor-organizations/${id}`),

  // Categories
  getCategories: () => axiosInstance.get("/api/categories"),
  getCategoryById: (id: number) => axiosInstance.get(`/api/categories/${id}`),
  createCategory: (data: any) => axiosInstance.post("/api/categories", data),
  updateCategory: (id: number, data: any) =>
    axiosInstance.put(`/api/categories/${id}`, data),
  deleteCategory: (id: number) => axiosInstance.delete(`/api/categories/${id}`),

  // Upload
  uploadFile: (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return axiosInstance.post("/api/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
};

export default axiosInstance;
