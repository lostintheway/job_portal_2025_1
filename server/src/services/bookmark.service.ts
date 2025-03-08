import type { BookmarkSelect } from "../db/schema";
import BookmarkModel from "../models/bookmark.model.ts";

class BookmarkService {
  static async getAllBookmarksByUserId(
    userId: number
  ): Promise<BookmarkSelect[]> {
    return BookmarkModel.getAllBookmarksByUserId(userId);
  }

  static async getBookmarkById(
    bookmarkId: number
  ): Promise<BookmarkSelect | undefined> {
    return BookmarkModel.getBookmarkById(bookmarkId);
  }
  // getBookmarksByUserId
  static async getBookmarksByUserId(userId: number): Promise<BookmarkSelect[]> {
    return BookmarkModel.getBookmarksByUserId(userId);
  }

  // isJobBookmarkedByUser
  static async isJobBookmarkedByUser(
    userId: number,
    jobId: number
  ): Promise<boolean> {
    return BookmarkModel.isJobBookmarkedByUser(userId, jobId);
  }

  // getBookmarksByJobId
  static async getBookmarksByJobId(jobId: number): Promise<BookmarkSelect[]> {
    return BookmarkModel.getBookmarksByJobId(jobId);
  }

  static async createBookmark(
    bookmarkData: Omit<
      BookmarkSelect,
      "bookmarkId" | "createdDate" | "updatedDate" | "deletedDate" | "isDeleted"
    >
  ): Promise<number> {
    return BookmarkModel.createBookmark(bookmarkData);
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
    return BookmarkModel.updateBookmark(bookmarkId, bookmarkData);
  }

  static async deleteBookmark(
    bookmarkId: number,
    deletedBy: number
  ): Promise<boolean> {
    return BookmarkModel.deleteBookmark(bookmarkId, deletedBy);
  }
}

export default BookmarkService;
