import { eq } from "drizzle-orm";
import { db } from "../config/db";
import { companies } from "../db/schema";
import { IOrganization } from "../interfaces/IOrganization";

export class Organization {
  async create(company: IOrganization): Promise<IOrganization> {
    const result = await db.insert(companies).values(company).$returningId();
    const fullRecord = await db
      .select()
      .from(companies)
      .where(eq(companies.id, result[0].id));

    return fullRecord[0];
  }

  async findById(id: number): Promise<IOrganization | null> {
    const result = await db
      .select()
      .from(companies)
      .where(eq(companies.id, id));

    return result[0] || null;
  }

  async findByUserId(userId: number): Promise<IOrganization | null> {
    const result = await db
      .select()
      .from(companies)
      .where(eq(companies.userId, userId));

    return result[0] || null;
  }

  async update(
    id: number,
    company: Partial<IOrganization>
  ): Promise<IOrganization | null> {
    await db.update(companies).set(company).where(eq(companies.id, id));

    const result = await db
      .select()
      .from(companies)
      .where(eq(companies.id, id));

    return result[0];
  }
}

