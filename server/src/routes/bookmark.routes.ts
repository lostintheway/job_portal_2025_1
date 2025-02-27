import express from "express";
import BookmarkController from "../controllers/bookmark.controller.ts";

const router: express.Router = express.Router();

// GET /api/bookmarks - Get all bookmarks
router.get("/", BookmarkController.getAllBookmarks);

// GET /api/bookmarks/:bookmarkId - Get bookmark by ID
router.get("/:bookmarkId", BookmarkController.getBookmarkById);

// POST /api/bookmarks - Create a new bookmark
router.post("/", BookmarkController.createBookmark);

// DELETE /api/bookmarks/:bookmarkId - Delete a bookmark
router.delete("/:bookmarkId", BookmarkController.deleteBookmark);

export default router;
