import type { Request, Response } from "express";
import JobSeekerProfileService from "../services/jobSeekerProfile.service.ts";
import ErrorMessage from "../models/errorMessage.model.ts";

class JobSeekerProfileController {
  static async getAllJobSeekerProfiles(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const jobSeekerProfiles = await JobSeekerProfileService.getAllProfiles();
      res.status(200).json({ success: true, data: jobSeekerProfiles });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  static async getJobSeekerProfileById(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const jobSeekerProfileId = parseInt(req.params.jobSeekerProfileId);
      const jobSeekerProfile = await JobSeekerProfileService.getProfileById(
        jobSeekerProfileId
      );
      if (!jobSeekerProfile) {
        res.status(404).json(ErrorMessage.notFound());
        return;
      }
      res.status(200).json({ success: true, data: jobSeekerProfile });
    } catch (error) {
      res.status(500).json(ErrorMessage.serverError());
    }
  }

  static async getJobSeekerProfileByUserId(
    req: Request,
    res: Response
  ): Promise<void> {
    console.log("getJobSeekerProfileByUserId");
    try {
      if (!req.user) {
        res.status(401).json(ErrorMessage.authRequired());
        return;
      }
      const userId = req.user.userId;
      const jobSeekerProfile = await JobSeekerProfileService.getProfileByUserId(
        userId
      );
      if (!jobSeekerProfile) {
        res.status(404).json(ErrorMessage.notFound());
        return;
      }
      res.status(200).json({ success: true, data: jobSeekerProfile });
    } catch (error) {
      res.status(500).json(ErrorMessage.serverError());
    }
  }

  static async createJobSeekerProfile(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json(ErrorMessage.authRequired());
        return;
      }
      const jobSeekerProfile = await JobSeekerProfileService.createProfile({
        ...req.body,
        userId: req.user.userId,
      });
      res.status(201).json({ success: true, data: jobSeekerProfile });
    } catch (error) {
      res.status(500).json(ErrorMessage.serverError());
    }
  }

  static async updateJobSeekerProfile(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json(ErrorMessage.authRequired());
        return;
      }
      const jobSeekerProfileId = parseInt(req.params.jobSeekerProfileId);
      const userId = req.user?.userId;
      const jobSeekerProfile = await JobSeekerProfileService.updateProfile(
        jobSeekerProfileId,
        req.body,
        userId
      );
      if (!jobSeekerProfile) {
        res.status(404).json(ErrorMessage.notFound());
        return;
      }
      res.status(200).json({ success: true, data: jobSeekerProfile });
    } catch (error) {
      res.status(500).json(ErrorMessage.serverError());
    }
  }

  static async deleteJobSeekerProfile(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json(ErrorMessage.authRequired());
        return;
      }
      const jobSeekerProfileId = parseInt(req.params.jobSeekerProfileId);
      const jobSeekerProfile = await JobSeekerProfileService.deleteProfile(
        jobSeekerProfileId,
        req.user.userId
      );
      if (!jobSeekerProfile) {
        res.status(404).json(ErrorMessage.notFound());
        return;
      }
      res.status(200).json({ success: true, data: jobSeekerProfile });
    } catch (error) {
      res.status(500).json(ErrorMessage.serverError());
    }
  }
}

export default JobSeekerProfileController;
