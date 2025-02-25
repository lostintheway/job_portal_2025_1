import { Request, Response } from "express";
import ApplicationService from "../services/application.service";
import { eq, and } from "drizzle-orm";
import { db } from "../config/db";
import { applications, jobListings, employerProfiles } from "../db/schema";

class ApplicationController {
  static async getAllApplications(req: Request, res: Response): Promise<void> {
    try {
      const applications = await ApplicationService.getAllApplications();
      res.status(200).json({ success: true, data: applications });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, error: "Failed to get applications" });
    }
  }

  static async getApplicationById(req: Request, res: Response): Promise<void> {
    try {
      const applicationId = parseInt(req.params.applicationId);
      const application = await ApplicationService.getApplicationById(
        applicationId
      );

      if (!application) {
        res
          .status(404)
          .json({ success: false, error: "Application not found" });
        return;
      }

      res.status(200).json({ success: true, data: application });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, error: "Failed to get application" });
    }
  }

  static async getMyApplications(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res
          .status(401)
          .json({ success: false, error: "Authentication required" });
        return;
      }

      const userId = req.user.userId;
      const userApplications = await db
        .select()
        .from(applications)
        .where(
          and(
            eq(applications.userId, userId),
            eq(applications.isDeleted, false)
          )
        );

      res.status(200).json({ success: true, data: userApplications });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, error: "Failed to get applications" });
    }
  }

  static async getApplicationsByJob(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      if (!req.user) {
        res
          .status(401)
          .json({ success: false, error: "Authentication required" });
        return;
      }

      const jobId = parseInt(req.params.jobId);
      const userId = req.user.userId;

      // Verify the job belongs to the employer
      const job = await db
        .select()
        .from(jobListings)
        .leftJoin(
          employerProfiles,
          eq(jobListings.employerId, employerProfiles.employerId)
        )
        .where(
          and(eq(jobListings.jobId, jobId), eq(employerProfiles.userId, userId))
        )
        .limit(1)
        .then((rows) => rows[0]);

      if (!job && req.user.role !== "admin") {
        res.status(403).json({ success: false, error: "Access denied" });
        return;
      }

      const jobApplications = await db
        .select()
        .from(applications)
        .where(
          and(eq(applications.jobId, jobId), eq(applications.isDeleted, false))
        );

      res.status(200).json({ success: true, data: jobApplications });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, error: "Failed to get applications" });
    }
  }

  static async createApplication(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res
          .status(401)
          .json({ success: false, error: "Authentication required" });
        return;
      }

      const applicationData = {
        ...req.body,
        userId: req.user.userId,
        createdBy: req.user.userId,
      };

      const applicationId = await ApplicationService.createApplication(
        applicationData
      );
      res.status(201).json({ success: true, data: { applicationId } });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, error: "Failed to create application" });
    }
  }

  static async updateApplicationStatus(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      if (!req.user) {
        res
          .status(401)
          .json({ success: false, error: "Authentication required" });
        return;
      }

      const applicationId = parseInt(req.params.applicationId);
      const { status, interviewDate, interviewNotes, rejectionReason } =
        req.body;

      // Verify the application is for a job owned by the employer
      const application = await db
        .select()
        .from(applications)
        .leftJoin(jobListings, eq(applications.jobId, jobListings.jobId))
        .leftJoin(
          employerProfiles,
          eq(jobListings.employerId, employerProfiles.employerId)
        )
        .where(
          and(
            eq(applications.applicationId, applicationId),
            eq(employerProfiles.userId, req.user.userId)
          )
        )
        .limit(1)
        .then((rows) => rows[0]);

      if (!application && req.user.role !== "admin") {
        res.status(403).json({ success: false, error: "Access denied" });
        return;
      }

      const updateData = {
        status,
        updatedBy: req.user.userId,
      };

      if (status === "interviewed" && interviewDate) {
        Object.assign(updateData, { interviewDate, interviewNotes });
      }

      if (status === "rejected" && rejectionReason) {
        Object.assign(updateData, { rejectionReason });
      }

      await ApplicationService.updateApplication(applicationId, updateData);
      res
        .status(200)
        .json({ success: true, message: "Application status updated" });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, error: "Failed to update application status" });
    }
  }

  static async deleteApplication(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res
          .status(401)
          .json({ success: false, error: "Authentication required" });
        return;
      }

      const applicationId = parseInt(req.params.applicationId);
      const success = await ApplicationService.deleteApplication(
        applicationId,
        req.user.userId
      );

      if (!success) {
        res
          .status(404)
          .json({ success: false, error: "Application not found" });
        return;
      }

      res
        .status(200)
        .json({ success: true, message: "Application deleted successfully" });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, error: "Failed to delete application" });
    }
  }
}

export default ApplicationController;
