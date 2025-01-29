import { IJob } from "../interfaces/IJob";
import { Job } from "../models/Job";
import { Company } from "../models/Company";

export class JobService {
  private jobModel: Job;
  private companyModel: Company;

  constructor() {
    this.jobModel = new Job();
    this.companyModel = new Company();
  }

  async createJob(jobData: IJob, userId: number): Promise<IJob> {
    // Verify the company belongs to the user
    const company = await this.companyModel.findByUserId(userId);
    if (!company) {
      throw new Error("Company profile not found");
    }

    // Set the company_id from the verified company
    const job = {
      ...jobData,
      company_id: company.id,
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
    // Verify the job belongs to the user's company
    const company = await this.companyModel.findByUserId(userId);
    if (!company) {
      throw new Error("Company profile not found");
    }

    const existingJob = await this.jobModel.findById(id);
    if (!existingJob) {
      throw new Error("Job not found");
    }

    if (existingJob.company_id !== company.id) {
      throw new Error("Unauthorized to update this job");
    }

    return this.jobModel.update(id, jobData);
  }

  async getJobsByCompany(
    companyId: number,
    page: number = 1,
    limit: number = 10
  ): Promise<IJob[]> {
    const offset = (page - 1) * limit;
    const query = `
      SELECT * FROM jobs 
      WHERE company_id = $1 
      ORDER BY created_at DESC 
      LIMIT $2 OFFSET $3
    `;
    const result: any = await this.jobModel.query(query, [
      companyId,
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
    const company = await this.companyModel.findByUserId(userId);
    if (!company) {
      throw new Error("Company profile not found");
    }

    const existingJob = await this.jobModel.findById(id);
    if (!existingJob) {
      throw new Error("Job not found");
    }

    if (existingJob.company_id !== company.id) {
      throw new Error("Unauthorized to close this job");
    }

    return this.jobModel.update(id, { status: "closed" });
  }
}
