import { Request, Response } from "express";
import { authenticate } from "../middleware/auth";
import { isAdmin, isJobSeeker } from "../middleware/roleAuth";
import JobSeekerProfileController from "../controllers/jobSeekerProfile.controller";

const router = require("express").Router();

// Public routes
router.get(
  "/",
  authenticate,
  isAdmin,
  JobSeekerProfileController.getAllJobSeekerProfiles
);
router.get(
  "/:jobSeekerProfileId",
  authenticate,
  JobSeekerProfileController.getJobSeekerProfileById
);

// Protected routes for job seekers
router.get(
  "/my-profile",
  authenticate,
  isJobSeeker,
  JobSeekerProfileController.getJobSeekerProfileByUserId
);
router.post(
  "/",
  authenticate,
  isJobSeeker,
  JobSeekerProfileController.createJobSeekerProfile
);
router.put(
  "/:jobSeekerProfileId",
  authenticate,
  isJobSeeker,
  JobSeekerProfileController.updateJobSeekerProfile
);
router.delete(
  "/:jobSeekerProfileId",
  authenticate,
  isJobSeeker,
  JobSeekerProfileController.deleteJobSeekerProfile
);

export default router;
