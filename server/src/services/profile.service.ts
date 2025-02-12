import ProfileModel, { Profile } from "../models/profile.model";

class ProfileService {
  static async getAllProfiles(): Promise<Profile[]> {
    return ProfileModel.getAllProfiles();
  }

  static async getProfileById(profileId: number): Promise<Profile | undefined> {
    return ProfileModel.getProfileById(profileId);
  }

  static async createProfile(
    profileData: Omit<
      Profile,
      "profileId" | "createdDate" | "updatedDate" | "deletedDate" | "isDeleted"
    >
  ): Promise<number> {
    return ProfileModel.createProfile(profileData);
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
    return ProfileModel.updateProfile(profileId, profileData);
  }

  static async deleteProfile(
    profileId: number,
    deletedBy: number
  ): Promise<boolean> {
    return ProfileModel.deleteProfile(profileId, deletedBy);
  }
}

export default ProfileService;
