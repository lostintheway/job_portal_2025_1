import { eq, and } from "drizzle-orm";
import { users, UserSelect } from "../db/schema";
import { db } from "../config/db";
import { CommonFields } from "../interfaces/CommonFields";

class UserModel {
  static async getAllUsers(): Promise<UserSelect[]> {
    return db.select().from(users);
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

  static async createUser(
    userData: Omit<
      UserSelect,
      "userId" | "createdDate" | "updatedDate" | "deletedDate" | "isDeleted"
    >
  ): Promise<number> {
    const [result] = await db.insert(users).values(userData);
    return result.insertId;
  }

  static async updateUser(
    userId: number,
    userData: Partial<
      Omit<
        UserSelect,
        "userId" | "createdDate" | "updatedDate" | "deletedDate" | "isDeleted"
      >
    >
  ): Promise<boolean> {
    await db
      .update(users)
      .set({ ...userData })
      .where(eq(users.userId, userId));
    return true;
  }
}

export default UserModel;
