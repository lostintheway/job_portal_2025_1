import { eq } from "drizzle-orm";
import { db } from "../config/db";
import { applications } from "../db/schema";
import { CommonFields } from "../interfaces/CommonFields";

export interface Application extends CommonFields {
  applicationId: number;
  jobDescriptionId: number;
  userId: number;
  status: "pending" | "shortlisted" | "interviewed" | "rejected" | "accepted";
  resumeUrl: string;
  coverLetter?: string;
  expectedSalary?: string;
}

class ApplicationModel {
  static async getAllApplications(): Promise<Application[]> {
    const result: any = db.select().from(applications);
    return result;
  }

  static async getApplicationById(
    applicationId: number
  ): Promise<Application | undefined> {
    const result: any = db
      .select()
      .from(applications)
      .where(eq(applications.applicationId, applicationId))
      .limit(1)
      .then((rows) => rows[0]);
    return result;
  }

  static async createApplication(
    applicationData: Omit<
      Application,
      | "applicationId"
      | "createdDate"
      | "updatedDate"
      | "deletedDate"
      | "isDeleted"
    >
  ): Promise<number> {
    const [result] = await db.insert(applications).values(applicationData);
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
      >
    >
  ): Promise<boolean> {
    await db
      .update(applications)
      .set(applicationData)
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
