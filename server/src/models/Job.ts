import { desc, eq } from "drizzle-orm";
import { db } from "../config/db";
import { jobs } from "../db/schema";
import { IJob } from "../interfaces/IJob";

export class Job {
  create(job: IJob): Promise<IJob> {
    const result = db.insert(jobs).values(job).$returningId();
    const fullRecord = db.select().from(jobs).where(eq(jobs.id, result[0].id));
    return fullRecord[0];
  }

  async findAll(
    page: number = 1,
    limit: number = 10
  ): Promise<{ jobs: IJob[]; total: number }> {
    const count = await db.$count(jobs);
    const jobsResult = await db
      .select()
      .from(jobs)
      .where(eq(jobs.status, "active"))
      .orderBy(desc(jobs.createdAt))
      .limit(limit)
      .offset((page - 1) * limit);
    return {
      jobs: jobsResult,
      total: count,
    };
  }

  findById(id: number): Promise<IJob | null> {
    const result = db.select().from(jobs).where(eq(jobs.id, id));
    return result[0] || null;
  }

  update(id: number, job: Partial<IJob>): Promise<IJob | null> {
    db.update(jobs).set(job).where(eq(jobs.id, id));
    const result = db.select().from(jobs).where(eq(jobs.id, id));
    return result[0] || null;
  }
}
