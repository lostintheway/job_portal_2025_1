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
      const jobId = parseInt(req.params.jobId);
      const userId = req.user.userId;

      // Check if bookmark already exists
      const exists = await BookmarkService.isJobBookmarkedByUser(userId, jobId);
      if (exists) {
        res
          .status(400)
          .json({ success: false, message: "Job already bookmarked" });
        return;
      }

      const bookmark = await BookmarkService.createBookmark({
        jobId,
        userId,
        createdBy: userId,
        status: "saved",
        notes: null,
        reminderDate: null,
        updatedBy: null,
        deletedBy: null,
      });
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
      const jobId = parseInt(req.params.jobId);
      const userId = req.user.userId;

      const success = await BookmarkService.deleteBookmark(jobId, userId);
      if (!success) {
        res.status(404).json(ErrorMessage.notFound());
        return;
      }
      res.status(200).json({ success: true });
    } catch (error) {
      res.status(500).json(ErrorMessage.serverError());
    }
  }
}

export default BookmarkController;
