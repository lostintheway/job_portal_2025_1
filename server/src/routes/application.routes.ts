import express from "express";
import ApplicationController from "../controllers/application.controller.ts";
import { authenticate } from "../middleware/auth.ts";
import { isAdmin, isJobSeeker, isEmployer } from "../middleware/roleAuth.ts";

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
  ApplicationController.getApplicationsByUserId
);

// Employer routes
router.get(
  "/job/:jobId",
  authenticate,
  isEmployer,
  ApplicationController.getApplicationsByJobId
);
router.put(
  "/status/:applicationId",
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
