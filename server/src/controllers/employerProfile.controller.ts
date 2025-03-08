import type { Request, Response } from "express";
import EmployerProfileService from "../services/employerProfile.service.ts";
import ErrorMessage from "../models/errorMessage.model.ts";

class EmployerProfileController {
  static async getAllEmployerProfiles(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const employerProfiles =
        await EmployerProfileService.getAllEmployerProfiles();
      res.status(200).json({ success: true, data: employerProfiles });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  static async getEmployerProfileById(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const employerProfileId = parseInt(req.params.employerProfileId);
      const employerProfile =
        await EmployerProfileService.getEmployerProfileById(employerProfileId);
      if (!employerProfile) {
        res.status(404).json(ErrorMessage.notFound());
        return;
      }
      res.status(200).json({ success: true, data: employerProfile });
    } catch (error) {
      res.status(500).json(ErrorMessage.serverError());
    }
  }

  static async getEmployerProfileByUserId(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json(ErrorMessage.authRequired());
        return;
      }
      const userId = req.user.userId;
      console.log(userId);
      const employerProfile =
        await EmployerProfileService.getEmployerProfileByUserId(userId);
      if (!employerProfile) {
        res.status(404).json(ErrorMessage.notFound());
        return;
      }
      res.status(200).json({ success: true, data: employerProfile });
    } catch (error) {
      res.status(500).json(ErrorMessage.serverError());
    }
  }

  static async createEmployerProfile(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json(ErrorMessage.authRequired());
        return;
      }
      const employerProfile =
        await EmployerProfileService.createEmployerProfile({
          ...req.body,
          userId: req.user.userId,
        });
      res.status(201).json({ success: true, data: employerProfile });
    } catch (error) {
      res.status(500).json(ErrorMessage.serverError());
    }
  }

  static async updateEmployerProfile(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json(ErrorMessage.authRequired());
        return;
      }
      const employerProfileId = parseInt(req.params.employerProfileId);
      const employerProfile =
        await EmployerProfileService.updateEmployerProfile(
          employerProfileId,
          req.body,
          req.user.userId
        );
      if (!employerProfile) {
        res.status(404).json(ErrorMessage.notFound());
        return;
      }
      res.status(200).json({ success: true, data: employerProfile });
    } catch (error) {
      res.status(500).json(ErrorMessage.serverError());
    }
  }

  static async deleteEmployerProfile(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json(ErrorMessage.authRequired());
        return;
      }
      const employerProfileId = parseInt(req.params.employerProfileId);
      const employerProfile =
        await EmployerProfileService.deleteEmployerProfile(
          employerProfileId,
          req.user.userId
        );
      if (!employerProfile) {
        res.status(404).json(ErrorMessage.notFound());
        return;
      }
      res.status(200).json({ success: true, data: employerProfile });
    } catch (error) {
      res.status(500).json(ErrorMessage.serverError());
    }
  }
}

export default EmployerProfileController;
