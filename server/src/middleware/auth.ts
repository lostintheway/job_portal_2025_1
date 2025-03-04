import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { db } from "../config/db.ts";
import { users } from "../db/schema.ts";
import { eq } from "drizzle-orm";

interface JwtPayload {
  userId: number;
  role: string;
}

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res
        .status(401)
        .json({ success: false, message: "Authentication required" });
      return;
    }

    const token = authHeader.split(" ")[1];

    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "mysecret_for_testing_dshajkdsadhsajkd"
    ) as JwtPayload;

    // Get user from database
    const user = await db
      .select()
      .from(users)
      .where(eq(users.userId, decoded.userId))
      .limit(1)
      .then((rows) => rows[0]);

    if (!user) {
      res
        .status(401)
        .json({ success: false, message: "User not found or deactivated" });
      return;
    }

    // Attach user to request object without password
    const { password, ...userWithoutPassword } = user;
    (req as any).user = userWithoutPassword;
    next();
  } catch (error) {
    res
      .status(401)
      .json({ success: false, message: "Invalid or expired token" });
  }
};

export const authorizeEmployer = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (req.user?.role !== "employer") {
    res.status(403).json({ message: "Access denied" });
    return;
  }
  next();
};
