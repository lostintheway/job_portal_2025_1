import CategoryModel, { CategorySelect } from "../models/category.model";

class CategoryService {
  static async getAllCategories(): Promise<CategorySelect[]> {
    return CategoryModel.getAllCategories();
  }

  static async getCategoryById(
    categoryId: number
  ): Promise<CategorySelect | undefined> {
    return CategoryModel.getCategoryById(categoryId);
  }

  static async createCategory(
    categoryData: Omit<
      CategorySelect,
      "categoryId" | "createdDate" | "updatedDate" | "deletedDate" | "isDeleted"
    >
  ): Promise<number> {
    return CategoryModel.createCategory(categoryData);
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
    return CategoryModel.updateCategory(categoryId, categoryData);
  }

  static async deleteCategory(
    categoryId: number,
    deletedBy: number
  ): Promise<boolean> {
    return CategoryModel.deleteCategory(categoryId, deletedBy);
  }
}

export default CategoryService;
