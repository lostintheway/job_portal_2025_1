import { Request, Response } from "express";
import { AuthService } from "../services/AuthService";

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  register = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = await this.authService.register(req.body);
      res.status(201).json(user);
    } catch (error: unknown) {
      res.status(400).json({
        message: error instanceof Error ? error.message : "Unknown Error",
      });
    }
  };

  login = async (req: Request, res: Response): Promise<void> => {
    try {
      const { token, user } = await this.authService.login(req.body);
      res.status(200).json({ token, user });
    } catch (error) {
      res
        .status(401)
        .json({
          message: error instanceof Error ? error.message : "Unknown Error",
        });
    }
  };
}
