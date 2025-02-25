import { eq, and, desc, like, or } from "drizzle-orm";
import { db } from "../config/db";
import { jobListings, employerProfiles } from "../db/schema";
import { CommonFields } from "../interfaces/CommonFields";

export interface JobListing extends CommonFields {
  jobId: number;
  employerId: number;
  categoryId: number;
  title: string;
  jobType: "full-time" | "part-time" | "contract" | "internship" | "remote";
  level: string;
  vacancies: number;
  employmentType: string;
  jobLocation: string;
  offeredSalary?: string;
  deadLine: Date;
  educationLevel?: string;
  experienceRequired?: string;
  otherSpecification?: string;
  jobDescription: string;
  responsibilities?: string;
  benefits?: string;
  isPremium: boolean;
  isActive: boolean;
  viewCount: number;
}

class JobListingModel {
  static async getAllJobListings(): Promise<JobListing[]> {
    return db
      .select()
      .from(jobListings)
      .where(eq(jobListings.isDeleted, false))
      .where(eq(jobListings.isActive, true))
      .orderBy(desc(jobListings.createdDate));
  }

  static async getJobListingById(
    jobId: number
  ): Promise<JobListing | undefined> {
    return db
      .select()
      .from(jobListings)
      .where(eq(jobListings.jobId, jobId))
      .where(eq(jobListings.isDeleted, false))
      .limit(1)
      .then((rows) => rows[0]);
  }

  static async getJobListingsByEmployerId(
    employerId: number
  ): Promise<JobListing[]> {
    return db
      .select()
      .from(jobListings)
      .where(eq(jobListings.employerId, employerId))
      .where(eq(jobListings.isDeleted, false))
      .orderBy(desc(jobListings.createdDate));
  }

  static async getJobListingsByEmployerUserId(
    userId: number
  ): Promise<JobListing[]> {
    const employerProfile = await db
      .select()
      .from(employerProfiles)
      .where(eq(employerProfiles.userId, userId))
      .limit(1)
      .then((rows) => rows[0]);

    if (!employerProfile) {
      return [];
    }

    return db
      .select()
      .from(jobListings)
      .where(eq(jobListings.employerId, employerProfile.employerId))
      .where(eq(jobListings.isDeleted, false))
      .orderBy(desc(jobListings.createdDate));
  }

  static async getJobListingsByCategory(
    categoryId: number
  ): Promise<JobListing[]> {
    return db
      .select()
      .from(jobListings)
      .where(eq(jobListings.categoryId, categoryId))
      .where(eq(jobListings.isDeleted, false))
      .where(eq(jobListings.isActive, true))
      .orderBy(desc(jobListings.createdDate));
  }

  static async searchJobListings(searchTerm: string): Promise<JobListing[]> {
    return db
      .select()
      .from(jobListings)
      .where(
        and(
          eq(jobListings.isDeleted, false),
          eq(jobListings.isActive, true),
          or(
            like(jobListings.title, `%${searchTerm}%`),
            like(jobListings.jobDescription, `%${searchTerm}%`),
            like(jobListings.jobLocation, `%${searchTerm}%`)
          )
        )
      )
      .orderBy(desc(jobListings.createdDate));
  }

  static async incrementViewCount(jobId: number): Promise<boolean> {
    const job = await this.getJobListingById(jobId);
    if (!job) return false;

    await db
      .update(jobListings)
      .set({ viewCount: job.viewCount + 1 })
      .where(eq(jobListings.jobId, jobId));
    return true;
  }

  static async createJobListing(
    jobData: Omit<
      JobListing,
      | "jobId"
      | "createdDate"
      | "updatedDate"
      | "deletedDate"
      | "isDeleted"
      | "viewCount"
    >
  ): Promise<number> {
    const [result] = await db.insert(jobListings).values({
      ...jobData,
      viewCount: 0,
    });
    return result.insertId;
  }

  static async updateJobListing(
    jobId: number,
    jobData: Partial<
      Omit<
        JobListing,
        "jobId" | "createdDate" | "updatedDate" | "deletedDate" | "isDeleted"
      >
    >
  ): Promise<boolean> {
    await db
      .update(jobListings)
      .set({ ...jobData, updatedDate: new Date() })
      .where(eq(jobListings.jobId, jobId));
    return true;
  }

  static async deleteJobListing(
    jobId: number,
    deletedBy: number
  ): Promise<boolean> {
    await db
      .update(jobListings)
      .set({ isDeleted: true, deletedBy, deletedDate: new Date() })
      .where(eq(jobListings.jobId, jobId));
    return true;
  }
}

export default JobListingModel;
