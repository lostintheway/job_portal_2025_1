import { eq, and } from "drizzle-orm";
import { db } from "../config/db";
import { applications } from "../db/schema";
import { CommonFields } from "../interfaces/CommonFields";

export interface Application extends CommonFields {
  applicationId: number;
  jobId: number;
  userId: number;
  status: "pending" | "shortlisted" | "interviewed" | "rejected" | "accepted";
  resumeUrl: string;
  coverLetter?: string;
  expectedSalary?: string;
  applicationDate: Date;
  interviewDate?: Date;
  interviewNotes?: string;
  rejectionReason?: string;
}

class ApplicationModel {
  static async getAllApplications(): Promise<Application[]> {
    return db
      .select()
      .from(applications)
      .where(eq(applications.isDeleted, false));
  }

  static async getApplicationById(
    applicationId: number
  ): Promise<Application | undefined> {
    return db
      .select()
      .from(applications)
      .where(eq(applications.applicationId, applicationId))
      .where(eq(applications.isDeleted, false))
      .limit(1)
      .then((rows) => rows[0]);
  }

  static async getApplicationsByUserId(userId: number): Promise<Application[]> {
    return db
      .select()
      .from(applications)
      .where(eq(applications.userId, userId))
      .where(eq(applications.isDeleted, false));
  }

  static async getApplicationsByJobId(jobId: number): Promise<Application[]> {
    return db
      .select()
      .from(applications)
      .where(eq(applications.jobId, jobId))
      .where(eq(applications.isDeleted, false));
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
      .limit(1)
      .then((rows) => rows[0]);

    return !!application;
  }

  static async createApplication(
    applicationData: Omit<
      Application,
      | "applicationId"
      | "createdDate"
      | "updatedDate"
      | "deletedDate"
      | "isDeleted"
      | "applicationDate"
    >
  ): Promise<number> {
    const [result] = await db.insert(applications).values({
      ...applicationData,
      applicationDate: new Date(),
    });
    return result.insertId;
  }

  static async updateApplication(
    applicationId: number,
    applicationData: Partial<
      Omit<
        Application,
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
    return true;
  }
}

export default ApplicationModel;
