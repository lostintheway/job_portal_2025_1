import { eq, and } from "drizzle-orm";
import { users, type UserSelect } from "../db/schema.ts";
import { db } from "../config/db.ts";

class UserModel {
  static async login(
    email: string,
    password: string
  ): Promise<UserSelect | undefined> {
    return db
      .select()
      .from(users)
      .where(and(eq(users.email, email), eq(users.password, password)))
      .limit(1)
      .then((rows) => rows[0]);
  }

  static async getUserById(userId: number): Promise<UserSelect | undefined> {
    return db
      .select()
      .from(users)
      .where(eq(users.userId, userId))
      .limit(1)
      .then((rows) => rows[0]);
  }

  static async getUserByEmail(email: string): Promise<UserSelect | undefined> {
    return db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1)
      .then((rows) => rows[0]);
  }

  static async createUser(userData: UserSelect): Promise<number> {
    console.log({ userData });
    const [result] = await db.insert(users).values(userData);
    return result.insertId;
  }

  static async updateUser(
    userId: number,
    userData: Partial<UserSelect>
  ): Promise<boolean> {
    await db
      .update(users)
      .set({ ...userData })
      .where(eq(users.userId, userId));
    return true;
  }
}

export default UserModel;
