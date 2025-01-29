import { Router } from "express";
import { JobController } from "../controllers/JobController";
import { authenticate } from "../middleware/auth";
import { validateJob } from "../middleware/validation";

const router = Router();
const jobController = new JobController();

router.get("/", jobController.getJobs);
router.get("/:id", jobController.getJobById);
router.post("/", authenticate, validateJob, jobController.createJob);
router.put("/:id", authenticate, validateJob, jobController.updateJob);

export default router;
