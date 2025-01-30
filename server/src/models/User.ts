import { eq } from "drizzle-orm";
import { db } from "../config/db";
import { users } from "../db/schema";
import { IUser } from "../interfaces/IUser";

export class User {
  async create(user: IUser): Promise<IUser> {
    const result = await db.insert(users).values(user).$returningId();
    const fullRecord = await db
      .select()
      .from(users)
      .where(eq(users.id, result[0].id));
    return fullRecord[0];
  }

  async findByEmail(email: string): Promise<IUser | null> {
    const result = await db.select().from(users).where(eq(users.email, email));
    return result[0] || null;
  }
}
