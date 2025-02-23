import { Request, Response } from "express";
import JobDescriptionService from "../services/jobDescription.service";

class JobDescriptionController {
  static async getAllJobDescriptions(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const jobDescriptions =
        await JobDescriptionService.getAllJobDescriptions();
      res.status(200).json(jobDescriptions);
    } catch (error) {
      res.status(500).json({ error: "Failed to get job descriptions" });
    }
  }

  static async getJobDescriptionById(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const jobDescriptionId = parseInt(req.params.jobDescriptionId);
      const jobDescription = await JobDescriptionService.getJobDescriptionById(
        jobDescriptionId
      );

      if (!jobDescription) {
        res.status(404).json({ error: "Job description not found" });
      }

      res.status(200).json(jobDescription);
    } catch (error) {
      res.status(500).json({ error: "Failed to get job description" });
    }
  }

  static async createJobDescription(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const jobDescriptionData = req.body;
      const newJobDescription =
        await JobDescriptionService.createJobDescription(jobDescriptionData);
      res.status(201).json(newJobDescription);
    } catch (error) {
      res.status(500).json({ error: "Failed to create job description" });
    }
  }

  static async updateJobDescription(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const jobDescriptionId = parseInt(req.params.jobDescriptionId);
      const jobDescriptionData = req.body;
      const updatedJobDescription =
        await JobDescriptionService.updateJobDescription(
          jobDescriptionId,
          jobDescriptionData
        );

      if (!updatedJobDescription) {
        res.status(404).json({ error: "Job description not found" });
      }

      res.status(200).json(updatedJobDescription);
    } catch (error) {
      res.status(500).json({ error: "Failed to update job description" });
    }
  }

  static async deleteJobDescription(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const jobDescriptionId = parseInt(req.params.jobDescriptionId);
      const success = await JobDescriptionService.deleteJobDescription(
        jobDescriptionId,
        req.body.deletedBy
      );

      if (!success) {
        res.status(404).json({ error: "Job description not found" });
      }

      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete job description" });
    }
  }
}

export default JobDescriptionController;
