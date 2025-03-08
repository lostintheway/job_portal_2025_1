import express from "express";
import BookmarkController from "../controllers/bookmark.controller.ts";
import { authenticate } from "../middleware/auth.ts";

const router: express.Router = express.Router();

// GET /api/bookmarks - Get all bookmarks
router.get("/", authenticate, BookmarkController.getAllBookmarksByUserId);

// GET /api/bookmarks/:bookmarkId - Get bookmark by ID
router.get("/:bookmarkId", authenticate, BookmarkController.getBookmarkById);

// POST /api/bookmarks - Create a new bookmark
router.post("/", authenticate, BookmarkController.createBookmark);

// DELETE /api/bookmarks/:bookmarkId - Delete a bookmark
router.delete("/:bookmarkId", authenticate, BookmarkController.deleteBookmark);

export default router;
