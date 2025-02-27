import express from "express";
import { authenticate } from "../middleware/auth.ts";
import { isAdmin, isAdminOrOwner } from "../middleware/roleAuth.ts";
import UserController from "../controllers/user.controller.ts";

const router = express.Router();

// Public routes
router.post("/register", UserController.createUser);
router.post("/login", UserController.login);

// Protected routes
router.get("/profile", authenticate, UserController.getMyProfile);
router.get(
  "/:userId",
  authenticate,
  isAdminOrOwner("userId"),
  UserController.getUserById
);
router.put(
  "/:userId",
  authenticate,
  isAdminOrOwner("userId"),
  UserController.updateUser
);

export default router;
