import { desc, eq } from "drizzle-orm";
import { db } from "../config/db";
import { applications, companies, jobs, users } from "../db/schema";
import { IApplication } from "../interfaces/IApplication";

export class Application {
  async create(application: IApplication): Promise<IApplication> {
    const result = await db
      .insert(applications)
      .values(application)
      .$returningId();
    const fullRecord = await db
      .select()
      .from(applications)
      .where(eq(applications.id, result[0].id));

    return fullRecord[0];
  }

  async findByJobId(jobId: number): Promise<IApplication[]> {
    const result = await db
      .select()
      .from(applications)
      // .innerJoin(users, applications.userId, users.id)
      .where(eq(applications.jobId, jobId))
      .orderBy(desc(applications.createdAt));

    return result;
  }
  async updateStatus(
    id: number,
    status: "pending" | "reviewed" | "shortlisted" | "rejected" | "accepted"
  ): Promise<IApplication | null> {
    await db
      .update(applications)
      .set({ status })
      .where(eq(applications.id, id));

    const result = await db
      .select()
      .from(applications)
      .where(eq(applications.id, id));

    return result[0] || null;
  }
  async findByUserId(userId: number): Promise<IApplication[]> {
    const result = await db
      .select()
      .from(applications)
      // .innerJoin(jobs, eq(applications.jobId, jobs.id))
      // .innerJoin(companies, eq(jobs.companyId, companies.id))
      .where(eq(applications.userId, userId))
      .orderBy(desc(applications.createdAt));
    return result;
  }
}
