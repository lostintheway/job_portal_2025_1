import { eq, and, desc, like, or, sql } from "drizzle-orm";
import { db } from "../config/db.ts";
import {
  jobListings,
  employerProfiles,
  type JobListingSelect,
} from "../db/schema.ts";
import type { ResponseWithTotal } from "../interfaces/ResponseWithTotal.ts";

class JobListingModel {
  static async getAllJobListings(): Promise<JobListingSelect[]> {
    return db
      .select()
      .from(jobListings)
      .where(
        and(eq(jobListings.isDeleted, false), eq(jobListings.isActive, true))
      )
      .orderBy(desc(jobListings.createdDate));
  }

  // Get job listing by page and size
  // Get job listing by page and size
  static async getJobListingsByPageAndSize(
    page: number,
    size: number
  ): Promise<ResponseWithTotal<JobListingSelect[]>> {
    const offset = (page - 1) * size;
    const [total] = await db
      .select({
        count: sql`count(*)`.mapWith(Number),
      })
      .from(jobListings)
      .where(eq(jobListings.isDeleted, false));

    // Join with employer profiles to include employer details
    const data = await db
      .select({
        ...jobListings,
        employerName: employerProfiles.companyName,
        employerAddress: employerProfiles.companyAddress,
        employerIndustry: employerProfiles.industryType,
      } as any)
      .from(jobListings)
      .leftJoin(
        employerProfiles,
        eq(jobListings.employerId, employerProfiles.employerId)
      )
      .where(eq(jobListings.isDeleted, false))
      .limit(size)
      .offset(offset);

    return {
      data,
      total: total.count,
      page,
      size,
    };
  }

  static async getJobListingsByCategoryId(
    categoryId: number
  ): Promise<JobListingSelect[]> {
    return db
      .select()
      .from(jobListings)
      .where(
        and(
          eq(jobListings.categoryId, categoryId),
          eq(jobListings.isDeleted, false),
          eq(jobListings.isActive, true)
        )
      )
      .orderBy(desc(jobListings.createdDate));
  }

  static async getJobListingById(
    jobId: number
  ): Promise<JobListingSelect | undefined> {
    return db
      .select()
      .from(jobListings)
      .where(
        and(eq(jobListings.jobId, jobId), eq(jobListings.isDeleted, false))
      )
      .limit(1)
      .then((rows) => rows[0]);
  }

  static async getJobListingsByEmployerId(
    employerId: number
  ): Promise<JobListingSelect[]> {
    return db
      .select()
      .from(jobListings)
      .where(
        and(
          eq(jobListings.employerId, employerId),
          eq(jobListings.isDeleted, false)
        )
      )
      .orderBy(desc(jobListings.createdDate));
  }

  static async getJobListingsByEmployerUserId(
    userId: number
  ): Promise<JobListingSelect[]> {
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
      .where(
        and(
          eq(jobListings.employerId, employerProfile.employerId),
          eq(jobListings.isDeleted, false)
        )
      )
      .orderBy(desc(jobListings.createdDate));
  }

  static async getJobListingsByCategory(
    categoryId: number
  ): Promise<JobListingSelect[]> {
    return db
      .select()
      .from(jobListings)
      .where(
        and(
          eq(jobListings.categoryId, categoryId),
          eq(jobListings.isDeleted, false)
        )
      )
      .orderBy(desc(jobListings.createdDate));
  }

  static async searchJobListings(
    searchTerm: string
  ): Promise<JobListingSelect[]> {
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
      JobListingSelect,
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
        JobListingSelect,
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
