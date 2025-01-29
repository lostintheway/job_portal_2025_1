import { pool } from "../config/db";
import { ICompany } from "../interfaces/ICompany";

export class Company {
  private tableName = "companies";

  create(company: ICompany): Promise<ICompany> {
    const query = `
      INSERT INTO ${this.tableName} 
      (name, description, location, website, logo_url, user_id, industry, size)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `;
    const values = [
      company.name,
      company.description,
      company.location,
      company.website,
      company.logo_url,
      company.user_id,
      company.industry,
      company.size,
    ];
    const result: any = pool.query(query, values);
    return result.rows[0];
  }

  async findById(id: number): Promise<ICompany | null> {
    const query = `SELECT * FROM ${this.tableName} WHERE id = $1`;
    const result: any = pool.query(query, [id]);
    return result.rows[0] || null;
  }

  async findByUserId(userId: number): Promise<ICompany | null> {
    const query = `SELECT * FROM ${this.tableName} WHERE user_id = $1`;
    const result: any = pool.query(query, [userId]);
    return result.rows[0] || null;
  }

  async update(
    id: number,
    company: Partial<ICompany>
  ): Promise<ICompany | null> {
    const keys = Object.keys(company);
    const values = Object.values(company);

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
