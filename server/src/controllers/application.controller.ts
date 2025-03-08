import type { Request, Response } from "express";
import ApplicationService from "../services/application.service.ts";
import ErrorMessage from "../models/errorMessage.model.ts";
import type { ApplicationQueryParams } from "../interfaces/QueryParams.ts";

class ApplicationController {
  static async getApplications(req: Request, res: Response): Promise<void> {
    try {
      const params: ApplicationQueryParams = {
        page: req.query.page ? parseInt(req.query.page as string) : undefined,
        size: req.query.size ? parseInt(req.query.size as string) : undefined,
        sortBy: req.query.sortBy as string | undefined,
        sortOrder: (req.query.sortOrder as "asc" | "desc") || undefined,
        filters: {
          status: req.query.status ? [req.query.status as string] : undefined,
          userId: req.query.userId
            ? parseInt(req.query.userId as string)
            : undefined,
          jobId: req.query.jobId
            ? parseInt(req.query.jobId as string)
            : undefined,
        },
      };

      const applications = await ApplicationService.getApplications(params);
      res.status(200).json({ success: true, data: applications });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // getMyApplications
  static async getMyApplications(req: Request, res: Response): Promise<void> {
    console.log("getMyApplications");
    try {
      const userId = req.user?.userId;
      console.log({ userId });
      if (!userId) {
        res.status(401).json(ErrorMessage.authRequired());
        return;
      }
      const applications = await ApplicationService.getMyApplications(userId);
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

  static async updateApplicationStatus(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json(ErrorMessage.authRequired());
        return;
      }
      const applicationId = parseInt(req.params.applicationId);
      const application = await ApplicationService.updateApplicationStatus(
        applicationId,
        req.body.status as
          | "pending"
          | "shortlisted"
          | "interviewed"
          | "rejected"
          | "accepted"
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
