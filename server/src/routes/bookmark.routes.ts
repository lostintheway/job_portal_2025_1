import express from "express";
import BookmarkController from "../controllers/bookmark.controller";

const router = express.Router();

// GET /api/bookmarks - Get all bookmarks
router.get("bookmark/", BookmarkController.getAllBookmarks);

// GET /api/bookmarks/:bookmarkId - Get bookmark by ID
router.get("bookmark/:bookmarkId", BookmarkController.getBookmarkById);

// POST /api/bookmarks - Create a new bookmark
router.post("bookmark/", BookmarkController.createBookmark);

// PUT /api/bookmarks/:bookmarkId - Update a bookmark
router.put("bookmark/:bookmarkId", BookmarkController.updateBookmark);

// DELETE /api/bookmarks/:bookmarkId - Delete a bookmark
router.delete("bookmark/:bookmarkId", BookmarkController.deleteBookmark);

export default router;
