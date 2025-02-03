import { Request, Response } from "express";
import { CompanyService } from "../services/CompanyService";

export class CompanyController {
  private companyService: CompanyService;

  constructor() {
    this.companyService = new CompanyService();
  }

  createCompany = async (req: Request, res: Response): Promise<void> => {
    try {
      const company = await this.companyService.createCompany({
        ...req.body,
        user_id: req.user!.id,
      });
      res.status(201).json(company);
    } catch (error) {
      res
        .status(400)
        .json({
          message: error instanceof Error ? error.message : "Unknown Error",
        });
    }
  };

  getCompanyProfile = async (req: Request, res: Response): Promise<void> => {
    try {
      const company = await this.companyService.getCompanyByUserId(
        req.user!.id ?? 0
      );
      if (!company) {
        res.status(404).json({ message: "Company profile not found" });
        return;
      }
      res.status(200).json(company);
    } catch (error) {
      res
        .status(500)
        .json({
          message: error instanceof Error ? error.message : "Unknown Error",
        });
    }
  };

  updateCompany = async (req: Request, res: Response): Promise<void> => {
    try {
      const company = await this.companyService.updateCompany(
        parseInt(req.params.id),
        req.body
      );
      if (!company) {
        res.status(404).json({ message: "Company not found" });
        return;
      }
      res.status(200).json(company);
    } catch (error) {
      res
        .status(400)
        .json({
          message: error instanceof Error ? error.message : "Unknown Error",
        });
    }
  };
}
