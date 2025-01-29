import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../config/db";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import * as z from "zod";

export const register = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  // Validate user input
  const registerSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Email is invalid").min(1, "Email is required"),
    password: z.string().min(8, "Password must be at least 8 characters"),
  });

  const result = registerSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).send(result.error.issues);
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await db.execute<ResultSetHeader>(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, hashedPassword]
    );

    if (result.affectedRows === 1) {
      res.status(201).send("User created successfully");
    } else {
      res.status(500).send("Failed to create user");
    }
  } catch (error: unknown) {
    if (error instanceof Error && error.message.includes("ER_DUP_ENTRY")) {
      res.status(409).send("Email already exists");
    } else {
      console.error("Error registering user:", error);
      res.status(500).send("Error registering user");
    }
  }
};

interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  created_at: Date;
}

interface User extends RowDataPacket {
  id: number;
  name: string;
  email: string;
  password: string;
  created_at: Date;
}

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // Validate user input same as above
  const loginSchema = z.object({
    email: z.string().email("Email is invalid").min(1, "Email is required"),
    password: z.string().min(8, "Password must be at least 8 characters"),
  });

  const result = loginSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).send(result.error.issues);
  }

  try {
    const [rows] = await db.execute<User[]>(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );
    if (rows.length === 0) return res.status(400).send("User not found");

    const user = rows[0];
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).send("Invalid credentials");

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string, {
      expiresIn: "1h",
    });
    res.json({ token });
  } catch (error) {
    res.status(500).send("Error logging in");
  }
};
