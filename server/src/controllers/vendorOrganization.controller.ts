import { Request, Response } from "express";
import VendorOrganizationService from "../services/vendorOrganization.service";

class VendorOrganizationController {
  static async getAllVendorOrganizations(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const vendorOrgs =
        await VendorOrganizationService.getAllVendorOrganizations();
      res.json({ success: true, data: vendorOrgs });
    } catch (error) {
      res
        .status(500)
        .json({
          success: false,
          error: "Failed to fetch vendor organizations",
        });
    }
  }

  static async getVendorOrganizationById(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const vendorOrgId = parseInt(req.params.vendorOrgId);
      const vendorOrg =
        await VendorOrganizationService.getVendorOrganizationById(vendorOrgId);
      if (!vendorOrg) {
        res
          .status(404)
          .json({ success: false, error: "Vendor organization not found" });
        return;
      }
      res.json({ success: true, data: vendorOrg });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, error: "Failed to fetch vendor organization" });
    }
  }

  static async createVendorOrganization(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const vendorOrgData = req.body;
      const vendorOrgId =
        await VendorOrganizationService.createVendorOrganization(vendorOrgData);
      res.status(201).json({ success: true, data: { vendorOrgId } });
    } catch (error) {
      res
        .status(500)
        .json({
          success: false,
          error: "Failed to create vendor organization",
        });
    }
  }

  static async updateVendorOrganization(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const vendorOrgId = parseInt(req.params.vendorOrgId);
      const vendorOrgData = req.body;
      const success = await VendorOrganizationService.updateVendorOrganization(
        vendorOrgId,
        vendorOrgData
      );
      if (!success) {
        res
          .status(404)
          .json({ success: false, error: "Vendor organization not found" });
        return;
      }
      res.json({ success: true });
    } catch (error) {
      res
        .status(500)
        .json({
          success: false,
          error: "Failed to update vendor organization",
        });
    }
  }

  static async deleteVendorOrganization(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const vendorOrgId = parseInt(req.params.vendorOrgId);
      const deletedBy = parseInt(req.body.deletedBy);
      const success = await VendorOrganizationService.deleteVendorOrganization(
        vendorOrgId,
        deletedBy
      );
      if (!success) {
        res
          .status(404)
          .json({ success: false, error: "Vendor organization not found" });
        return;
      }
      res.json({ success: true });
    } catch (error) {
      res
        .status(500)
        .json({
          success: false,
          error: "Failed to delete vendor organization",
        });
    }
  }
}

export default VendorOrganizationController;
