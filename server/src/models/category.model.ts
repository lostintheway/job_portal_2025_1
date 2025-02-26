import { and, eq } from "drizzle-orm";
import { categories, CategorySelect } from "../db/schema";
import { db } from "../config/db";
import { CommonFields } from "../interfaces/CommonFields";

class CategoryModel {
  static async getAllCategories(): Promise<CategorySelect[]> {
    return db.select().from(categories).where(eq(categories.isDeleted, false));
  }

  static async getCategoryById(
    categoryId: number
  ): Promise<CategorySelect | undefined> {
    return db
      .select()
      .from(categories)
      .where(
        and(
          eq(categories.categoryId, categoryId),
          eq(categories.isDeleted, false)
        )
      )
      .limit(1)
      .then((rows) => rows[0]);
  }

  static async createCategory(
    categoryData: Omit<
      CategorySelect,
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
        CategorySelect,
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
