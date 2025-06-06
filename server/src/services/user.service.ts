import type { UserSelect } from "../db/schema";
import UserModel from "../models/user.model.ts";

class UserService {
  static async getUserByEmail(email: string): Promise<UserSelect | undefined> {
    return UserModel.getUserByEmail(email);
  }

  static async getUserById(userId: number): Promise<UserSelect | undefined> {
    return UserModel.getUserById(userId);
  }

  static async createUser(userData: UserSelect): Promise<number> {
    return UserModel.createUser(userData);
  }

  static async updateUser(
    userId: number,
    userData: UserSelect
  ): Promise<boolean> {
    return UserModel.updateUser(userId, userData);
  }

  static async getAllUsers(): Promise<UserSelect[]> {
    return UserModel.getAllUsers();
  }
}

export default UserService;
