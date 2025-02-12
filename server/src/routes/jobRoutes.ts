import { Router } from "express";
import { JobController } from "../controllers/JobController";
import { authenticate } from "../middleware/auth";
// import { validateJob } from "../middleware/validation";

const router = Router();
const jobController = new JobController();

router.get("/job/", jobController.getJobs);
router.get("/job/:id", jobController.getJobById);
router.post("/job/", authenticate, jobController.createJob);
router.put("/job/:id", authenticate, jobController.updateJob);

export default router;
