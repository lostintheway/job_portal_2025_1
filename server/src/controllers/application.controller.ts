import { Request, Response } from "express";
import ApplicationService from "../services/application.service";

class ApplicationController {
  static async getAllApplications(req: Request, res: Response): Promise<void> {
    try {
      const applications = await ApplicationService.getAllApplications();
      res.status(200).json(applications);
    } catch (error) {
      res.status(500).json({ error: "Failed to get applications" });
    }
  }

  static async getApplicationById(req: Request, res: Response): Promise<void> {
    try {
      const applicationId = parseInt(req.params.applicationId);
      const application = await ApplicationService.getApplicationById(
        applicationId
      );

      if (!application) {
        res.status(404).json({ error: "Application not found" });
      }

      res.status(200).json(application);
    } catch (error) {
      res.status(500).json({ error: "Failed to get application" });
    }
  }

  static async createApplication(req: Request, res: Response): Promise<void> {
    try {
      const applicationData = req.body;
      const newApplication = await ApplicationService.createApplication(
        applicationData
      );
      res.status(201).json(newApplication);
    } catch (error) {
      res.status(500).json({ error: "Failed to create application" });
    }
  }

  static async updateApplication(req: Request, res: Response): Promise<void> {
    try {
      const applicationId = parseInt(req.params.applicationId);
      const applicationData = req.body;
      const updatedApplication = await ApplicationService.updateApplication(
        applicationId,
        applicationData
      );

      if (!updatedApplication) {
        res.status(404).json({ error: "Application not found" });
      }

      res.status(200).json(updatedApplication);
    } catch (error) {
      res.status(500).json({ error: "Failed to update application" });
    }
  }

  static async deleteApplication(req: Request, res: Response): Promise<void> {
    try {
      const applicationId = parseInt(req.params.applicationId);
      const success = await ApplicationService.deleteApplication(
        applicationId,
        req.body.deletedBy
      );

      if (!success) {
        res.status(404).json({ error: "Application not found" });
      }

      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete application" });
    }
  }
}

export default ApplicationController;
