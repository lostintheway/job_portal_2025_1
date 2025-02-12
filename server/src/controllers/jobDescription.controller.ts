import { Request, Response } from "express";
import JobDescriptionService from "../services/jobDescription.service";

class JobDescriptionController {
  static async getAllJobDescriptions(req: Request, res: Response) {
    try {
      const jobDescriptions =
        await JobDescriptionService.getAllJobDescriptions();
      return res.status(200).json(jobDescriptions);
    } catch (error) {
      return res.status(500).json({ error: "Failed to get job descriptions" });
    }
  }

  static async getJobDescriptionById(req: Request, res: Response) {
    try {
      const jobDescriptionId = parseInt(req.params.jobDescriptionId);
      const jobDescription = await JobDescriptionService.getJobDescriptionById(
        jobDescriptionId
      );

      if (!jobDescription) {
        return res.status(404).json({ error: "Job description not found" });
      }

      return res.status(200).json(jobDescription);
    } catch (error) {
      return res.status(500).json({ error: "Failed to get job description" });
    }
  }

  static async createJobDescription(req: Request, res: Response) {
    try {
      const jobDescriptionData = req.body;
      const newJobDescription =
        await JobDescriptionService.createJobDescription(jobDescriptionData);
      return res.status(201).json(newJobDescription);
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Failed to create job description" });
    }
  }

  static async updateJobDescription(req: Request, res: Response) {
    try {
      const jobDescriptionId = parseInt(req.params.jobDescriptionId);
      const jobDescriptionData = req.body;
      const updatedJobDescription =
        await JobDescriptionService.updateJobDescription(
          jobDescriptionId,
          jobDescriptionData
        );

      if (!updatedJobDescription) {
        return res.status(404).json({ error: "Job description not found" });
      }

      return res.status(200).json(updatedJobDescription);
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Failed to update job description" });
    }
  }

  static async deleteJobDescription(req: Request, res: Response) {
    try {
      const jobDescriptionId = parseInt(req.params.jobDescriptionId);
      const success = await JobDescriptionService.deleteJobDescription(
        jobDescriptionId,
        req.body.deletedBy
      );

      if (!success) {
        return res.status(404).json({ error: "Job description not found" });
      }

      return res.status(204).send();
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Failed to delete job description" });
    }
  }
}

export default JobDescriptionController;
