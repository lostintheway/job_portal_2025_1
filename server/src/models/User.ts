import { pool } from "../config/db";
import { IUser } from "../interfaces/IUser";

export class User {
  private tableName = "users";

  async create(user: IUser): Promise<IUser> {
    const query = `
      INSERT INTO ${this.tableName} (email, password, full_name, role)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    const values = [user.email, user.password, user.fullName, user.role];
    const result: any = pool.query(query, values);
    return result.rows[0];
  }

  async findByEmail(email: string): Promise<IUser | null> {
    const query = `SELECT * FROM ${this.tableName} WHERE email = $1`;
    const result: any = pool.query(query, [email]);
    return result.rows[0] || null;
  }
}
