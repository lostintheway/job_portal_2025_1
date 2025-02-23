import { Request, Response } from "express";
import BookmarkService from "../services/bookmark.service";

class BookmarkController {
  static async getAllBookmarks(req: Request, res: Response): Promise<void> {
    try {
      const bookmarks = await BookmarkService.getAllBookmarks();
      res.status(200).json(bookmarks);
    } catch (error) {
      res.status(500).json({ error: "Failed to get bookmarks" });
    }
  }

  static async getBookmarkById(req: Request, res: Response): Promise<void> {
    try {
      const bookmarkId = parseInt(req.params.bookmarkId);
      const bookmark = await BookmarkService.getBookmarkById(bookmarkId);

      if (!bookmark) {
        res.status(404).json({ error: "Bookmark not found" });
      }

      res.status(200).json(bookmark);
    } catch (error) {
      res.status(500).json({ error: "Failed to get bookmark" });
    }
  }

  static async createBookmark(req: Request, res: Response): Promise<void> {
    try {
      const bookmarkData = req.body;
      const newBookmark = await BookmarkService.createBookmark(bookmarkData);
      res.status(201).json(newBookmark);
    } catch (error) {
      res.status(500).json({ error: "Failed to create bookmark" });
    }
  }

  static async updateBookmark(req: Request, res: Response): Promise<void> {
    try {
      const bookmarkId = parseInt(req.params.bookmarkId);
      const bookmarkData = req.body;
      const updatedBookmark = await BookmarkService.updateBookmark(
        bookmarkId,
        bookmarkData
      );

      if (!updatedBookmark) {
        res.status(404).json({ error: "Bookmark not found" });
      }

      res.status(200).json(updatedBookmark);
    } catch (error) {
      res.status(500).json({ error: "Failed to update bookmark" });
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
        res.status(404).json({ error: "Bookmark not found" });
      }

      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete bookmark" });
    }
  }
}

export default BookmarkController;
