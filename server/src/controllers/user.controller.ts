import { Request, Response } from "express";
import UserService from "../services/user.service";
import ErrorMessage from "../models/errorMessage.model";
import { UserSelect } from "../db/schema";

class UserController {
  static async getAllUsers(req: Request, res: Response): Promise<void> {
    try {
      const users = await UserService.getAllUsers();
      res.status(200).json({ success: true, data: users });
    } catch (error) {
      res.status(500).json(ErrorMessage.serverError());
    }
  }

  static async getUserById(req: Request, res: Response): Promise<void> {
    try {
      const userId = parseInt(req.params.userId);
      const user = await UserService.getUserById(userId);
      if (!user) {
        res.status(404).json(ErrorMessage.notFound());
        return;
      }
      res.status(200).json({ success: true, data: user });
    } catch (error) {
      res.status(500).json(ErrorMessage.serverError());
    }
  }

  static async getUserByEmail(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.params;
      const user = await UserService.getUserByEmail(email);
      if (!user) {
        res.status(404).json(ErrorMessage.notFound());
        return;
      }
      res.status(200).json({ success: true, data: user });
    } catch (error) {
      res.status(500).json(ErrorMessage.serverError());
    }
  }

  static async createUser(req: Request, res: Response): Promise<void> {
    try {
      const userData: UserSelect = req.body;
      const userId = await UserService.createUser(userData);
      res.status(201).json({ success: true, data: { userId } });
    } catch (error) {
      res.status(500).json(ErrorMessage.serverError());
    }
  }

  static async updateUser(req: Request, res: Response): Promise<void> {
    try {
      const userId = parseInt(req.params.userId);
      const userData: UserSelect = req.body;
      const success = await UserService.updateUser(userId, userData);
      if (!success) {
        res.status(404).json(ErrorMessage.notFound());
        return;
      }
      res.status(200).json({ success: true, message: "User updated successfully" });
    } catch (error) {
      res.status(500).json(ErrorMessage.serverError());
    }
  }
}

export default UserController;