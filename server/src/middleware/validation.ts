import { Request, Response, NextFunction } from "express";

export const validateRegistration = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password, fullName, role } = req.body;

  if (!email || !password || !fullName || !role) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  if (password.length < 6) {
    return res
      .status(400)
      .json({ message: "Password must be at least 6 characters" });
  }

  if (!["jobseeker", "company", "admin"].includes(role)) {
    return res.status(400).json({ message: "Invalid role" });
  }

  next();
};

export const validateJob = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { title, description, requirements, salary_range, location, job_type } =
    req.body;

  if (
    !title ||
    !description ||
    !requirements ||
    !salary_range ||
    !location ||
    !job_type
  ) {
    return res
      .status(400)
      .json({ message: "All required fields must be provided" });
  }

  if (
    !["full-time", "part-time", "contract", "internship"].includes(job_type)
  ) {
    return res.status(400).json({ message: "Invalid job type" });
  }

  next();
};
