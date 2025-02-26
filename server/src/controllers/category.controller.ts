import { Request, Response } from "express";
import CategoryService from "../services/category.service";
import ErrorMessage from "../models/errorMessage.model";

class CategoryController {
  static async getAllCategories(req: Request, res: Response): Promise<void> {
    try {
      const categories = await CategoryService.getAllCategories();
      res.status(200).json({ success: true, data: categories });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  static async getCategoryById(req: Request, res: Response): Promise<void> {
    try {
      const categoryId = parseInt(req.params.categoryId);
      const category = await CategoryService.getCategoryById(categoryId);
      if (!category) {
        res.status(404).json(ErrorMessage.notFound());
        return;
      }
      res.status(200).json({ success: true, data: category });
    } catch (error) {
      res.status(500).json(ErrorMessage.serverError());
    }
  }

  static async createCategory(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json(ErrorMessage.authRequired());
        return;
      }
      const category = await CategoryService.createCategory(req.body);
      res.status(201).json({ success: true, data: category });
    } catch (error) {
      res.status(500).json(ErrorMessage.serverError());
    }
  }

  static async updateCategory(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json(ErrorMessage.authRequired());
        return;
      }
      const categoryId = parseInt(req.params.categoryId);
      const category = await CategoryService.updateCategory(
        categoryId,
        req.body
      );
      if (!category) {
        res.status(404).json(ErrorMessage.notFound());
        return;
      }
      res.status(200).json({ success: true, data: category });
    } catch (error) {
      res.status(500).json(ErrorMessage.serverError());
    }
  }

  static async deleteCategory(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json(ErrorMessage.authRequired());
        return;
      }
      const categoryId = parseInt(req.params.categoryId);
      const category = await CategoryService.deleteCategory(
        categoryId,
        req.user.userId
      );
      if (!category) {
        res.status(404).json(ErrorMessage.notFound());
        return;
      }
      res.status(200).json({ success: true, data: category });
    } catch (error) {
      res.status(500).json(ErrorMessage.serverError());
    }
  }
}

export default CategoryController;
