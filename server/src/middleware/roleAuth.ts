import { Request, Response, NextFunction } from "express";
import { UserSelect } from "../db/schema";

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: UserSelect;
    }
  }
}

// Middleware to check if user is authenticated
export const isAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user) {
    res
      .status(401)
      .json({ success: false, message: "Authentication required" });
    return;
  }
  next();
};

// Middleware to check if user is an admin
export const isAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user || req.user.role !== "admin") {
    res.status(403).json({ success: false, message: "Admin access required" });
    return;
  }
  next();
};

// Middleware to check if user is a jobseeker
export const isJobSeeker = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user || req.user.role !== "jobseeker") {
    res
      .status(403)
      .json({ success: false, message: "Jobseeker access required" });
    return;
  }
  next();
};

// Middleware to check if user is an employer
export const isEmployer = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user || req.user.role !== "employer") {
    res
      .status(403)
      .json({ success: false, message: "Employer access required" });
    return;
  }
  next();
};

// Middleware to check if user is either an admin or an employer
export const isAdminOrEmployer = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (
    !req.user ||
    (req.user.role !== "admin" && req.user.role !== "employer")
  ) {
    res
      .status(403)
      .json({ success: false, message: "Admin or employer access required" });
    return;
  }
  next();
};

// Middleware to check if user is either an admin or the owner of the resource
export const isAdminOrOwner = (resourceUserId: string) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res
        .status(401)
        .json({ success: false, message: "Authentication required" });
      return;
    }

    const userId = parseInt(resourceUserId);

    if (req.user.role === "admin" || req.user.userId === userId) {
      next();
    } else {
      res.status(403).json({ success: false, message: "Access denied" });
    }
  };
};
