import { and, eq } from "drizzle-orm";
import { db } from "../config/db";
import { employerProfiles, EmployerProfileSelect } from "../db/schema";

class EmployerProfileModel {
  static async getAllEmployerProfiles(): Promise<EmployerProfileSelect[]> {
    return db
      .select()
      .from(employerProfiles)
      .where(eq(employerProfiles.isDeleted, false));
  }

  static async getEmployerProfileById(
    employerId: number
  ): Promise<EmployerProfileSelect | undefined> {
    return db
      .select()
      .from(employerProfiles)
      .where(
        and(
          eq(employerProfiles.employerId, employerId),
          eq(employerProfiles.isDeleted, false)
        )
      )
      .limit(1)
      .then((rows) => rows[0]);
  }

  static async getEmployerProfileByUserId(
    userId: number
  ): Promise<EmployerProfileSelect | undefined> {
    return db
      .select()
      .from(employerProfiles)
      .where(
        and(
          eq(employerProfiles.userId, userId),
          eq(employerProfiles.isDeleted, false)
        )
      )
      .limit(1)
      .then((rows) => rows[0]);
  }

  static async createEmployerProfile(
    profileData: Omit<
      EmployerProfileSelect,
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
        EmployerProfileSelect,
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
