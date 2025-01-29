import { IApplication } from "../interfaces/IApplication";
import { Application } from "../models/Application";
import { Job } from "../models/Job";

export class ApplicationService {
  private applicationModel: Application;
  private jobModel: Job;

  constructor() {
    this.applicationModel = new Application();
    this.jobModel = new Job();
  }

  async createApplication(
    applicationData: IApplication
  ): Promise<IApplication> {
    const job = await this.jobModel.findById(applicationData.job_id);
    if (!job) {
      throw new Error("Job not found");
    }
    if (job.status !== "active") {
      throw new Error("This job is no longer accepting applications");
    }
    return this.applicationModel.create(applicationData);
  }

  async getApplicationsByJobId(jobId: number): Promise<IApplication[]> {
    return this.applicationModel.findByJobId(jobId);
  }

  async getApplicationsByUserId(userId: number): Promise<IApplication[]> {
    return this.applicationModel.findByUserId(userId);
  }

  async updateApplicationStatus(
    id: number,
    status: string
  ): Promise<IApplication | null> {
    if (
      !["pending", "reviewed", "shortlisted", "rejected", "accepted"].includes(
        status
      )
    ) {
      throw new Error("Invalid application status");
    }
    return this.applicationModel.updateStatus(id, status);
  }
}
