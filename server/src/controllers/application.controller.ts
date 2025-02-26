import { Request, Response } from "express";
import ApplicationService from "../services/application.service";
import ErrorMessage from "../models/errorMessage.model";

class ApplicationController {
  static async getAllApplications(req: Request, res: Response): Promise<void> {
    try {
      const applications = await ApplicationService.getAllApplications();
      res.status(200).json({ success: true, data: applications });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  static async getApplicationById(req: Request, res: Response): Promise<void> {
    try {
      const applicationId = parseInt(req.params.applicationId);
      const application = await ApplicationService.getApplicationById(
        applicationId
      );
      if (!application) {
        res.status(404).json(ErrorMessage.notFound());
        return;
      }
      res.status(200).json({ success: true, data: application });
    } catch (error) {
      res.status(500).json(ErrorMessage.serverError());
    }
  }

  static async getApplicationsByUserId(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json(ErrorMessage.authRequired());
        return;
      }
      const userId = req.user.userId;
      const applications = await ApplicationService.getApplicationsByUserId(
        userId
      );
      res.status(200).json({ success: true, data: applications });
    } catch (error) {
      res.status(500).json(ErrorMessage.serverError());
    }
  }

  static async getApplicationsByJobId(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const jobId = parseInt(req.params.jobId);
      const applications = await ApplicationService.getApplicationsByJobId(
        jobId
      );
      res.status(200).json({ success: true, data: applications });
    } catch (error) {
      res.status(500).json(ErrorMessage.serverError());
    }
  }
  static async createApplication(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json(ErrorMessage.authRequired());
        return;
      }
      const application = await ApplicationService.createApplication(req.body);
      res.status(201).json({ success: true, data: application });
    } catch (error) {
      res.status(500).json(ErrorMessage.serverError());
    }
  }
  static async updateApplication(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json(ErrorMessage.authRequired());
        return;
      }
      const applicationId = parseInt(req.params.applicationId);
      const application = await ApplicationService.updateApplication(
        applicationId,
        req.body
      );
      if (!application) {
        res.status(404).json(ErrorMessage.notFound());
        return;
      }
      res.status(200).json({ success: true, data: application });
    } catch (error) {
      res.status(500).json(ErrorMessage.serverError());
    }
  }

  static async deleteApplication(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json(ErrorMessage.authRequired());
        return;
      }
      const applicationId = parseInt(req.params.applicationId);
      const application = await ApplicationService.deleteApplication(
        applicationId,
        req.user.userId
      );
      if (!application) {
        res.status(404).json(ErrorMessage.notFound());
        return;
      }
      res.status(200).json({ success: true, data: application });
    } catch (error) {
      res.status(500).json(ErrorMessage.serverError());
    }
  }
}

export default ApplicationController;
