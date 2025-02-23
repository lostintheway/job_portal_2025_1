import { eq } from "drizzle-orm";
import { users } from "../db/schema";
import { db } from "../config/db";
import { CommonFields } from "../interfaces/CommonFields";

export interface User extends CommonFields {
  userId: number;
  email: string;
  password: string;
  fullName: string;
  contactNumber: string;
  address: string;
  role: "jobseeker" | "vendor" | "admin";
  profileImage?: string;
}

class UserModel {
  static async getAllUsers(): Promise<User[]> {
    const result: any = db.select().from(users);
    return result;
  }

  static async getUserById(userId: number): Promise<User | undefined> {
    const result: any = db
      .select()
      .from(users)
      .where(eq(users.userId, userId))
      .limit(1)
      .then((rows) => rows[0]);
    return result;
  }

  static async createUser(
    userData: Omit<
      User,
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
        User,
        "userId" | "createdDate" | "updatedDate" | "deletedDate" | "isDeleted"
      >
    >
  ): Promise<boolean> {
    await db.update(users).set(userData).where(eq(users.userId, userId));
    return true;
  }

  static async deleteUser(userId: number, deletedBy: number): Promise<boolean> {
    await db
      .update(users)
      .set({ isDeleted: true, deletedBy, deletedDate: new Date() })
      .where(eq(users.userId, userId));
    return true;
  }
}

export default UserModel;
