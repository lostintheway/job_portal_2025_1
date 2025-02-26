import { Request, Response } from "express";
import BookmarkModel from "../models/bookmark.model";

class BookmarkController {
  static async getMyBookmarks(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res
          .status(401)
          .json({ success: false, error: "Authentication required" });
        return;
      }

      const bookmarks = await BookmarkModel.getBookmarksByUserId(
        req.user.userId
      );
      res.status(200).json({ success: true, data: bookmarks });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, error: "Failed to get bookmarks" });
    }
  }

  static async createBookmark(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res
          .status(401)
          .json({ success: false, error: "Authentication required" });
        return;
      }

      const bookmarkData = {
        ...req.body,
        userId: req.user.userId,
        createdBy: req.user.userId,
      };

      const bookmarkId = await BookmarkModel.createBookmark(bookmarkData);
      res.status(201).json({ success: true, data: { bookmarkId } });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, error: "Failed to create bookmark" });
    }
  }

  static async updateBookmark(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res
          .status(401)
          .json({ success: false, error: "Authentication required" });
        return;
      }

      const bookmarkId = parseInt(req.params.bookmarkId);
      const bookmark = await BookmarkModel.getBookmarkById(bookmarkId);

      if (!bookmark) {
        res.status(404).json({ success: false, error: "Bookmark not found" });
        return;
      }

      if (bookmark.userId !== req.user.userId && req.user.role !== "admin") {
        res.status(403).json({ success: false, error: "Access denied" });
        return;
      }

      const bookmarkData = {
        ...req.body,
        updatedBy: req.user.userId,
      };

      await BookmarkModel.updateBookmark(bookmarkId, bookmarkData);
      res
        .status(200)
        .json({ success: true, message: "Bookmark updated successfully" });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, error: "Failed to update bookmark" });
    }
  }

  static async deleteBookmark(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res
          .status(401)
          .json({ success: false, error: "Authentication required" });
        return;
      }

      const bookmarkId = parseInt(req.params.bookmarkId);
      const bookmark = await BookmarkModel.getBookmarkById(bookmarkId);

      if (!bookmark) {
        res.status(404).json({ success: false, error: "Bookmark not found" });
        return;
      }

      if (bookmark.userId !== req.user.userId && req.user.role !== "admin") {
        res.status(403).json({ success: false, error: "Access denied" });
        return;
      }

      await BookmarkModel.deleteBookmark(bookmarkId, req.user.userId);
      res
        .status(200)
        .json({ success: true, message: "Bookmark deleted successfully" });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, error: "Failed to delete bookmark" });
    }
  }
}

export default BookmarkController;
