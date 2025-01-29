import { pool } from "../config/db";
import { IJob } from "../interfaces/IJob";

export class Job {
  private tableName = "jobs";

  create(job: IJob): Promise<IJob> {
    const query = `
      INSERT INTO ${this.tableName} 
      (title, description, requirements, salary_range, location, company_id, job_type, experience_level, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `;
    const values = [
      job.title,
      job.description,
      job.requirements,
      job.salary_range,
      job.location,
      job.company_id,
      job.job_type,
      job.experience_level,
      job.status,
    ];
    const result: any = pool.query(query, values);
    return result.rows[0];
  }

  findAll(
    page: number = 1,
    limit: number = 10
  ): Promise<{ jobs: IJob[]; total: number }> {
    const offset = (page - 1) * limit;
    const query = `
      SELECT * FROM ${this.tableName}
      WHERE status = 'active'
      ORDER BY created_at DESC
      LIMIT $1 OFFSET $2
    `;
    const countQuery = `SELECT COUNT(*) FROM ${this.tableName} WHERE status = 'active'`;

    const jobsResult = pool.query(query, [limit, offset]);
    const countResult = pool.query(countQuery);
    // const [jobsResult, countResult] =  Promise.all([
    // ]);

    return {
      jobs: jobsResult.rows,
      total: parseInt(countResult.rows[0].count),
    };
  }

  findById(id: number): Promise<IJob | null> {
    const query = `SELECT * FROM ${this.tableName} WHERE id = $1`;
    const result: any = pool.query(query, [id]);
    return result.rows[0] || null;
  }

  update(id: number, job: Partial<IJob>): Promise<IJob | null> {
    const keys = Object.keys(job);
    const values = Object.values(job);

    const setClause = keys
      .map((key, index) => `${key} = $${index + 1}`)
      .join(", ");

    const query = `
      UPDATE ${this.tableName}
      SET ${setClause}
      WHERE id = $${keys.length + 1}
      RETURNING *
    `;

    const result: any = pool.query(query, [...values, id]);
    return result.rows[0] || null;
  }
}
