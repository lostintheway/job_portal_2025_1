import type { JobSeekerProfileSelect } from "../db/schema.ts";
import JobSeekerProfileModel from "../models/jobseekerProfile.model.ts";

class JobSeekerProfileService {
  static async getAllProfiles(): Promise<JobSeekerProfileSelect[]> {
    return JobSeekerProfileModel.getAllProfiles();
  }

  static async getProfileById(
    profileId: number
  ): Promise<JobSeekerProfileSelect | undefined> {
    return JobSeekerProfileModel.getProfileById(profileId);
  }

  static async getProfileByUserId(
    userId: number
  ): Promise<JobSeekerProfileSelect | undefined> {
    return JobSeekerProfileModel.getProfileByUserId(userId);
  }

  static async createProfile(
    profileData: Omit<
      JobSeekerProfileSelect,
      "profileId" | "createdDate" | "updatedDate" | "deletedDate" | "isDeleted"
    >
  ): Promise<number> {
    return JobSeekerProfileModel.createProfile(profileData);
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
    return JobSeekerProfileModel.updateProfile(profileId, profileData, userId);
  }

  static async deleteProfile(
    profileId: number,
    deletedBy: number
  ): Promise<boolean> {
    return JobSeekerProfileModel.deleteProfile(profileId, deletedBy);
  }
}

export default JobSeekerProfileService;
