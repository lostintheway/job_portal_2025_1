import express from "express";
import { authenticate } from "../middleware/auth.ts";
import { isAdmin, isEmployer } from "../middleware/roleAuth.ts";
import EmployerProfileController from "../controllers/employerProfile.controller.ts";

const router = express.Router();

// Public routes
router.get(
  "/",
  authenticate,
  isAdmin,
  EmployerProfileController.getAllEmployerProfiles
);
router.get(
  "/:employerProfileId",
  authenticate,
  EmployerProfileController.getEmployerProfileById
);

// Protected routes for employers
router.get(
  "/my-profile",
  authenticate,
  isEmployer,
  EmployerProfileController.getEmployerProfileByUserId
);
router.post(
  "/",
  authenticate,
  isEmployer,
  EmployerProfileController.createEmployerProfile
);
router.put(
  "/:employerProfileId",
  authenticate,
  isEmployer,
  EmployerProfileController.updateEmployerProfile
);
router.delete(
  "/:employerProfileId",
  authenticate,
  isEmployer,
  EmployerProfileController.deleteEmployerProfile
);

export default router;
