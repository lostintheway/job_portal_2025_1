import { Request, Response } from "express";
import ApplicationService from "../services/application.service";

class ApplicationController {
  static async getAllApplications(req: Request, res: Response) {
    try {
      const applications = await ApplicationService.getAllApplications();
      return res.status(200).json(applications);
    } catch (error) {
      return res.status(500).json({ error: "Failed to get applications" });
    }
  }

  static async getApplicationById(req: Request, res: Response) {
    try {
      const applicationId = parseInt(req.params.applicationId);
      const application = await ApplicationService.getApplicationById(
        applicationId
      );

      if (!application) {
        return res.status(404).json({ error: "Application not found" });
      }

      return res.status(200).json(application);
    } catch (error) {
      return res.status(500).json({ error: "Failed to get application" });
    }
  }

  static async createApplication(req: Request, res: Response) {
    try {
      const applicationData = req.body;
      const newApplication = await ApplicationService.createApplication(
        applicationData
      );
      return res.status(201).json(newApplication);
    } catch (error) {
      return res.status(500).json({ error: "Failed to create application" });
    }
  }

  static async updateApplication(req: Request, res: Response) {
    try {
      const applicationId = parseInt(req.params.applicationId);
      const applicationData = req.body;
      const updatedApplication = await ApplicationService.updateApplication(
        applicationId,
        applicationData
      );

      if (!updatedApplication) {
        return res.status(404).json({ error: "Application not found" });
      }

      return res.status(200).json(updatedApplication);
    } catch (error) {
      return res.status(500).json({ error: "Failed to update application" });
    }
  }

  static async deleteApplication(req: Request, res: Response) {
    try {
      const applicationId = parseInt(req.params.applicationId);
      const success = await ApplicationService.deleteApplication(
        applicationId,
        req.user.userId
      );

      if (!success) {
        return res.status(404).json({ error: "Application not found" });
      }

      return res.status(204).send();
    } catch (error) {
      return res.status(500).json({ error: "Failed to delete application" });
    }
  }
}

export default ApplicationController;
