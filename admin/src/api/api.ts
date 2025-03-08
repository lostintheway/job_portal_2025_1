import axios, { AxiosInstance, AxiosResponse } from "axios";
import { LoginResponse } from "./types";
import { JobListingResponse, JobResponse } from "./JobListingResponse";

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
  login(data: {
    email: string;
    password: string;
  }): Promise<AxiosResponse<LoginResponse>> {
    return this.axiosInstance.post("/api/users/login", data);
  }

  register(data: {
    email: string;
    password: string;
    fullName: string;
    contactNumber: string;
    address: string;
    role: "jobseeker" | "employer" | "admin";
  }) {
    return this.axiosInstance.post("/api/users/register", data);
  }

  logout() {
    // Clear token from localStorage
    localStorage.removeItem("token");
    return Promise.resolve();
  }
  // Jobs
  getJobs() {
    return this.axiosInstance.get("/api/job-descriptions");
  }

  // Get jobs by page and size
  getJobsByPageAndSize(page: number, size: number) {
    return this.axiosInstance.get<JobListingResponse>(
      `/api/job-descriptions/page/${page}/size/${size}`
    );
  }

  getJobById(jobId: string) {
    return this.axiosInstance.get<JobResponse>(
      `/api/job-descriptions/${jobId}`
    );
  }
  // Get jobs by category
  getJobsByCategory(categoryId: string) {
    return this.axiosInstance.get(
      `/api/job-descriptions/category/${categoryId}`
    );
  }
  // Search jobs with filters
  searchJobs(filters: {
    keyword?: string;
    location?: string;
    category?: string;
    jobType?: string;
    salary?: string;
  }) {
    return this.axiosInstance.get("/api/job-descriptions/search", {
      params: filters,
    });
  }
  createJob(data: any) {
    return this.axiosInstance.post("/api/job-descriptions", data);
  }
  updateJob(jobId: string, data: any) {
    return this.axiosInstance.put(`/api/job-descriptions/${jobId}`, data);
  }
  deleteJob(jobId: string) {
    return this.axiosInstance.delete(`/api/job-descriptions/${jobId}`);
  }
  // Get jobs posted by the logged-in employer
  getMyJobs() {
    return this.axiosInstance.get("/api/job-descriptions/employer/me");
  }
  // Applications
  applyForJob(jobId: string, data: any) {
    return this.axiosInstance.post(`/api/applications/${jobId}`, data);
  }
  // Get all applications (admin only)
  getApplications() {
    return this.axiosInstance.get("/api/applications");
  }
  // Get applications for a specific job (employer only)
  getApplicationsByJobId(jobId: string) {
    return this.axiosInstance.get(`/api/applications/job/${jobId}`);
  }
  // Get applications submitted by the logged-in user (jobseeker only)
  getMyApplications() {
    return this.axiosInstance.get("/api/applications/my-applications");
  }
  //getApplicationsByUserId
  getApplicationsByUserId(userId: string) {
    return this.axiosInstance.get(`/api/my-applications/${userId}`);
  }
  // Get application by ID
  getApplicationById(applicationId: string) {
    return this.axiosInstance.get(`/api/applications/${applicationId}`);
  }
  // Update application (general update)
  updateApplication(applicationId: string, data: any) {
    return this.axiosInstance.put(`/api/applications/${applicationId}`, data);
  }
  // Update application status (employer only)
  updateApplicationStatus(applicationId: string, status: string) {
    return this.axiosInstance.put(`/api/applications/status/${applicationId}`, {
      status,
    });
  }
  // Delete application
  deleteApplication(applicationId: string) {
    return this.axiosInstance.delete(`/api/applications/${applicationId}`);
  }
  // JobSeeker Profile
  getJobSeekerProfile() {
    return this.axiosInstance.get("/api/jobseeker-profiles/my-profile");
  }
  createJobSeekerProfile(data: any) {
    return this.axiosInstance.post("/api/jobseeker-profiles", data);
  }
  updateJobSeekerProfile(profileId: string, data: any) {
    return this.axiosInstance.put(`/api/jobseeker-profiles/${profileId}`, data);
  }
  // Employer Profile
  getEmployerProfile() {
    return this.axiosInstance.get("/api/employer-profiles/my-profile");
  }
  createEmployerProfile(data: any) {
    return this.axiosInstance.post("/api/employer-profiles", data);
  }
  updateEmployerProfile(profileId: string, data: any) {
    return this.axiosInstance.put(`/api/employer-profiles/${profileId}`, data);
  }
  // Categories
  getCategories() {
    return this.axiosInstance.get("/api/categories");
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
