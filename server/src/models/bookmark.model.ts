import { eq } from "drizzle-orm";
import { db } from "../config/db";
import { bookmarks } from "../db/schema";
import { CommonFields } from "../interfaces/CommonFields";

export interface Bookmark extends CommonFields {
  bookmarkId: number;
  userId: number;
  jobDescriptionId: number;
  notes?: string;
  reminderDate?: Date;
  status: "saved" | "applied" | "archived";
}

class BookmarkModel {
  static async getAllBookmarks(): Promise<Bookmark[]> {
    const result: any = db.select().from(bookmarks);
    return result;
  }

  static async getBookmarkById(
    bookmarkId: number
  ): Promise<Bookmark | undefined> {
    const result: any = db
      .select()
      .from(bookmarks)
      .where(eq(bookmarks.bookmarkId, bookmarkId))
      .limit(1)
      .then((rows) => rows[0]);
    return result;
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
      .set(bookmarkData)
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
