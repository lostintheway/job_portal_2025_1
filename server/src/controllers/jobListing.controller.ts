import { Request, Response } from "express";
import JobListingModel from "../models/jobListing.model";
import { employerProfiles } from "../db/schema";
import { eq } from "drizzle-orm";
import { db } from "../config/db";

class JobListingController {
  static async getAllJobListings(req: Request, res: Response): Promise<void> {
    try {
      const jobListings = await JobListingModel.getAllJobListings();
      res.status(200).json({ success: true, data: jobListings });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, error: "Failed to get job listings" });
    }
  }

  static async getJobListingById(req: Request, res: Response): Promise<void> {
    try {
      const jobId = parseInt(req.params.jobId);
      const jobListing = await JobListingModel.getJobListingById(jobId);

      if (!jobListing) {
        res
          .status(404)
          .json({ success: false, error: "Job listing not found" });
        return;
      }

      // Increment view count
      await JobListingModel.incrementViewCount(jobId);
      res.status(200).json({ success: true, data: jobListing });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, error: "Failed to get job listing" });
    }
  }

  static async getJobListingsByEmployer(
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

      const employerId = parseInt(req.params.employerId);

      // If user is employer, verify they own these listings
      if (req.user.role === "employer") {
        const employerProfile = await db
          .select()
          .from(employerProfiles)
          .where(eq(employerProfiles.userId, req.user.userId))
          .limit(1)
          .then((rows) => rows[0]);

        if (!employerProfile || employerProfile.employerId !== employerId) {
          res.status(403).json({ success: false, error: "Access denied" });
          return;
        }
      }

      const jobListings = await JobListingModel.getJobListingsByEmployerId(
        employerId
      );
      res.status(200).json({ success: true, data: jobListings });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, error: "Failed to get job listings" });
    }
  }

  static async getJobListingsByCategory(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const categoryId = parseInt(req.params.categoryId);
      const jobListings = await JobListingModel.getJobListingsByCategory(
        categoryId
      );
      res.status(200).json({ success: true, data: jobListings });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, error: "Failed to get job listings" });
    }
  }

  static async searchJobListings(req: Request, res: Response): Promise<void> {
    try {
      const searchTerm = req.query.q as string;
      if (!searchTerm) {
        res
          .status(400)
          .json({ success: false, error: "Search term is required" });
        return;
      }

      const jobListings = await JobListingModel.searchJobListings(searchTerm);
      res.status(200).json({ success: true, data: jobListings });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, error: "Failed to search job listings" });
    }
  }

  static async createJobListing(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res
          .status(401)
          .json({ success: false, error: "Authentication required" });
        return;
      }

      const employerProfile = await db
        .select()
        .from(employerProfiles)
        .where(eq(employerProfiles.userId, req.user.userId))
        .limit(1)
        .then((rows) => rows[0]);

      if (!employerProfile) {
        res
          .status(403)
          .json({ success: false, error: "Employer profile required" });
        return;
      }

      const jobData = {
        ...req.body,
        employerId: employerProfile.employerId,
        createdBy: req.user.userId,
      };

      const jobId = await JobListingModel.createJobListing(jobData);
      res.status(201).json({ success: true, data: { jobId } });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, error: "Failed to create job listing" });
    }
  }

  static async updateJobListing(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res
          .status(401)
          .json({ success: false, error: "Authentication required" });
        return;
      }

      const jobId = parseInt(req.params.jobId);
      const jobListing = await JobListingModel.getJobListingById(jobId);

      if (!jobListing) {
        res
          .status(404)
          .json({ success: false, error: "Job listing not found" });
        return;
      }

      // If user is employer, verify they own this listing
      if (req.user.role === "employer") {
        const employerProfile = await db
          .select()
          .from(employerProfiles)
          .where(eq(employerProfiles.userId, req.user.userId))
          .limit(1)
          .then((rows) => rows[0]);

        if (
          !employerProfile ||
          employerProfile.employerId !== jobListing.employerId
        ) {
          res.status(403).json({ success: false, error: "Access denied" });
          return;
        }
      }

      const jobData = {
        ...req.body,
        updatedBy: req.user.userId,
      };

      await JobListingModel.updateJobListing(jobId, jobData);
      res
        .status(200)
        .json({ success: true, message: "Job listing updated successfully" });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, error: "Failed to update job listing" });
    }
  }

  static async deleteJobListing(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res
          .status(401)
          .json({ success: false, error: "Authentication required" });
        return;
      }

      const jobId = parseInt(req.params.jobId);
      const jobListing = await JobListingModel.getJobListingById(jobId);

      if (!jobListing) {
        res
          .status(404)
          .json({ success: false, error: "Job listing not found" });
        return;
      }

      // If user is employer, verify they own this listing
      if (req.user.role === "employer") {
        const employerProfile = await db
          .select()
          .from(employerProfiles)
          .where(eq(employerProfiles.userId, req.user.userId))
          .limit(1)
          .then((rows) => rows[0]);

        if (
          !employerProfile ||
          employerProfile.employerId !== jobListing.employerId
        ) {
          res.status(403).json({ success: false, error: "Access denied" });
          return;
        }
      }

      await JobListingModel.deleteJobListing(jobId, req.user.userId);
      res
        .status(200)
        .json({ success: true, message: "Job listing deleted successfully" });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, error: "Failed to delete job listing" });
    }
  }
}

export default JobListingController;
