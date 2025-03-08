import { and, eq } from "drizzle-orm";
import { db } from "../config/db.ts";
import { employerProfiles, type EmployerProfileSelect } from "../db/schema.ts";

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
    >,
    userId: number
  ): Promise<boolean> {
    try {
      const {
        createdBy,
        updatedBy,
        deletedBy,
        deletedDate,
        isDeleted,
        ...updateData
      } = profileData;
      await db
        .update(employerProfiles)
        .set({ ...updateData, updatedDate: new Date(), updatedBy: userId })
        .where(eq(employerProfiles.employerId, employerId));
      return true;
    } catch (error) {
      console.error("Error updating employer profile:", error);
      return false;
    }
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
