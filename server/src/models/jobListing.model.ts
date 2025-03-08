import {
  eq,
  and,
  desc,
  asc,
  or,
  sql,
  inArray,
  like,
  gte,
  lte,
} from "drizzle-orm";
import { db } from "../config/db.ts";
import {
  jobListings,
  employerProfiles,
  type JobListingSelect,
} from "../db/schema.ts";
import type { ResponseWithTotal } from "../interfaces/ResponseWithTotal.ts";
import type { JobListingQueryParams } from "../interfaces/QueryParams.ts";

type JobType = "full-time" | "part-time" | "contract" | "internship" | "remote";

class JobListingModel {
  static async getJobListings(
    queryParams: JobListingQueryParams
  ): Promise<ResponseWithTotal<JobListingSelect[]>> {
    const {
      page = "1",
      size = "10",
      sortBy = "createdDate",
      sortOrder = "desc",
      category,
      jobType,
    } = queryParams;

    const offset = (Number(page) - 1) * Number(size);

    // Build where conditions
    const whereConditions = [eq(jobListings.isDeleted, false)];

    // Apply filters
    if (jobType) {
      whereConditions.push(eq(jobListings.jobType, jobType as JobType));
    }

    if (category) {
      const catId = Number(category);
      whereConditions.push(eq(jobListings.categoryId, catId));
    }

    // Get total count
    const [total] = await db
      .select({
        count: sql`count(*)`.mapWith(Number),
      })
      .from(jobListings)
      .where(and(...whereConditions));

    // Build order by clause
    const orderByClause =
      sortOrder === "desc"
        ? desc(jobListings[sortBy as keyof typeof jobListings] as any)
        : asc(jobListings[sortBy as keyof typeof jobListings] as any);

    // Get paginated data
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
      .where(and(...whereConditions))
      .orderBy(orderByClause)
      .limit(Number(size))
      .offset(offset);

    return {
      data: data as unknown as JobListingSelect[],
      total: total.count,
      page: Number(page),
      size: Number(size),
      totalPages: Math.ceil(Number(total.count) / Number(size)),
    };
  }

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

    type JoB = (JobListingSelect & {
      employerName: string;
      employerAddress: string;
      employerIndustry: string;
    })[];

    return {
      data: data as unknown as JoB,
      total: total.count,
      page,
      size,
      totalPages: Math.ceil(Number(total.count) / Number(size)),
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
    if (isNaN(jobId)) {
      throw new Error(`Invalid jobId: ${jobId}`);
    }

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
    userId: number,
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
    try {
      // get employer id from user id
      const employerProfile = await db
        .select()
        .from(employerProfiles)
        .where(eq(employerProfiles.userId, userId))
        .limit(1)
        .then((rows) => rows[0]);

      const [result] = await db.insert(jobListings).values({
        ...jobData,
        deadLine: new Date(jobData.deadLine),
        employerId: employerProfile.employerId,
        viewCount: 0,
        createdDate: new Date(),
        createdBy: userId,
        updatedDate: new Date(),
        updatedBy: userId,
      });
      return result.insertId;
    } catch (err) {
      console.error("Error inserting job listing:", err);
      throw err; // Optionally re-throw the error after logging
    }
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
    const { createdBy, updatedBy, deadLine, deletedBy, ...rest } = jobData;

    try {
      await db
        .update(jobListings)
        .set({
          ...rest,
          deadLine: new Date(deadLine as string),
          updatedDate: new Date(),
        })
        .where(eq(jobListings.jobId, jobId));
      return true;
    } catch (err) {
      console.error(
        "Error updating job listing:",
        err.sql || err.message || err
      );
      throw err; // Optionally re-throw the error after logging
    }
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
