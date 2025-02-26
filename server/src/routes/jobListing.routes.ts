import express from "express";
import { authenticate } from "../middleware/auth";
import { isEmployer, isAdminOrEmployer } from "../middleware/roleAuth";
import JobListingController from "../controllers/jobListing.controller";

const router = express.Router();

// Public routes
router.get("/", JobListingController.getAllJobListings);
router.get("/:jobId", JobListingController.getJobListingById);
router.get(
  "/category/:categoryId",
  JobListingController.getJobListingsByCategoryId
);

// Protected routes
router.post(
  "/",
  authenticate,
  isEmployer,
  JobListingController.createJobListing
);
router.put(
  "/:jobId",
  authenticate,
  isAdminOrEmployer,
  JobListingController.updateJobListing
);
router.delete(
  "/:jobId",
  authenticate,
  isAdminOrEmployer,
  JobListingController.deleteJobListing
);
router.get(
  "/employer/:employerId",
  authenticate,
  isAdminOrEmployer,
  JobListingController.getJobListingsByEmployerId
);

export default router;
