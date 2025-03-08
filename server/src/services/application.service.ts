import type { ApplicationSelect } from "../db/schema";
import type { ResponseWithTotal } from "../interfaces/ResponseWithTotal.ts";
import type { ApplicationQueryParams } from "../interfaces/QueryParams.ts";
import ApplicationModel, {
  type MyApplications,
} from "../models/application.model.ts";

class ApplicationService {
  static async getApplications(
    params: ApplicationQueryParams
  ): Promise<ResponseWithTotal<ApplicationSelect[]>> {
    return ApplicationModel.getApplications(params);
  }

  static async getMyApplications(userId: number): Promise<MyApplications[]> {
    return ApplicationModel.getMyApplications(userId);
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

  static async updateApplicationStatus(
    applicationId: number,
    applicationStatus:
      | "pending"
      | "shortlisted"
      | "interviewed"
      | "rejected"
      | "accepted"
  ): Promise<boolean> {
    return ApplicationModel.updateApplicationStatus(
      applicationId,
      applicationStatus
    );
  }

  static async deleteApplication(
    applicationId: number,
    deletedBy: number
  ): Promise<boolean> {
    return ApplicationModel.deleteApplication(applicationId, deletedBy);
  }
}

export default ApplicationService;
