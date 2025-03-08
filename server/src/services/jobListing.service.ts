import type { JobListingSelect } from "../db/schema";
import type { JobListingQueryParams } from "../interfaces/QueryParams.ts";
import type { ResponseWithTotal } from "../interfaces/ResponseWithTotal.ts";
import JobListingModel from "../models/jobListing.model.ts";

class JobListingService {
  static async getAllJobListings(): Promise<JobListingSelect[]> {
    return JobListingModel.getAllJobListings();
  }

  // getJobListings
  static async getJobListings(
    queryParams: JobListingQueryParams
  ): Promise<ResponseWithTotal<JobListingSelect[]>> {
    return JobListingModel.getJobListings(queryParams);
  }

  static async getJobListingsByPageAndSize(
    page: number,
    size: number
  ): Promise<ResponseWithTotal<JobListingSelect[]>> {
    return JobListingModel.getJobListingsByPageAndSize(page, size);
  }

  static async getJobListingsByCategoryId(
    categoryId: number
  ): Promise<JobListingSelect[]> {
    return JobListingModel.getJobListingsByCategoryId(categoryId);
  }

  static async getJobListingById(
    jobId: number
  ): Promise<JobListingSelect | undefined> {
    return JobListingModel.getJobListingById(jobId);
  }

  static async getJobListingsByEmployerId(
    employerId: number
  ): Promise<JobListingSelect[]> {
    return JobListingModel.getJobListingsByEmployerId(employerId);
  }

  static async getJobListingsByEmployerIdPaginated(
    employerId: number,
    page: number = 1,
    limit: number = 10,
    status: string = "all"
  ): Promise<ResponseWithTotal<JobListingSelect[]>> {
    // Convert employerId to number if it's a string
    const empId =
      typeof employerId === "string" ? parseInt(employerId) : employerId;

    // Get all jobs by employer
    const allJobs = await JobListingModel.getJobListingsByEmployerId(empId);

    // Filter by status if needed
    let filteredJobs = allJobs;
    if (status !== "all") {
      const now = new Date();
      if (status === "active") {
        filteredJobs = allJobs.filter(
          (job) => job.isActive && new Date(job.deadLine) > now
        );
      } else if (status === "expired") {
        filteredJobs = allJobs.filter(
          (job) => !job.isActive || new Date(job.deadLine) <= now
        );
      }
    }

    // Calculate pagination
    const total = filteredJobs.length;
    const totalPages = Math.ceil(total / limit);
    const offset = (page - 1) * limit;

    // Get paginated data
    const data = filteredJobs.slice(offset, offset + limit);

    return {
      data,
      total,
      page,
      size: limit,
      totalPages,
    };
  }

  static async getJobListingsByEmployerUserId(
    userId: number
  ): Promise<JobListingSelect[]> {
    return JobListingModel.getJobListingsByEmployerUserId(userId);
  }

  static async getJobListingsByCategory(
    categoryId: number
  ): Promise<JobListingSelect[]> {
    return JobListingModel.getJobListingsByCategory(categoryId);
  }

  static async searchJobListings(
    searchTerm: string
  ): Promise<JobListingSelect[]> {
    return JobListingModel.searchJobListings(searchTerm);
  }

  static async incrementViewCount(jobId: number): Promise<boolean> {
    return JobListingModel.incrementViewCount(jobId);
  }

  static async createJobListing(
    jobData: Omit<
      JobListingSelect,
      | "jobId"
      | "createdDate"
      | "updatedDate"
      | "deletedDate"
      | "isDeleted"
      | "viewCount"
    >
  ): Promise<number> {
    return JobListingModel.createJobListing(jobData);
  }

  static async updateJobListing(
    jobId: number,
    jobData: Partial<
      Omit<
        JobListingSelect,
        "jobId" | "createdDate" | "updatedDate" | "deletedDate" | "isDeleted"
      >
    >
  ): Promise<boolean> {
    return JobListingModel.updateJobListing(jobId, jobData);
  }

  static async deleteJobListing(
    jobId: number,
    deletedBy: number
  ): Promise<boolean> {
    return JobListingModel.deleteJobListing(jobId, deletedBy);
  }
}

export default JobListingService;
