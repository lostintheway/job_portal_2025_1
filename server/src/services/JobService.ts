import { IJob } from "../interfaces/IJob";
import { Job } from "../models/Job";
import { Organization } from "../models/Organization";

export class JobService {
  private jobModel: Job;
  private organizationModel: Organization;

  constructor() {
    this.jobModel = new Job();
    this.organizationModel = new Organization();
  }

  async createJob(jobData: IJob, userId: number): Promise<IJob> {
    // Verify the organization belongs to the user
    const organization = await this.organizationModel.findByUserId(userId);
    if (!organization) {
      throw new Error("Organization profile not found");
    }

    // Set the organization_id from the verified organization
    const job = {
      ...jobData,
      organization_id: organization.id,
      status: "active",
    };

    return this.jobModel.create(job);
  }

  async getJobs(
    page: number = 1,
    limit: number = 10
  ): Promise<{ jobs: IJob[]; total: number }> {
    return this.jobModel.findAll(page, limit);
  }

  async getJobById(id: number): Promise<IJob | null> {
    return this.jobModel.findById(id);
  }

  async updateJob(
    id: number,
    jobData: Partial<IJob>,
    userId: number
  ): Promise<IJob | null> {
    // Verify the job belongs to the user's organization
    const organization = await this.organizationModel.findByUserId(userId);
    if (!organization) {
      throw new Error("Organization profile not found");
    }

    const existingJob = await this.jobModel.findById(id);
    if (!existingJob) {
      throw new Error("Job not found");
    }

    if (existingJob.organization_id !== organization.id) {
      throw new Error("Unauthorized to update this job");
    }

    return this.jobModel.update(id, jobData);
  }

  async getJobsByOrganization(
    organizationId: number,
    page: number = 1,
    limit: number = 10
  ): Promise<IJob[]> {
    const offset = (page - 1) * limit;
    const query = `
      SELECT * FROM jobs 
      WHERE organization_id = $1 
      ORDER BY created_at DESC 
      LIMIT $2 OFFSET $3
    `;
    const result: any = await this.jobModel.query(query, [
      organizationId,
      limit,
      offset,
    ]);
    return result.rows;
  }

  async searchJobs(
    searchParams: {
      keyword?: string;
      location?: string;
      jobType?: string;
      experienceLevel?: string;
    },
    page: number = 1,
    limit: number = 10
  ): Promise<{ jobs: IJob[]; total: number }> {
    const conditions: string[] = ["status = 'active'"];
    const values: any[] = [];
    let paramCount = 1;

    if (searchParams.keyword) {
      conditions.push(
        `(title ILIKE $${paramCount} OR description ILIKE $${paramCount})`
      );
      values.push(`%${searchParams.keyword}%`);
      paramCount++;
    }

    if (searchParams.location) {
      conditions.push(`location ILIKE $${paramCount}`);
      values.push(`%${searchParams.location}%`);
      paramCount++;
    }

    if (searchParams.jobType) {
      conditions.push(`job_type = $${paramCount}`);
      values.push(searchParams.jobType);
      paramCount++;
    }

    if (searchParams.experienceLevel) {
      conditions.push(`experience_level = $${paramCount}`);
      values.push(searchParams.experienceLevel);
      paramCount++;
    }

    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
    const offset = (page - 1) * limit;

    const query = `
      SELECT * FROM jobs 
      ${whereClause}
      ORDER BY created_at DESC 
      LIMIT $${paramCount} OFFSET $${paramCount + 1}
    `;

    const countQuery = `
      SELECT COUNT(*) FROM jobs ${whereClause}
    `;

    const [jobsResult, countResult] = await Promise.all([
      this.jobModel.query(query, [...values, limit, offset]),
      this.jobModel.query(countQuery, values),
    ]);

    return {
      jobs: jobsResult.rows,
      total: parseInt(countResult.rows[0].count),
    };
  }

  async closeJob(id: number, userId: number): Promise<IJob | null> {
    const organization = await this.organizationModel.findByUserId(userId);
    if (!organization) {
      throw new Error("Organization profile not found");
    }

    const existingJob = await this.jobModel.findById(id);
    if (!existingJob) {
      throw new Error("Job not found");
    }

    if (existingJob.organization_id !== organization.id) {
      throw new Error("Unauthorized to close this job");
    }

    return this.jobModel.update(id, { status: "closed" });
  }
}
