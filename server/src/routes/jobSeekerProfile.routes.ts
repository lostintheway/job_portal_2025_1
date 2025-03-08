import { authenticate } from "../middleware/auth.ts";
import { isAdmin, isJobSeeker } from "../middleware/roleAuth.ts";
import JobSeekerProfileController from "../controllers/jobSeekerProfile.controller.ts";
import express from "express";

const router = express.Router();
// Protected routes for job seekers
router.get(
  "/my-profile",
  authenticate,
  isJobSeeker,
  JobSeekerProfileController.getJobSeekerProfileByUserId
);

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
