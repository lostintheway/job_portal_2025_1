import UserModel, { User } from "../models/user.model";

class UserService {
  static async getAllUsers(): Promise<User[]> {
    return UserModel.getAllUsers();
  }

  static async getUserById(userId: number): Promise<User | undefined> {
    return UserModel.getUserById(userId);
  }

  static async createUser(
    userData: Omit<
      User,
      "userId" | "createdDate" | "updatedDate" | "deletedDate" | "isDeleted"
    >
  ): Promise<number> {
    return UserModel.createUser(userData);
  }

  static async updateUser(
    userId: number,
    userData: Partial<
      Omit<
        User,
        "userId" | "createdDate" | "updatedDate" | "deletedDate" | "isDeleted"
      >
    >
  ): Promise<boolean> {
    return UserModel.updateUser(userId, userData);
  }

  static async deleteUser(userId: number, deletedBy: number): Promise<boolean> {
    return UserModel.deleteUser(userId, deletedBy);
  }
}

export default UserService;
