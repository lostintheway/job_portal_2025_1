import express from "express";
import JobListingController from "../controllers/jobListing.controller";
import { authenticate } from "../middleware/auth";
import { isAdmin, isEmployer, isAdminOrEmployer } from "../middleware/roleAuth";

const router = express.Router();

// Public routes
router.get("/", JobListingController.getAllJobListings);
router.get("/:jobId", JobListingController.getJobListingById);
router.get(
  "/category/:categoryId",
  JobListingController.getJobListingsByCategory
);
router.get("/search", JobListingController.searchJobListings);

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
  JobListingController.getJobListingsByEmployer
);

export default router;
