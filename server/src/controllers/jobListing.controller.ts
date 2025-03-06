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

  // getjobsbypage
  static async getJobListingsByPageAndSize(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.params.page);
      const size = parseInt(req.params.size);
      const jobListings = await JobListingService.getJobListingsByPageAndSize(page, size);
      res.status(200).json({ success: true, data: jobListings });
    } catch (error) {
      res.status(500).json(ErrorMessage.serverError());
    }
  }

  static async getJobListingById(req: Request, res: Response): Promise<void> {
    try {
      const jobListingId = parseInt(req.params.jobListingId);
      const jobListing = await JobListingService.getJobListingById(
        jobListingId
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

  static async getJobListingsByEmployerId(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json(ErrorMessage.authRequired());
        return;
      }
      const employerId = req.user.userId;
      const jobListings = await JobListingService.getJobListingsByEmployerId(
        employerId
      );
      res.status(200).json({ success: true, data: jobListings });
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
      const jobListingId = parseInt(req.params.jobListingId);
      const jobListing = await JobListingService.updateJobListing(
        jobListingId,
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
      const jobListingId = parseInt(req.params.jobListingId);
      const jobListing = await JobListingService.deleteJobListing(
        jobListingId,
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
