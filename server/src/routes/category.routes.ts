import express from "express";
import CategoryController from "../controllers/category.controller";

const router = express.Router();

// GET /api/categories - Get all categories
router.get("/", CategoryController.getAllCategories);

// GET /api/categories/:categoryId - Get category by ID
router.get("/:categoryId", CategoryController.getCategoryById);

// POST /api/categories - Create a new category
router.post("/", CategoryController.createCategory);

// PUT /api/categories/:categoryId - Update a category
router.put("/:categoryId", CategoryController.updateCategory);

// DELETE /api/categories/:categoryId - Delete a category
router.delete("/:categoryId", CategoryController.deleteCategory);

export default router;
