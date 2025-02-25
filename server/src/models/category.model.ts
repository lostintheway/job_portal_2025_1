import { eq } from "drizzle-orm";
import { categories } from "../db/schema";
import { db } from "../config/db";
import { CommonFields } from "../interfaces/CommonFields";

export interface Category extends CommonFields {
  categoryId: number;
  categoryName: string;
}

class CategoryModel {
  static async getAllCategories(): Promise<Category[]> {
    return db.select().from(categories).where(eq(categories.isDeleted, false));
  }

  static async getCategoryById(
    categoryId: number
  ): Promise<Category | undefined> {
    return db
      .select()
      .from(categories)
      .where(eq(categories.categoryId, categoryId))
      .where(eq(categories.isDeleted, false))
      .limit(1)
      .then((rows) => rows[0]);
  }

  static async createCategory(
    categoryData: Omit<
      Category,
      "categoryId" | "createdDate" | "updatedDate" | "deletedDate" | "isDeleted"
    >
  ): Promise<number> {
    const [result] = await db.insert(categories).values(categoryData);
    return result.insertId;
  }

  static async updateCategory(
    categoryId: number,
    categoryData: Partial<
      Omit<
        Category,
        | "categoryId"
        | "createdDate"
        | "updatedDate"
        | "deletedDate"
        | "isDeleted"
      >
    >
  ): Promise<boolean> {
    await db
      .update(categories)
      .set({ ...categoryData, updatedDate: new Date() })
      .where(eq(categories.categoryId, categoryId));
    return true;
  }

  static async deleteCategory(
    categoryId: number,
    deletedBy: number
  ): Promise<boolean> {
    await db
      .update(categories)
      .set({ isDeleted: true, deletedBy, deletedDate: new Date() })
      .where(eq(categories.categoryId, categoryId));
    return true;
  }
}

export default CategoryModel;
