import JobDescriptionModel, {
  JobDescription,
} from "../models/jobDescription.model";

class JobDescriptionService {
  static async getAllJobDescriptions(): Promise<JobDescription[]> {
    return JobDescriptionModel.getAllJobDescriptions();
  }

  static async getJobDescriptionById(
    jobDescriptionId: number
  ): Promise<JobDescription | undefined> {
    return JobDescriptionModel.getJobDescriptionById(jobDescriptionId);
  }

  static async createJobDescription(
    jobDescriptionData: Omit<
      JobDescription,
      | "jobDescriptionId"
      | "createdDate"
      | "updatedDate"
      | "deletedDate"
      | "isDeleted"
    >
  ): Promise<number> {
    return JobDescriptionModel.createJobDescription(jobDescriptionData);
  }

  static async updateJobDescription(
    jobDescriptionId: number,
    jobDescriptionData: Partial<
      Omit<
        JobDescription,
        | "jobDescriptionId"
        | "createdDate"
        | "updatedDate"
        | "deletedDate"
        | "isDeleted"
      >
    >
  ): Promise<boolean> {
    return JobDescriptionModel.updateJobDescription(
      jobDescriptionId,
      jobDescriptionData
    );
  }

  static async deleteJobDescription(
    jobDescriptionId: number,
    deletedBy: number
  ): Promise<boolean> {
    return JobDescriptionModel.deleteJobDescription(
      jobDescriptionId,
      deletedBy
    );
  }
}

export default JobDescriptionService;
