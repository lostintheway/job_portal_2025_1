import { Request, Response } from "express";
import { ApplicationService } from "../services/ApplicationService";

export class ApplicationController {
  private applicationService: ApplicationService;

  constructor() {
    this.applicationService = new ApplicationService();
  }

  applyJob = async (req: Request, res: Response): Promise<void> => {
    try {
      const application = await this.applicationService.createApplication({
        ...req.body,
        user_id: req.user?.id ?? 0,
        status: "pending",
      });
      res.status(201).json(application);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };

  getJobApplications = async (req: Request, res: Response): Promise<void> => {
    try {
      const applications = await this.applicationService.getApplicationsByJobId(
        parseInt(req.params.jobId)
      );
      res.status(200).json(applications);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  getUserApplications = async (req: Request, res: Response): Promise<void> => {
    try {
      const applications =
        await this.applicationService.getApplicationsByUserId(
          req.user!.id ?? 0
        );
      res.status(200).json(applications);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  updateApplicationStatus = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const application = await this.applicationService.updateApplicationStatus(
        parseInt(req.params.id),
        req.body.status
      );
      if (!application) {
        res.status(404).json({ message: "Application not found" });
        return;
      }
      res.status(200).json(application);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
}
