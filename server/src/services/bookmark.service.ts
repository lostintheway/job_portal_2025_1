import BookmarkModel, { Bookmark } from "../models/bookmark.model";

class BookmarkService {
  static async getAllBookmarks(): Promise<Bookmark[]> {
    return BookmarkModel.getAllBookmarks();
  }

  static async getBookmarkById(
    bookmarkId: number
  ): Promise<Bookmark | undefined> {
    return BookmarkModel.getBookmarkById(bookmarkId);
  }

  static async createBookmark(
    bookmarkData: Omit<
      Bookmark,
      "bookmarkId" | "createdDate" | "updatedDate" | "deletedDate" | "isDeleted"
    >
  ): Promise<number> {
    return BookmarkModel.createBookmark(bookmarkData);
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
