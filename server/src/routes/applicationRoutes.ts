import { Router } from "express";
import { ApplicationController } from "../controllers/ApplicationController";
import { authenticate, authorizeCompany } from "../middleware/auth";

const router = Router();
const applicationController = new ApplicationController();

router.post("/:jobId/apply", authenticate, applicationController.apply);
router.get(
  "/job/:jobId",
  authenticate,
  authorizeCompany,
  applicationController.getJobApplications
);
router.get("/user", authenticate, applicationController.getUserApplications);
router.put(
  "/:id/status",
  authenticate,
  authorizeCompany,
  applicationController.updateApplicationStatus
);

export default router;
