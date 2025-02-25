import { eq } from "drizzle-orm";
import { db } from "../config/db";
import { employerProfiles } from "../db/schema";
import { CommonFields } from "../interfaces/CommonFields";

export interface EmployerProfile extends CommonFields {
  employerId: number;
  userId: number;
  companyName: string;
  companyAddress: string;
  companyContact: string;
  companyEmail: string;
  companyLogo?: string;
  companyDescription?: string;
  industryType?: string;
  establishedDate?: Date;
  companySize?: string;
  companyWebsite?: string;
}

class EmployerProfileModel {
  static async getAllEmployerProfiles(): Promise<EmployerProfile[]> {
    return db
      .select()
      .from(employerProfiles)
      .where(eq(employerProfiles.isDeleted, false));
  }

  static async getEmployerProfileById(
    employerId: number
  ): Promise<EmployerProfile | undefined> {
    return db
      .select()
      .from(employerProfiles)
      .where(eq(employerProfiles.employerId, employerId))
      .where(eq(employerProfiles.isDeleted, false))
      .limit(1)
      .then((rows) => rows[0]);
  }

  static async getEmployerProfileByUserId(
    userId: number
  ): Promise<EmployerProfile | undefined> {
    return db
      .select()
      .from(employerProfiles)
      .where(eq(employerProfiles.userId, userId))
      .where(eq(employerProfiles.isDeleted, false))
      .limit(1)
      .then((rows) => rows[0]);
  }

  static async createEmployerProfile(
    profileData: Omit<
      EmployerProfile,
      "employerId" | "createdDate" | "updatedDate" | "deletedDate" | "isDeleted"
    >
  ): Promise<number> {
    const [result] = await db.insert(employerProfiles).values(profileData);
    return result.insertId;
  }

  static async updateEmployerProfile(
    employerId: number,
    profileData: Partial<
      Omit<
        EmployerProfile,
        | "employerId"
        | "createdDate"
        | "updatedDate"
        | "deletedDate"
        | "isDeleted"
      >
    >
  ): Promise<boolean> {
    await db
      .update(employerProfiles)
      .set({ ...profileData, updatedDate: new Date() })
      .where(eq(employerProfiles.employerId, employerId));
    return true;
  }

  static async deleteEmployerProfile(
    employerId: number,
    deletedBy: number
  ): Promise<boolean> {
    await db
      .update(employerProfiles)
      .set({ isDeleted: true, deletedBy, deletedDate: new Date() })
      .where(eq(employerProfiles.employerId, employerId));
    return true;
  }
}

export default EmployerProfileModel;
