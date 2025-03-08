import { eq, and } from "drizzle-orm";
import { users, type UserSelect } from "../db/schema.ts";
import { db } from "../config/db.ts";
import HashPassword from "../middleware/HashPassword.ts";

class UserModel {
  static async login(
    email: string,
    password: string
  ): Promise<UserSelect | undefined> {
    const user = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1)
      .then((rows) => rows[0]);
    if (!user) {
      return undefined;
    }
    const isValid = HashPassword.verifyPassword(
      password,
      user.salt,
      user.password
    );
    return isValid ? user : undefined;
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
  //   Example usage
  // const { salt, hash } = HashPassword.saltPassword("mySecurePassword123");
  // console.log("Salt:", salt);
  // console.log("Hash:", hash);

  // const isValid = HashPassword.verifyPassword("mySecurePassword123", salt, hash);
  // console.log("Password valid:", isValid);

  static async createUser(userData: UserSelect): Promise<number> {
    // hash
    const { salt, hash } = HashPassword.saltPassword(userData.password);
    userData.password = hash;
    userData.salt = salt;
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
