import { ApplicationSelect } from "../db/schema";
import ApplicationModel from "../models/application.model";

class ApplicationService {
  static async getAllApplications(): Promise<ApplicationSelect[]> {
    return ApplicationModel.getAllApplications();
  }

  static async getApplicationById(
    applicationId: number
  ): Promise<ApplicationSelect | undefined> {
    return ApplicationModel.getApplicationById(applicationId);
  }

  static async createApplication(
    applicationData: Omit<
      ApplicationSelect,
      | "applicationId"
      | "createdDate"
      | "updatedDate"
      | "deletedDate"
      | "isDeleted"
    >
  ): Promise<number> {
    return ApplicationModel.createApplication(applicationData);
  }

  static async updateApplication(
    applicationId: number,
    applicationData: Partial<
      Omit<
        ApplicationSelect,
        | "applicationId"
        | "createdDate"
        | "updatedDate"
        | "deletedDate"
        | "isDeleted"
      >
    >
  ): Promise<boolean> {
    return ApplicationModel.updateApplication(applicationId, applicationData);
  }

  static async deleteApplication(
    applicationId: number,
    deletedBy: number
  ): Promise<boolean> {
    return ApplicationModel.deleteApplication(applicationId, deletedBy);
  }
}

export default ApplicationService;
