import express from "express";
import { authenticate } from "../middleware/auth.ts";
import { isEmployer, isAdminOrEmployer } from "../middleware/roleAuth.ts";
import JobListingController from "../controllers/jobListing.controller.ts";

const router = express.Router();

router.get(
  "/employer",
  authenticate,
  isEmployer,
  JobListingController.getJobListingsByEmployerId
);
router.get(
  "/employer/:employerId",
  authenticate,
  isAdminOrEmployer,
  JobListingController.getJobListingsByEmployerId
);
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

// New route for getting jobs by the current employer with pagination

export default router;
