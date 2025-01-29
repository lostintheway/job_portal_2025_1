import { Request, Response } from "express";
import { JobService } from "../services/JobService";

export class JobController {
  private jobService: JobService;

  constructor() {
    this.jobService = new JobService();
  }

  createJob = async (req: Request, res: Response): Promise<void> => {
    try {
      const job = await this.jobService.createJob(req.body, req.body.id);
      res.status(201).json(job);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };

  getJobs = async (req: Request, res: Response): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const jobs = await this.jobService.getJobs(page, limit);
      res.status(200).json(jobs);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  getJobById = async (req: Request, res: Response): Promise<void> => {
    try {
      const job = await this.jobService.getJobById(parseInt(req.params.id));
      if (!job) {
        res.status(404).json({ message: "Job not found" });
        return;
      }
      res.status(200).json(job);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  updateJob = async (req: Request, res: Response): Promise<void> => {
    try {
      const job = await this.jobService.updateJob(
        parseInt(req.params.id),
        req.body,
        req.body.id
      );
      if (!job) {
        res.status(404).json({ message: "Job not found" });
        return;
      }
      res.status(200).json(job);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
}
