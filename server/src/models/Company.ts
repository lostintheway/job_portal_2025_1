import { eq } from "drizzle-orm";
import { db } from "../config/db";
import { companies } from "../db/schema";
import { ICompany } from "../interfaces/ICompany";

export class Company {
  // private tableName = "companies";

  async create(company: ICompany): Promise<ICompany> {
    const result = await db.insert(companies).values(company).$returningId();
    const fullRecord = await db
      .select()
      .from(companies)
      .where(eq(companies.id, result[0].id));

    return fullRecord[0];
  }

  async findById(id: number): Promise<ICompany | null> {
    const result = await db
      .select()
      .from(companies)
      .where(eq(companies.id, id));

    return result[0] || null;
  }

  async findByUserId(userId: number): Promise<ICompany | null> {
    const result = await db
      .select()
      .from(companies)
      .where(eq(companies.userId, userId));

    return result[0] || null;
  }

  async update(
    id: number,
    company: Partial<ICompany>
  ): Promise<ICompany | null> {
    await db.update(companies).set(company).where(eq(companies.id, id));

    const result = await db
      .select()
      .from(companies)
      .where(eq(companies.id, id));

    return result[0];
  }
}

// await db.select().from(companies);
// }

// Update
// async update(id: number, company: ICompany): Promise<ICompany> {
//   await db.update(companies)
//     .set(company)
//     .where(eq(companies.id, id));

//   const result = await db.select()
//     .from(companies)
//     .where(eq(companies.id, id));

//   return result[0];
// }

// // Delete
// async delete(id: number): Promise<void> {
//   await db.delete(companies)
//     .where(eq(companies.id, id));
// }
