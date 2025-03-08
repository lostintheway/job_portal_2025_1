import express from "express";
import { authenticate } from "../middleware/auth.ts";
import { isAdmin, isEmployer } from "../middleware/roleAuth.ts";
import EmployerProfileController from "../controllers/employerProfile.controller.ts";

const router = express.Router();

router.get(
  "/my-profile",
  authenticate,
  isEmployer,
  EmployerProfileController.getEmployerProfileByUserId
);

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

router.put(
  "/:employerProfileId",
  authenticate,
  isEmployer,
  EmployerProfileController.updateEmployerProfile
);
router.post(
  "/",
  authenticate,
  isEmployer,
  EmployerProfileController.createEmployerProfile
);
router.delete(
  "/:employerProfileId",
  authenticate,
  isEmployer,
  EmployerProfileController.deleteEmployerProfile
);

export default router;
