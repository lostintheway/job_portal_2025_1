import { pool } from "../config/db";
import { IApplication } from "../interfaces/IApplication";

export class Application {
  private tableName = "applications";

  create(application: IApplication): Promise<IApplication> {
    const query = `
      INSERT INTO ${this.tableName} 
      (job_id, user_id, status, resume_url, cover_letter)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    const values = [
      application.job_id,
      application.user_id,
      application.status,
      application.resume_url,
      application.cover_letter,
    ];
    const result: any = pool.query(query, values);
    return result.rows[0];
  }

  findByJobId(jobId: number): Promise<IApplication[]> {
    const query = `
      SELECT a.*, u.full_name, u.email 
      FROM ${this.tableName} a
      JOIN users u ON a.user_id = u.id
      WHERE a.job_id = $1
      ORDER BY a.created_at DESC
    `;
    const result: any = pool.query(query, [jobId]);
    return result.rows;
  }

  findByUserId(userId: number): Promise<IApplication[]> {
    const query = `
      SELECT a.*, j.title as job_title, c.name as company_name
      FROM ${this.tableName} a
      JOIN jobs j ON a.job_id = j.id
      JOIN companies c ON j.company_id = c.id
      WHERE a.user_id = $1
      ORDER BY a.created_at DESC
    `;
    const result: any = pool.query(query, [userId]);
    return result.rows;
  }

  updateStatus(id: number, status: string): Promise<IApplication | null> {
    const query = `
      UPDATE ${this.tableName}
      SET status = $1
      WHERE id = $2
      RETURNING *
    `;
    const result: any = pool.query(query, [status, id]);
    return result.rows[0] || null;
  }
}
