import { eq, and } from "drizzle-orm";
import { db } from "../config/db.ts";
import { bookmarks, jobListings, type BookmarkSelect } from "../db/schema.ts";

class BookmarkModel {
  static async getAllBookmarksByUserId(userId: number): Promise<
    {
      bookmarkId: number;
      jobId: number;
      jobTitle: string | null;
      jobLocation: string | null;
      jobType: string | null;
      jobDescription: string | null;
      jobSalary: string | null;
    }[]
  > {
    return db
      .select({
        bookmarkId: bookmarks.bookmarkId,
        jobId: bookmarks.jobId,
        jobTitle: jobListings.title,
        jobLocation: jobListings.jobLocation,
        jobType: jobListings.jobType,
        jobDescription: jobListings.jobDescription,
        jobSalary: jobListings.offeredSalary,
      })
      .from(bookmarks)
      .leftJoin(jobListings, eq(bookmarks.jobId, jobListings.jobId))
      .where(and(eq(bookmarks.userId, userId), eq(bookmarks.isDeleted, false)));
  }

  static async getBookmarkById(
    bookmarkId: number
  ): Promise<BookmarkSelect | undefined> {
    return db
      .select()
      .from(bookmarks)
      .where(
        and(
          eq(bookmarks.bookmarkId, bookmarkId),
          eq(bookmarks.isDeleted, false)
        )
      )
      .limit(1)
      .then((rows) => rows[0]);
  }

  static async getBookmarksByUserId(userId: number): Promise<BookmarkSelect[]> {
    return db
      .select()
      .from(bookmarks)
      .where(and(eq(bookmarks.userId, userId), eq(bookmarks.isDeleted, false)));
  }

  // getBookmarksByJobId
  static async getBookmarksByJobId(jobId: number): Promise<BookmarkSelect[]> {
    return db
      .select()
      .from(bookmarks)
      .where(and(eq(bookmarks.jobId, jobId), eq(bookmarks.isDeleted, false)));
  }

  static async isJobBookmarkedByUser(
    userId: number,
    jobId: number
  ): Promise<boolean> {
    const bookmark = await db
      .select()
      .from(bookmarks)
      .where(
        and(
          eq(bookmarks.userId, userId),
          eq(bookmarks.jobId, jobId),
          eq(bookmarks.isDeleted, false)
        )
      )
      .limit(1)
      .then((rows) => rows[0]);

    return !!bookmark;
  }

  static async createBookmark(
    bookmarkData: Omit<
      BookmarkSelect,
      "bookmarkId" | "createdDate" | "updatedDate" | "deletedDate" | "isDeleted"
    >
  ): Promise<number> {
    const [result] = await db.insert(bookmarks).values({
      ...bookmarkData,
      createdDate: new Date(),
      isDeleted: false,
    });
    return result.insertId;
  }

  static async updateBookmark(
    bookmarkId: number,
    bookmarkData: Partial<
      Omit<
        BookmarkSelect,
        | "bookmarkId"
        | "createdDate"
        | "updatedDate"
        | "deletedDate"
        | "isDeleted"
      >
    >
  ): Promise<boolean> {
    await db
      .update(bookmarks)
      .set({ ...bookmarkData, updatedDate: new Date() })
      .where(eq(bookmarks.bookmarkId, bookmarkId));
    return true;
  }

  static async deleteBookmark(jobId: number, userId: number): Promise<boolean> {
    await db
      .update(bookmarks)
      .set({
        isDeleted: true,
        deletedDate: new Date(),
      })
      .where(
        and(
          eq(bookmarks.userId, userId),
          eq(bookmarks.jobId, jobId),
          eq(bookmarks.isDeleted, false)
        )
      );
    return true;
  }
}

export default BookmarkModel;
