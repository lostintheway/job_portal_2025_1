import type { Request, Response } from "express";
import UserService from "../services/user.service.ts";
import ErrorMessage from "../models/errorMessage.model.ts";
import type { UserSelect } from "../db/schema";
import jwt from "jsonwebtoken";

class UserController {
  //login
  static async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password: myPassword } = req.body;
      const user = await UserService.getUserByEmail(email);

      if (!user) {
        res.status(401).json(ErrorMessage.authFailed());
        return;
      }

      // Check if the password matches
      const isMatch = myPassword === user.password;
      if (!isMatch) {
        res.status(401).json(ErrorMessage.authFailed());
        return;
      }

      // Generate JWT token with user data
      const token = jwt.sign(
        {
          userId: user.userId,
          userType: user.role,
        },
        process.env.JWT_SECRET || "mysecret_for_testing_dshajkdsadhsajkd",
        { expiresIn: "24h" }
      );
      const { password, ...userWithoutPassword } = user;

      res.status(200).json({
        success: true,
        data: {
          user: userWithoutPassword,
          token,
        },
      });
    } catch (error: unknown) {
      console.error("Login Error:", error);
      res
        .status(500)
        .json(
          error instanceof Error ? error.message : ErrorMessage.serverError()
        );
    }
  }

  // get my prfile
  static async getMyProfile(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json(ErrorMessage.authRequired());
        return;
      }
      const userId = req.user.userId;
      const user = await UserService.getUserById(userId);
      if (!user) {
        res.status(404).json(ErrorMessage.notFound());
        return;
      }
      //       // Remove the password field from the user object
      const { password, ...userWithoutPassword } = user;
      res.status(200).json({ success: true, data: userWithoutPassword });
      res.status(200).json({ success: true, data: user });
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
      // Remove the password field from the user object
      const { password, ...userWithoutPassword } = user;
      res.status(200).json({ success: true, data: userWithoutPassword });
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
      // Remove the password field from the user object
      const { password, ...userWithoutPassword } = user;
      res.status(200).json({ success: true, data: userWithoutPassword });
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
      res
        .status(500)
        .json(
          error instanceof Error ? error.message : ErrorMessage.serverError()
        );
    }
  }

  static async updateUser(req: Request, res: Response): Promise<void> {
    try {
      // only allow update my profile
      const userId = req.user?.userId;
      const userData: UserSelect = req.body;
      if (userId !== userData.userId) {
        res.status(403).json(ErrorMessage.forbidden());
        return;
      }
      const success = await UserService.updateUser(userId, userData);
      if (!success) {
        res.status(404).json(ErrorMessage.notFound());
        return;
      }
      res
        .status(200)
        .json({ success: true, message: "User updated successfully" });
    } catch (error) {
      res.status(500).json(ErrorMessage.serverError());
    }
  }
}

export default UserController;
