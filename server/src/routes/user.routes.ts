import express from "express";
import UserController from "../controllers/user.controller";
import { authenticate } from "../middleware/auth";
import { isAdmin, isAdminOrOwner } from "../middleware/roleAuth";

const router = express.Router();

// Public routes
router.post("/register", UserController.register);
router.post("/login", UserController.login);

// Protected routes
router.get("/", authenticate, isAdmin, UserController.getAllUsers);
router.get("/profile", authenticate, UserController.getCurrentUser);
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
router.delete("/:userId", authenticate, isAdmin, UserController.deleteUser);

export default router;
