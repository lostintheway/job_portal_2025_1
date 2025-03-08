import { eq, and, desc, asc, inArray, sql } from "drizzle-orm";
import { db } from "../config/db.ts";
import {
  applications,
  employerProfiles,
  jobListings,
  type ApplicationSelect,
} from "../db/schema.ts";
import type { ResponseWithTotal } from "../interfaces/ResponseWithTotal.ts";
import type { ApplicationQueryParams } from "../interfaces/QueryParams.ts";

type ApplicationStatus =
  | "pending"
  | "shortlisted"
  | "interviewed"
  | "rejected"
  | "accepted";
type SortableFields = keyof typeof applications;

export type MyApplications = ApplicationSelect & {
  jobDescription: string | null;
  jobTitle: string | null;
  jobLocation: string | null;
  jobType: string | null;
  offeredSalary: string | null;
};

class ApplicationModel {
  // getMyApplications
  static async getMyApplications(userId: number): Promise<MyApplications[]> {
    // @ts-expect-error - all is a string
    return db
      .select({
        ...applications,
        jobDescription: jobListings.jobDescription,
        jobTitle: jobListings.title,
        jobLocation: jobListings.jobLocation,
        jobType: jobListings.jobType,
        offeredSalary: jobListings.offeredSalary,
      } as any)
      .from(applications)
      .leftJoin(jobListings, eq(applications.jobId, jobListings.jobId))
      .where(
        and(eq(applications.isDeleted, false), eq(applications.userId, userId))
      );
  }

  static async getApplications(
    params: ApplicationQueryParams
  ): Promise<ResponseWithTotal<ApplicationSelect[]>> {
    const {
      page = 1,
      size = 10,
      sortBy = "applicationDate",
      sortOrder = "desc",
      filters = {},
    } = params;

    const offset = (page - 1) * size;

    // Build where conditions
    const whereConditions = [eq(applications.isDeleted, false)];

    // Apply filters
    if (filters.status?.length) {
      whereConditions.push(
        inArray(applications.status, filters.status as ApplicationStatus[])
      );
    }
    if (filters.userId) {
      whereConditions.push(eq(applications.userId, filters.userId));
    }
    if (filters.jobId) {
      whereConditions.push(eq(applications.jobId, filters.jobId));
    }

    // Get total count
    const [total] = await db
      .select({
        count: sql`count(*)`.mapWith(Number),
      })
      .from(applications)
      .where(and(...whereConditions));

    // Build order by clause
    const orderByClause =
      sortOrder === "desc"
        ? desc(applications[sortBy as SortableFields] as any)
        : asc(applications[sortBy as SortableFields] as any);

    // Get paginated data
    const data = await db
      .select({
        ...applications,
        jobDescription: jobListings.jobDescription,
        jobTitle: jobListings.title,
        jobLocation: jobListings.jobLocation,
        jobType: jobListings.jobType,
        offeredSalary: jobListings.offeredSalary,
      } as any)
      .from(applications)
      .leftJoin(jobListings, eq(applications.jobId, jobListings.jobId))
      .where(and(...whereConditions))
      .orderBy(orderByClause)
      .limit(size)
      .offset(offset);

    return {
      // @ts-expect-error - all is a string
      data,
      total: total.count,
      page,
      size,
      totalPages: Math.ceil(total.count / size),
    };
  }

  static async getApplicationById(
    applicationId: number
  ): Promise<ApplicationSelect | undefined> {
    return db
      .select()
      .from(applications)
      .where(
        and(
          eq(applications.applicationId, applicationId),
          eq(applications.isDeleted, false)
        )
      )
      .limit(1)
      .then((rows: ApplicationSelect[]) => rows[0]);
    // Generated SQL:
    // SELECT * FROM `applications` WHERE
    // ((`applications`.`application_id` = ?) and (`applications`.`is_deleted` = false)) LIMIT 1
  }

  static async getApplicationsByUserId(
    userId: number
  ): Promise<ApplicationSelect[]> {
    return db
      .select()
      .from(applications)
      .where(
        and(eq(applications.userId, userId), eq(applications.isDeleted, false))
      );
    // Generated SQL:
    // SELECT * FROM `applications` WHERE ((`applications`.`user_id` = ?) and (`applications`.`is_deleted` = false))
  }

  static async getApplicationsByJobId(
    jobId: number
  ): Promise<ApplicationSelect[]> {
    return db
      .select()
      .from(applications)
      .where(
        and(eq(applications.jobId, jobId), eq(applications.isDeleted, false))
      );
    // Generated SQL:
    // SELECT * FROM `applications` WHERE ((`applications`.`job_id` = ?) and (`applications`.`is_deleted` = false))
  }

  static async hasUserAppliedToJob(
    userId: number,
    jobId: number
  ): Promise<boolean> {
    const application = await db
      .select()
      .from(applications)
      .where(
        and(
          eq(applications.userId, userId),
          eq(applications.jobId, jobId),
          eq(applications.isDeleted, false)
        )
      )
      // Generated SQL:
      // SELECT * FROM `applications` WHERE ((`applications`.`user_id` = ?) and (`applications`.`job_id` = ?) and (`applications`.`is_deleted` = false)) LIMIT 1
      .limit(1)
      .then((rows) => rows[0]);

    return !!application;
  }

  static async createApplication(
    userId: number,
    applicationData: Omit<
      ApplicationSelect,
      | "applicationId"
      | "createdDate"
      | "updatedDate"
      | "deletedDate"
      | "isDeleted"
      | "applicationDate"
    >
  ): Promise<number> {
    const { jobId, ...rest } = applicationData;
    try {
      const [result] = await db.insert(applications).values({
        ...rest,
        jobId,
        userId,
        createdBy: userId,
        createdDate: new Date(),
      });
      return result.insertId;
    } catch (error) {
      throw new Error("Failed to create application");
    }
  }

  // update application status
  static async updateApplicationStatus(
    applicationId: number,
    status: "pending" | "shortlisted" | "interviewed" | "rejected" | "accepted"
  ): Promise<boolean> {
    await db
      .update(applications)
      .set({ status, updatedDate: new Date() })
      .where(eq(applications.applicationId, applicationId));
    // Generated SQL:
    // UPDATE `applications` SET `status` =?, `updated_date` =? WHERE (`applications`.`application_id` =?)
    return true;
  }

  static async updateApplication(
    applicationId: number,
    applicationData: Partial<
      Omit<
        ApplicationSelect,
        | "applicationId"
        | "createdDate"
        | "updatedDate"
        | "deletedDate"
        | "isDeleted"
        | "applicationDate"
      >
    >
  ): Promise<boolean> {
    await db
      .update(applications)
      .set({ ...applicationData, updatedDate: new Date() })
      .where(eq(applications.applicationId, applicationId));
    // Generated SQL:
    // UPDATE `applications` SET `job_id` = ?, `user_id` = ?, `status` = ?, `resume_url` = ?, `cover_letter` = ?, `expected_salary` = ?, `interview_date` = ?, `interview_notes` = ?, `rejection_reason` = ?, `created_by` = ?, `created_date` = ?, `updated_by` = ?, `updated_date` = ?, `deleted_by` = ?, `deleted_date` = ?, `is_deleted` = ? WHERE (`applications`.`application_id` = ?)
    return true;
  }

  static async deleteApplication(
    applicationId: number,
    deletedBy: number
  ): Promise<boolean> {
    await db
      .update(applications)
      .set({ isDeleted: true, deletedBy, deletedDate: new Date() })
      .where(eq(applications.applicationId, applicationId));
    // Generated SQL:
    // UPDATE `applications` SET `is_deleted` = true, `deleted_by` = ?, `deleted_date` = ? WHERE (`applications`.`application_id` = ?)
    return true;
  }
}

export default ApplicationModel;
