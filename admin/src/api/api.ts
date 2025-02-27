import axios, { AxiosInstance } from "axios";

export class Api {
  private baseUrl: string;
  private axiosInstance: AxiosInstance;

  constructor() {
    this.baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5222";
    this.axiosInstance = axios.create({
      baseURL: this.baseUrl,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Add a request interceptor to include token from localStorage in the header
    this.axiosInstance.interceptors.request.use(
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
  }

  // Auth
  login(data: any) {
    return this.axiosInstance.post("/api/users/login", data);
  }

  register(data: any) {
    return this.axiosInstance.post("/api/users/register", data);
  }

  // Jobs
  getJobs() {
    return this.axiosInstance.get("/api/jobs");
  }

  getJobById(jobId: string) {
    return this.axiosInstance.get(`/api/jobs/${jobId}`);
  }

  createJob(data: any) {
    return this.axiosInstance.post("/api/jobs", data);
  }

  updateJob(jobId: string, data: any) {
    return this.axiosInstance.put(`/api/jobs/${jobId}`, data);
  }

  deleteJob(jobId: string) {
    return this.axiosInstance.delete(`/api/jobs/${jobId}`);
  }

  // Applications
  applyForJob(jobId: string, data: any) {
    return this.axiosInstance.post(`/api/applications/${jobId}`, data);
  }

  getApplications() {
    return this.axiosInstance.get("/api/applications");
  }

  updateApplication(applicationId: string, data: any) {
    return this.axiosInstance.put(`/api/applications/${applicationId}`, data);
  }

  // Bookmarks
  getBookmarkedJobs() {
    return this.axiosInstance.get("/api/bookmarks");
  }

  addBookmark(jobId: string) {
    return this.axiosInstance.post(`/api/bookmarks/${jobId}`);
  }

  removeBookmark(jobId: string) {
    return this.axiosInstance.delete(`/api/bookmarks/${jobId}`);
  }

  getInstance() {
    return this.axiosInstance;
  }
}

export const api = new Api();
export default api.getInstance();
