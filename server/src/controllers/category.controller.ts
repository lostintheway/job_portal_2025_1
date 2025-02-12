import { Request, Response } from 'express';
import CategoryService from '../services/category.service';
import { Category } from '../models/category.model';

class CategoryController {
  static async getAllCategories(req: Request, res: Response): Promise<void> {
    try {
      const categories = await CategoryService.getAllCategories();
      res.json({ success: true, data: categories });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to fetch categories' });
    }
  }

  static async getCategoryById(req: Request, res: Response): Promise<void> {
    try {
      const categoryId = parseInt(req.params.categoryId);
      const category = await CategoryService.getCategoryById(categoryId);
      if (!category) {
        res.status(404).json({ success: false, error: 'Category not found' });
        return;
      }
      res.json({ success: true, data: category });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to fetch category' });
    }
  }

  static async createCategory(req: Request, res: Response): Promise<void> {
    try {
      const categoryData = req.body;
      const categoryId = await CategoryService.createCategory(categoryData);
      res.status(201).json({ success: true, data: { categoryId } });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to create category' });
    }
  }

  static async updateCategory(req: Request, res: Response): Promise<void> {
    try {
      const categoryId = parseInt(req.params.categoryId);
      const categoryData = req.body;
      const success = await CategoryService.updateCategory(categoryId, categoryData);
      if (!success) {
        res.status(404).json({ success: false, error: 'Category not found' });
        return;
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to update category' });
    }
  }

  static async deleteCategory(req: Request, res: Response): Promise<void> {
    try {
      const categoryId = parseInt(req.params.categoryId);
      const deletedBy = parseInt(req.body.deletedBy);
      const success = await CategoryService.deleteCategory(categoryId, deletedBy);
      if (!success) {
        res.status(404).json({ success: false, error: 'Category not found' });
        return;
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to delete category' });
    }
  }
}

export default CategoryController;
