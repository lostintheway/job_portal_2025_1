import { eq, and } from "drizzle-orm";
import { db } from "../config/db";
import { jobseekerProfiles, JobSeekerProfileSelect } from "../db/schema";
import { CommonFields } from "../interfaces/CommonFields";

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
    >
  ): Promise<boolean> {
    await db
      .update(jobseekerProfiles)
      .set({ ...profileData, updatedDate: new Date() })
      .where(eq(jobseekerProfiles.profileId, profileId));
    return true;
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
