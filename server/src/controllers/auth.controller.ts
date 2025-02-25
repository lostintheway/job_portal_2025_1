import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { db } from "../config/db";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";

class AuthController {
  static async register(req: Request, res: Response): Promise<void> {
    try {
      const { email, password, fullName, contactNumber, address, role } =
        req.body;

      // Check if user already exists
      const existingUser = await db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1)
        .then((rows) => rows[0]);

      if (existingUser) {
        res
          .status(400)
          .json({ success: false, message: "Email already in use" });
        return;
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create user
      const [result] = await db.insert(users).values({
        email,
        password: hashedPassword,
        fullName,
        contactNumber,
        address,
        role,
        createdBy: 0, // System created
        isDeleted: false,
      });

      const userId = result.insertId;

      // Generate JWT token
      const token = jwt.sign(
        { userId },
        process.env.JWT_SECRET || "your-secret-key",
        { expiresIn: "1d" }
      );

      res.status(201).json({
        success: true,
        message: "User registered successfully",
        data: { userId, token },
      });
    } catch (error) {
      res.status(500).json({ success: false, message: "Registration failed" });
    }
  }

  static async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      // Find user by email
      const user = await db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .where(eq(users.isDeleted, false))
        .limit(1)
        .then((rows) => rows[0]);

      if (!user) {
        res
          .status(401)
          .json({ success: false, message: "Invalid credentials" });
        return;
      }

      // Check password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        res
          .status(401)
          .json({ success: false, message: "Invalid credentials" });
        return;
      }

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.userId },
        process.env.JWT_SECRET || "your-secret-key",
        { expiresIn: "1d" }
      );

      res.status(200).json({
        success: true,
        message: "Login successful",
        data: {
          userId: user.userId,
          email: user.email,
          fullName: user.fullName,
          role: user.role,
          token,
        },
      });
    } catch (error) {
      res.status(500).json({ success: false, message: "Login failed" });
    }
  }

  static async getCurrentUser(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res
          .status(401)
          .json({ success: false, message: "Authentication required" });
        return;
      }

      // Remove password from user object
      const { password, ...userWithoutPassword } = req.user;

      res.status(200).json({
        success: true,
        data: userWithoutPassword,
      });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: "Failed to get user profile" });
    }
  }
}

export default AuthController;
