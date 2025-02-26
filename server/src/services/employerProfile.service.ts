import { EmployerProfileSelect } from "../db/schema";
import EmployerProfileModel from "../models/employerProfile.model";

class EmployerProfileService {
  static async getAllEmployerProfiles(): Promise<EmployerProfileSelect[]> {
    return EmployerProfileModel.getAllEmployerProfiles();
  }

  static async getEmployerProfileById(
    employerId: number
  ): Promise<EmployerProfileSelect | undefined> {
    return EmployerProfileModel.getEmployerProfileById(employerId);
  }

  static async getEmployerProfileByUserId(
    userId: number
  ): Promise<EmployerProfileSelect | undefined> {
    return EmployerProfileModel.getEmployerProfileByUserId(userId);
  }

  static async createEmployerProfile(
    profileData: Omit<
      EmployerProfileSelect,
      "employerId" | "createdDate" | "updatedDate" | "deletedDate" | "isDeleted"
    >
  ): Promise<number> {
    return EmployerProfileModel.createEmployerProfile(profileData);
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
    return EmployerProfileModel.updateEmployerProfile(employerId, profileData);
  }

  static async deleteEmployerProfile(
    employerId: number,
    deletedBy: number
  ): Promise<boolean> {
    return EmployerProfileModel.deleteEmployerProfile(employerId, deletedBy);
  }
}

export default EmployerProfileService;