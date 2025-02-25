import { eq } from "drizzle-orm";
import { db } from "../config/db";
import { jobseekerProfiles } from "../db/schema";
import { CommonFields } from "../interfaces/CommonFields";

export interface JobSeekerProfile extends CommonFields {
  profileId: number;
  userId: number;
  headline: string;
  summary: string | null;
  experience: string;
  education: string;
  skills: string;
  languages: string;
  isPublic: boolean;
}

class JobSeekerProfileModel {
  static async getAllProfiles(): Promise<JobSeekerProfile[]> {
    return db
      .select()
      .from(jobseekerProfiles)
      .where(eq(jobseekerProfiles.isDeleted, false));
  }

  static async getProfileById(
    profileId: number
  ): Promise<JobSeekerProfile | undefined> {
    return db
      .select()
      .from(jobseekerProfiles)
      .where(eq(jobseekerProfiles.profileId, profileId))
      .where(eq(jobseekerProfiles.isDeleted, false))
      .limit(1)
      .then((rows) => rows[0]);
  }

  static async getProfileByUserId(
    userId: number
  ): Promise<JobSeekerProfile | undefined> {
    return db
      .select()
      .from(jobseekerProfiles)
      .where(eq(jobseekerProfiles.userId, userId))
      .where(eq(jobseekerProfiles.isDeleted, false))
      .limit(1)
      .then((rows) => rows[0]);
  }

  static async createProfile(
    profileData: Omit<
      JobSeekerProfile,
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
        JobSeekerProfile,
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
