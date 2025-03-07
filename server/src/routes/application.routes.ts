import express from "express";
import { authenticate } from "../middleware/auth.ts";
import { isEmployer, isAdminOrEmployer } from "../middleware/roleAuth.ts";
import ApplicationController from "../controllers/application.controller.ts";

const router = express.Router();

// Public routes
router.get("/", authenticate, ApplicationController.getApplications);
router.get(
  "/:applicationId",
  authenticate,
  ApplicationController.getApplicationById
);

// Protected routes
router.post("/", authenticate, ApplicationController.createApplication);
router.put(
  "/:applicationId/status",
  authenticate,
  isAdminOrEmployer,
  ApplicationController.updateApplicationStatus
);
router.put(
  "/:applicationId",
  authenticate,
  isAdminOrEmployer,
  ApplicationController.updateApplication
);
router.delete(
  "/:applicationId",
  authenticate,
  isAdminOrEmployer,
  ApplicationController.deleteApplication
);

export default router;
