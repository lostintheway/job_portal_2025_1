import { eq } from "drizzle-orm";
import { db } from "../config/db";
import { vendorOrganizations } from "../db/schema";
import { CommonFields } from "../interfaces/CommonFields";

export interface VendorOrganization extends CommonFields {
  vendorOrgId: number;
  vendorOrgName: string;
  vendorOrgAddress: string;
  vendorOrgContact: string;
  vendorOrgEmail: string;
  vendorOrgImage?: string;
}

class VendorOrganizationModel {
  static async getAllVendorOrganizations(): Promise<VendorOrganization[]> {
    return db.select().from(vendorOrganizations);
  }

  static async getVendorOrganizationById(
    vendorOrgId: number
  ): Promise<VendorOrganization | undefined> {
    return db
      .select()
      .from(vendorOrganizations)
      .where(eq(vendorOrganizations.vendorOrgId, vendorOrgId))
      .limit(1)
      .then((rows) => rows[0]);
  }

  static async createVendorOrganization(
    vendorOrgData: Omit<
      VendorOrganization,
      | "vendorOrgId"
      | "createdDate"
      | "updatedDate"
      | "deletedDate"
      | "isDeleted"
    >
  ): Promise<number> {
    const [result] = await db.insert(vendorOrganizations).values(vendorOrgData);
    return result.insertId;
  }

  static async updateVendorOrganization(
    vendorOrgId: number,
    vendorOrgData: Partial<
      Omit<
        VendorOrganization,
        | "vendorOrgId"
        | "createdDate"
        | "updatedDate"
        | "deletedDate"
        | "isDeleted"
      >
    >
  ): Promise<boolean> {
    await db
      .update(vendorOrganizations)
      .set(vendorOrgData)
      .where(eq(vendorOrganizations.vendorOrgId, vendorOrgId));
    return true;
  }

  static async deleteVendorOrganization(
    vendorOrgId: number,
    deletedBy: number
  ): Promise<boolean> {
    await db
      .update(vendorOrganizations)
      .set({ isDeleted: true, deletedBy, deletedDate: new Date() })
      .where(eq(vendorOrganizations.vendorOrgId, vendorOrgId));
    return true;
  }
}

export default VendorOrganizationModel;
