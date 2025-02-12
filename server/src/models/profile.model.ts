import db from "../config/db.config";
import { profiles } from "../../../../schema/schema";
import { eq } from "drizzle-orm";

export interface Profile {
  profileId: number;
  userId: number;
  headline: string;
  summary?: string;
  experience: string;
  education: string;
  skills: string;
  languages: string;
  isPublic: boolean;
  createdBy: number;
  createdDate: Date;
  updatedBy?: number;
  updatedDate?: Date;
  deletedBy?: number;
  deletedDate?: Date;
  isDeleted: boolean;
}

class ProfileModel {
  static async getAllProfiles(): Promise<Profile[]> {
    return db.select().from(profiles);
  }

  static async getProfileById(profileId: number): Promise<Profile | undefined> {
    return db
      .select()
      .from(profiles)
      .where(eq(profiles.profileId, profileId))
      .limit(1)
      .then((rows) => rows[0]);
  }

  static async createProfile(
    profileData: Omit<
      Profile,
      "profileId" | "createdDate" | "updatedDate" | "deletedDate" | "isDeleted"
    >
  ): Promise<number> {
    const [result] = await db.insert(profiles).values(profileData);
    return result.insertId;
  }

  static async updateProfile(
    profileId: number,
    profileData: Partial<
      Omit<
        Profile,
        | "profileId"
        | "createdDate"
        | "updatedDate"
        | "deletedDate"
        | "isDeleted"
      >
    >
  ): Promise<boolean> {
    await db
      .update(profiles)
      .set(profileData)
      .where(eq(profiles.profileId, profileId));
    return true;
  }

  static async deleteProfile(
    profileId: number,
    deletedBy: number
  ): Promise<boolean> {
    await db
      .update(profiles)
      .set({ isDeleted: true, deletedBy, deletedDate: new Date() })
      .where(eq(profiles.profileId, profileId));
    return true;
  }
}

export default ProfileModel;
