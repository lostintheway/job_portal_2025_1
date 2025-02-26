import { Request, Response } from "express";
import JobSeekerProfileModel from "../models/jobseekerProfile.model";
import EmployerProfileModel from "../models/employerProfile.model";

class ProfileController {
  // JobSeeker Profile Methods
  static async getJobSeekerProfile(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res
          .status(401)
          .json({ success: false, error: "Authentication required" });
        return;
      }

      const profile = await JobSeekerProfileModel.getProfileByUserId(
        req.user.userId
      );
      if (!profile) {
        res.status(404).json({ success: false, error: "Profile not found" });
        return;
      }

      res.json({ success: true, data: profile });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, error: "Failed to fetch profile" });
    }
  }

  static async createJobSeekerProfile(
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

      const profileData = {
        ...req.body,
        userId: req.user.userId,
        createdBy: req.user.userId,
      };

      const profileId = await JobSeekerProfileModel.createProfile(profileData);
      res.status(201).json({ success: true, data: { profileId } });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, error: "Failed to create profile" });
    }
  }

  static async updateJobSeekerProfile(
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

      const profile = await JobSeekerProfileModel.getProfileByUserId(
        req.user.userId
      );
      if (!profile) {
        res.status(404).json({ success: false, error: "Profile not found" });
        return;
      }

      const profileData = {
        ...req.body,
        updatedBy: req.user.userId,
      };

      await JobSeekerProfileModel.updateProfile(profile.profileId, profileData);
      res.json({ success: true, message: "Profile updated successfully" });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, error: "Failed to update profile" });
    }
  }

  // Employer Profile Methods
  static async getEmployerProfile(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res
          .status(401)
          .json({ success: false, error: "Authentication required" });
        return;
      }

      const profile = await EmployerProfileModel.getEmployerProfileByUserId(
        req.user.userId
      );
      if (!profile) {
        res.status(404).json({ success: false, error: "Profile not found" });
        return;
      }

      res.json({ success: true, data: profile });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, error: "Failed to fetch profile" });
    }
  }

  static async createEmployerProfile(
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

      const profileData = {
        ...req.body,
        userId: req.user.userId,
        createdBy: req.user.userId,
      };

      const employerId = await EmployerProfileModel.createEmployerProfile(
        profileData
      );
      res.status(201).json({ success: true, data: { employerId } });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, error: "Failed to create profile" });
    }
  }

  static async updateEmployerProfile(
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

      const profile = await EmployerProfileModel.getEmployerProfileByUserId(
        req.user.userId
      );
      if (!profile) {
        res.status(404).json({ success: false, error: "Profile not found" });
        return;
      }

      const profileData = {
        ...req.body,
        updatedBy: req.user.userId,
      };

      await EmployerProfileModel.updateEmployerProfile(
        profile.employerId,
        profileData
      );
      res.json({ success: true, message: "Profile updated successfully" });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, error: "Failed to update profile" });
    }
  }

  // Admin Methods
  static async getAllJobSeekerProfiles(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const profiles = await JobSeekerProfileModel.getAllProfiles();
      res.json({ success: true, data: profiles });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, error: "Failed to fetch profiles" });
    }
  }

  static async getAllEmployerProfiles(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const profiles = await EmployerProfileModel.getAllEmployerProfiles();
      res.json({ success: true, data: profiles });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, error: "Failed to fetch profiles" });
    }
  }
}

export default ProfileController;
