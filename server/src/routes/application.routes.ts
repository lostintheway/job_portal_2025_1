import express from "express";
import ApplicationController from "../controllers/application.controller";
import { authenticate } from "../middleware/auth";
import { isAdmin, isJobSeeker, isEmployer } from "../middleware/roleAuth";

const router = express.Router();

// JobSeeker routes
router.post(
  "/",
  authenticate,
  isJobSeeker,
  ApplicationController.createApplication
);
router.get(
  "/my-applications",
  authenticate,
  isJobSeeker,
  ApplicationController.getMyApplications
);

// Employer routes
router.get(
  "/job/:jobId",
  authenticate,
  isEmployer,
  ApplicationController.getApplicationsByJob
);
router.put(
  "/:applicationId/status",
  authenticate,
  isEmployer,
  ApplicationController.updateApplicationStatus
);

// Admin routes
router.get(
  "/",
  authenticate,
  isAdmin,
  ApplicationController.getAllApplications
);
router.get(
  "/:applicationId",
  authenticate,
  isAdmin,
  ApplicationController.getApplicationById
);
router.delete(
  "/:applicationId",
  authenticate,
  isAdmin,
  ApplicationController.deleteApplication
);

export default router;
