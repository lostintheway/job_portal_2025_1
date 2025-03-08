import express from "express";
import { authenticate } from "../middleware/auth.ts";
import { isEmployer, isAdminOrEmployer } from "../middleware/roleAuth.ts";
import JobListingController from "../controllers/jobListing.controller.ts";

const router = express.Router();

// Public routes
router.get("/", JobListingController.getAllJobListings);
router.get("/search", JobListingController.getJobListings);
router.get(
  "/page/:page/size/:size",
  JobListingController.getJobListingsByPageAndSize
);
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
