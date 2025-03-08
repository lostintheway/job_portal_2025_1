import { eq, and } from "drizzle-orm";
import { db } from "../config/db.ts";
import {
  jobseekerProfiles,
  type JobSeekerProfileSelect,
} from "../db/schema.ts";
import type { CommonFields } from "../interfaces/CommonFields.ts";

class JobSeekerProfileModel {
  static async getAllProfiles(): Promise<JobSeekerProfileSelect[]> {
    return db
      .select()
      .from(jobseekerProfiles)
      .where(eq(jobseekerProfiles.isDeleted, false));
  }

  static async getProfileById(
    profileId: number
  ): Promise<JobSeekerProfileSelect | undefined> {
    return db
      .select()
      .from(jobseekerProfiles)
      .where(
        and(
          eq(jobseekerProfiles.profileId, profileId),
          eq(jobseekerProfiles.isDeleted, false)
        )
      )
      .limit(1)
      .then((rows) => rows[0]);
  }

  static async getProfileByUserId(
    userId: number
  ): Promise<JobSeekerProfileSelect | undefined> {
    return db
      .select()
      .from(jobseekerProfiles)
      .where(
        and(
          eq(jobseekerProfiles.userId, userId),
          eq(jobseekerProfiles.isDeleted, false)
        )
      )
      .limit(1)
      .then((rows) => rows[0]);
  }

  static async createProfile(
    profileData: Omit<
      JobSeekerProfileSelect,
      "profileId" | "createdDate" | "updatedDate" | "deletedDate" | "isDeleted"
    >
  ): Promise<number> {
    const [result] = await db.insert(jobseekerProfiles).values(profileData);
    return result.insertId;
  }

  static async updateProfile(
    profileId: number,
    profileData: Partial<
      Omit<
        JobSeekerProfileSelect,
        | "profileId"
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
        isPublic,
        createdBy,
        // @ts-expect-error - all is a string
        createdDate,
        updatedBy,
        // @ts-expect-error - all is a string
        updatedDate,
        deletedBy,
        // @ts-expect-error - all is a string
        deletedDate,
        // @ts-expect-error - all is a string
        isDeleted,
        ...updateData
      } = profileData;
      await db
        .update(jobseekerProfiles)
        .set({ ...updateData, updatedDate: new Date(), updatedBy: userId })
        .where(
          and(
            eq(jobseekerProfiles.profileId, profileId),
            eq(jobseekerProfiles.userId, userId)
          )
        );
      return true;
    } catch (error) {
      console.error("Error updating profile:", error);
      return false;
    }
  }

  static async deleteProfile(
    profileId: number,
    deletedBy: number
  ): Promise<boolean> {
    await db
      .update(jobseekerProfiles)
      .set({ isDeleted: true, deletedBy, deletedDate: new Date() })
      .where(eq(jobseekerProfiles.profileId, profileId));
    return true;
  }
}

export default JobSeekerProfileModel;
