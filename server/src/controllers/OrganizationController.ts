import { Request, Response } from "express";
import { OrganizationService } from "../services/OrganizationService";

export class OrganizationController {
  private organizationService: OrganizationService;

  constructor() {
    this.organizationService = new OrganizationService();
  }

  createOrganization = async (req: Request, res: Response): Promise<void> => {
    try {
      const organization = await this.organizationService.createOrganization({
        ...req.body,
        user_id: req.user!.id,
      });
      res.status(201).json(organization);
    } catch (error) {
      res
        .status(400)
        .json({
          message: error instanceof Error ? error.message : "Unknown Error",
        });
    }
  };

  getOrganizationProfile = async (req: Request, res: Response): Promise<void> => {
    try {
      const organization = await this.organizationService.getOrgByUserId(
        req.user!.id ?? 0
      );
      if (!organization) {
        res.status(404).json({ message: "Organization profile not found" });
        return;
      }
      res.status(200).json(organization);
    } catch (error) {
      res
        .status(500)
        .json({
          message: error instanceof Error ? error.message : "Unknown Error",
        });
    }
  };

  updateOrganization = async (req: Request, res: Response): Promise<void> => {
    try {
      const organization = await this.organizationService.updateOrg(
        parseInt(req.params.id),
        req.body
      );
      if (!organization) {
        res.status(404).json({ message: "Organization not found" });
        return;
      }
      res.status(200).json(organization);
    } catch (error) {
      res
        .status(400)
        .json({
          message: error instanceof Error ? error.message : "Unknown Error",
        });
    }
  };
}
