import { Router } from "express";
import { ApplicationController } from "../controllers/ApplicationController";
import { authenticate, authorizeOrganization } from "../middleware/auth";

const router = Router();
const applicationController = new ApplicationController();

router.post("/:jobId/apply", authenticate, applicationController.applyJob);
router.get(
  "/job/:jobId",
  authenticate,
  authorizeOrganization,
  applicationController.getJobApplications
);
router.get("/user", authenticate, applicationController.getUserApplications);
router.put(
  "/:id/status",
  authenticate,
  authorizeOrganization,
  applicationController.updateApplicationStatus
);

export default router;
