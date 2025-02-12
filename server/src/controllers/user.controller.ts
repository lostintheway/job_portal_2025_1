import { Request, Response } from 'express';
import UserService from '../services/user.service';
import { User } from '../models/user.model';

class UserController {
  static async getAllUsers(req: Request, res: Response): Promise<void> {
    try {
      const users = await UserService.getAllUsers();
      res.json({ success: true, data: users });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to fetch users' });
    }
  }

  static async getUserById(req: Request, res: Response): Promise<void> {
    try {
      const userId = parseInt(req.params.userId);
      const user = await UserService.getUserById(userId);
      if (!user) {
        res.status(404).json({ success: false, error: 'User not found' });
        return;
      }
      res.json({ success: true, data: user });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to fetch user' });
    }
  }

  static async createUser(req: Request, res: Response): Promise<void> {
    try {
      const userData = req.body;
      const userId = await UserService.createUser(userData);
      res.status(201).json({ success: true, data: { userId } });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to create user' });
    }
  }

  static async updateUser(req: Request, res: Response): Promise<void> {
    try {
      const userId = parseInt(req.params.userId);
      const userData = req.body;
      const success = await UserService.updateUser(userId, userData);
      if (!success) {
        res.status(404).json({ success: false, error: 'User not found' });
        return;
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to update user' });
    }
  }

  static async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      const userId = parseInt(req.params.userId);
      const deletedBy = parseInt(req.body.deletedBy); // Assuming deletedBy is passed in request body
      const success = await UserService.deleteUser(userId, deletedBy);
      if (!success) {
        res.status(404).json({ success: false, error: 'User not found' });
        return;
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to delete user' });
    }
  }
}

export default UserController;
