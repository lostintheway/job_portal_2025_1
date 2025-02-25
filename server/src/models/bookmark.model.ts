import { eq, and } from "drizzle-orm";
import { db } from "../config/db";
import { bookmarks } from "../db/schema";
import { CommonFields } from "../interfaces/CommonFields";

export interface Bookmark extends CommonFields {
  bookmarkId: number;
  userId: number;
  jobId: number;
  notes?: string;
  reminderDate?: Date;
  status: "saved" | "applied" | "archived";
}

class BookmarkModel {
  static async getAllBookmarks(): Promise<Bookmark[]> {
    return db.select().from(bookmarks).where(eq(bookmarks.isDeleted, false));
  }

  static async getBookmarkById(
    bookmarkId: number
  ): Promise<Bookmark | undefined> {
    return db
      .select()
      .from(bookmarks)
      .where(eq(bookmarks.bookmarkId, bookmarkId))
      .where(eq(bookmarks.isDeleted, false))
      .limit(1)
      .then((rows) => rows[0]);
  }

  static async getBookmarksByUserId(userId: number): Promise<Bookmark[]> {
    return db
      .select()
      .from(bookmarks)
      .where(eq(bookmarks.userId, userId))
      .where(eq(bookmarks.isDeleted, false));
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
      Bookmark,
      "bookmarkId" | "createdDate" | "updatedDate" | "deletedDate" | "isDeleted"
    >
  ): Promise<number> {
    const [result] = await db.insert(bookmarks).values(bookmarkData);
    return result.insertId;
  }

  static async updateBookmark(
    bookmarkId: number,
    bookmarkData: Partial<
      Omit<
        Bookmark,
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

  static async deleteBookmark(
    bookmarkId: number,
    deletedBy: number
  ): Promise<boolean> {
    await db
      .update(bookmarks)
      .set({ isDeleted: true, deletedBy, deletedDate: new Date() })
      .where(eq(bookmarks.bookmarkId, bookmarkId));
    return true;
  }
}

export default BookmarkModel;
