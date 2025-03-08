import type { Request, Response } from "express";
import BookmarkService from "../services/bookmark.service.ts";
import ErrorMessage from "../models/errorMessage.model.ts";

class BookmarkController {
  static async getAllBookmarksByUserId(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const userId = req.user?.userId;
      console.log({ userId });
      if (!userId) {
        res.status(401).json(ErrorMessage.authRequired());
        return;
      }
      const bookmarks = await BookmarkService.getAllBookmarksByUserId(userId);
      res.status(200).json({ success: true, data: bookmarks });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  static async getBookmarkById(req: Request, res: Response): Promise<void> {
    try {
      const bookmarkId = parseInt(req.params.bookmarkId);
      const bookmark = await BookmarkService.getBookmarkById(bookmarkId);
      if (!bookmark) {
        res.status(404).json(ErrorMessage.notFound());
        return;
      }
      res.status(200).json({ success: true, data: bookmark });
    } catch (error) {
      res.status(500).json(ErrorMessage.serverError());
    }
  }

  static async getBookmarksByUserId(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json(ErrorMessage.authRequired());
        return;
      }
      const userId = req.user.userId;
      const bookmarks = await BookmarkService.getBookmarksByUserId(userId);
      res.status(200).json({ success: true, data: bookmarks });
    } catch (error) {
      res.status(500).json(ErrorMessage.serverError());
    }
  }

  static async createBookmark(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json(ErrorMessage.authRequired());
        return;
      }
      const bookmark = await BookmarkService.createBookmark(req.body);
      res.status(201).json({ success: true, data: bookmark });
    } catch (error) {
      res.status(500).json(ErrorMessage.serverError());
    }
  }

  static async deleteBookmark(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json(ErrorMessage.authRequired());
        return;
      }
      const bookmarkId = parseInt(req.params.bookmarkId);
      const bookmark = await BookmarkService.deleteBookmark(
        bookmarkId,
        req.user.userId
      );
      if (!bookmark) {
        res.status(404).json(ErrorMessage.notFound());
        return;
      }
      res.status(200).json({ success: true, data: bookmark });
    } catch (error) {
      res.status(500).json(ErrorMessage.serverError());
    }
  }
}

export default BookmarkController;
