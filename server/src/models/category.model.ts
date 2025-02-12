import { eq } from "drizzle-orm";
import { categories } from "../db/schema";
import { db } from "../config/db";

export interface Category {
  categoryId: number;
  categoryName: string;
  createdBy: number;
  createdDate: Date;
  updatedBy?: number;
  updatedDate?: Date;
  deletedBy?: number;
  deletedDate?: Date;
  isDeleted: boolean;
}

class CategoryModel {
  static async getAllCategories(): Promise<Category[]> {
    const result: any = db.select().from(categories);
    return result;
  }

  static async getCategoryById(
    categoryId: number
  ): Promise<Category | undefined> {
    const result: any = db
      .select()
      .from(categories)
      .where(eq(categories.categoryId, categoryId))
      .limit(1)
      .then((rows) => rows[0]);
    return result;
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
      .set(categoryData)
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
