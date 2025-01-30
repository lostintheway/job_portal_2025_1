import { desc, eq } from "drizzle-orm";
import { db } from "../config/db";
import { applications, users } from "../db/schema";
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
    const result = await db.select().from(applications);
    // .join(users, applications.userId, users.id)
    // .where(eq(applications.jobId, jobId))
    // .orderBy(applications.createdAt, desc);

    return result;
  }
}

// async findByUserId(userId: number): Promise<IApplication[]> {
//   const result = await db
//     .select()
//     .from(applications)
//     .join("jobs", "applications.job_id", "jobs.id")
//     .join("companies", "jobs.company_id", "companies.id")
//     .where(eq("applications.user_id", userId))
//     .orderBy("applications.created_at", "desc");

//   return result;
// }

// async updateStatus(id: number, status: string): Promise<IApplication | null> {
//   await db
//     .update(applications)
//     .set({ status })
//     .where(eq("applications.id, id));

//   const result = await db
//     .select()
//     .from(applications)
//     .where(eq("applications.id, id));

//   return result[0] || null;
// }
