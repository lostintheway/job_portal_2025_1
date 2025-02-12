import { eq } from "drizzle-orm";
import { db } from "../config/db";
import { jobDescriptions } from "../db/schema";

export interface JobDescription {
  jobDescriptionId: number;
  vendorOrgId: number;
  categoryId: number;
  jobType: string;
  level: string;
  vacancyNo: number;
  employeeType: string;
  jobLocation: string;
  offeredSalary: string;
  deadLine: Date;
  educationLevel: string;
  experienceRequired: string;
  otherSpecification?: string;
  jobWorkDescription: string;
  createdBy: number;
  createdDate: Date;
  updatedBy?: number;
  updatedDate?: Date;
  deletedBy?: number;
  deletedDate?: Date;
  isDeleted: boolean;
}

class JobDescriptionModel {
  static async getAllJobDescriptions(): Promise<JobDescription[]> {
    const result: any = db.select().from(jobDescriptions);
    return result;
  }

  static async getJobDescriptionById(
    jobDescriptionId: number
  ): Promise<JobDescription | undefined> {
    const result: any = db
      .select()
      .from(jobDescriptions)
      .where(eq(jobDescriptions.jobDescriptionId, jobDescriptionId))
      .limit(1)
      .then((rows) => rows[0]);
    return result;
  }

  static async createJobDescription(
    jobDescriptionData: Omit<
      JobDescription,
      | "jobDescriptionId"
      | "createdDate"
      | "updatedDate"
      | "deletedDate"
      | "isDeleted"
    >
  ): Promise<number> {
    const [result] = await db
      .insert(jobDescriptions)
      .values(jobDescriptionData);
    return result.insertId;
  }

  static async updateJobDescription(
    jobDescriptionId: number,
    jobDescriptionData: Partial<
      Omit<
        JobDescription,
        | "jobDescriptionId"
        | "createdDate"
        | "updatedDate"
        | "deletedDate"
        | "isDeleted"
      >
    >
  ): Promise<boolean> {
    await db
      .update(jobDescriptions)
      .set(jobDescriptionData)
      .where(eq(jobDescriptions.jobDescriptionId, jobDescriptionId));
    return true;
  }

  static async deleteJobDescription(
    jobDescriptionId: number,
    deletedBy: number
  ): Promise<boolean> {
    await db
      .update(jobDescriptions)
      .set({ isDeleted: true, deletedBy, deletedDate: new Date() })
      .where(eq(jobDescriptions.jobDescriptionId, jobDescriptionId));
    return true;
  }
}

export default JobDescriptionModel;
