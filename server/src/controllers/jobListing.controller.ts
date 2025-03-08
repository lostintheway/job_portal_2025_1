import type { Request, Response } from "express";
import JobListingService from "../services/jobListing.service.ts";
import ErrorMessage from "../models/errorMessage.model.ts";

class JobListingController {
  static async getAllJobListings(req: Request, res: Response): Promise<void> {
    try {
      const jobListings = await JobListingService.getAllJobListings();
      res.status(200).json({ success: true, data: jobListings });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // getJobListings
  static async getJobListings(req: Request, res: Response): Promise<void> {
    try {
      const queryParams = req.query;
      const jobListings = await JobListingService.getJobListings(queryParams);
      res.status(200).json({ success: true, data: jobListings });
    } catch (error) {
      res.status(500).json(ErrorMessage.serverError());
    }
  }
  // getjobsbypage
  static async getJobListingsByPageAndSize(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const page = parseInt(req.params.page);
      const size = parseInt(req.params.size);
      const jobListings = await JobListingService.getJobListingsByPageAndSize(
        page,
        size
      );
      res.status(200).json({ success: true, data: jobListings });
    } catch (error) {
      res.status(500).json(ErrorMessage.serverError());
    }
  }

  static async getJobListingById(req: Request, res: Response): Promise<void> {
    try {
      const jobId = parseInt(req.params.jobId);
      const jobListing = await JobListingService.getJobListingById(jobId);
      if (!jobListing) {
        res.status(404).json(ErrorMessage.notFound());
        return;
      }
      res.status(200).json({ success: true, data: jobListing });
    } catch (error) {
      res.status(500).json(
        error instanceof Error
          ? {
              message: error.message,
              success: false,
            }
          : ErrorMessage.serverError()
      );
    }
  }

  static async getJobListingsByEmployerId(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json(ErrorMessage.authRequired());
        return;
      }

      // Ensure employerId is a number
      const employerId = req.params.employerId
        ? parseInt(req.params.employerId)
        : req.user.userId;

      // Get pagination parameters
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const status = (req.query.status as string) || "all";

      // Get job listings with pagination
      const result =
        await JobListingService.getJobListingsByEmployerIdPaginated(
          employerId,
          page,
          limit,
          status
        );

      res.status(200).json({
        success: true,
        data: result.data,
        total: result.total,
        page: result.page,
        size: result.size,
        totalPages: result.totalPages,
      });
    } catch (error) {
      res.status(500).json(ErrorMessage.serverError());
    }
  }

  // get all job listings by category id
  static async getJobListingsByCategoryId(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const categoryId = parseInt(req.params.categoryId);
      const jobListings = await JobListingService.getJobListingsByCategoryId(
        categoryId
      );
      res.status(200).json({ success: true, data: jobListings });
    } catch (error) {
      res.status(500).json(ErrorMessage.serverError());
    }
  }

  static async createJobListing(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json(ErrorMessage.authRequired());
        return;
      }
      const jobListing = await JobListingService.createJobListing({
        ...req.body,
        employerId: req.user.userId,
      });
      res.status(201).json({ success: true, data: jobListing });
    } catch (error) {
      res.status(500).json(ErrorMessage.serverError());
    }
  }

  static async updateJobListing(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json(ErrorMessage.authRequired());
        return;
      }

      // Use jobId parameter from the route
      const jobId = parseInt(req.params.jobId);

      // Check if jobId is a valid number
      if (isNaN(jobId)) {
        res.status(400).json({
          success: false,
          message: `Invalid jobId: ${req.params.jobId}`,
        });
        return;
      }

      const jobListing = await JobListingService.updateJobListing(
        jobId,
        req.body
      );

      if (!jobListing) {
        res.status(404).json(ErrorMessage.notFound());
        return;
      }

      res.status(200).json({ success: true, data: jobListing });
    } catch (error) {
      res.status(500).json(ErrorMessage.serverError());
    }
  }

  static async deleteJobListing(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json(ErrorMessage.authRequired());
        return;
      }

      // Use jobId parameter from the route
      const jobId = parseInt(req.params.jobId);

      // Check if jobId is a valid number
      if (isNaN(jobId)) {
        res.status(400).json({
          success: false,
          message: `Invalid jobId: ${req.params.jobId}`,
        });
        return;
      }

      const jobListing = await JobListingService.deleteJobListing(
        jobId,
        req.user.userId
      );

      if (!jobListing) {
        res.status(404).json(ErrorMessage.notFound());
        return;
      }

      res.status(200).json({ success: true, data: jobListing });
    } catch (error) {
      res.status(500).json(ErrorMessage.serverError());
    }
  }
}

export default JobListingController;
