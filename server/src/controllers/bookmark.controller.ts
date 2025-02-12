import { Request, Response } from "express";
import BookmarkService from "../services/bookmark.service";

class BookmarkController {
  static async getAllBookmarks(req: Request, res: Response) {
    try {
      const bookmarks = await BookmarkService.getAllBookmarks();
      return res.status(200).json(bookmarks);
    } catch (error) {
      return res.status(500).json({ error: "Failed to get bookmarks" });
    }
  }

  static async getBookmarkById(req: Request, res: Response) {
    try {
      const bookmarkId = parseInt(req.params.bookmarkId);
      const bookmark = await BookmarkService.getBookmarkById(bookmarkId);

      if (!bookmark) {
        return res.status(404).json({ error: "Bookmark not found" });
      }

      return res.status(200).json(bookmark);
    } catch (error) {
      return res.status(500).json({ error: "Failed to get bookmark" });
    }
  }

  static async createBookmark(req: Request, res: Response) {
    try {
      const bookmarkData = req.body;
      const newBookmark = await BookmarkService.createBookmark(bookmarkData);
      return res.status(201).json(newBookmark);
    } catch (error) {
      return res.status(500).json({ error: "Failed to create bookmark" });
    }
  }

  static async updateBookmark(req: Request, res: Response) {
    try {
      const bookmarkId = parseInt(req.params.bookmarkId);
      const bookmarkData = req.body;
      const updatedBookmark = await BookmarkService.updateBookmark(
        bookmarkId,
        bookmarkData
      );

      if (!updatedBookmark) {
        return res.status(404).json({ error: "Bookmark not found" });
      }

      return res.status(200).json(updatedBookmark);
    } catch (error) {
      return res.status(500).json({ error: "Failed to update bookmark" });
    }
  }

  static async deleteBookmark(req: Request, res: Response) {
    try {
      const bookmarkId = parseInt(req.params.bookmarkId);
      const success = await BookmarkService.deleteBookmark(
        bookmarkId,
        req.body.deletedBy
      );

      if (!success) {
        return res.status(404).json({ error: "Bookmark not found" });
      }

      return res.status(204).send();
    } catch (error) {
      return res.status(500).json({ error: "Failed to delete bookmark" });
    }
  }
}

export default BookmarkController;
