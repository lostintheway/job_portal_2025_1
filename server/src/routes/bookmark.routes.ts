import express from "express";
import BookmarkController from "../controllers/bookmark.controller.ts";
import { authenticate } from "../middleware/auth.ts";

const router: express.Router = express.Router();

// GET /api/bookmarks - Get all bookmarks
router.get("/", authenticate, BookmarkController.getAllBookmarksByUserId);

// GET /api/bookmarks/:bookmarkId - Get bookmark by ID
router.get("/:bookmarkId", authenticate, BookmarkController.getBookmarkById);

// POST /api/bookmarks/:jobId - Add a bookmark
router.post("/:jobId", authenticate, BookmarkController.createBookmark);

// DELETE /api/bookmarks/:jobId - Remove a bookmark
router.delete("/:jobId", authenticate, BookmarkController.deleteBookmark);

export default router;
