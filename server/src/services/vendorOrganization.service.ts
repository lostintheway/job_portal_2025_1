import VendorOrganizationModel, {
  VendorOrganization,
} from "../models/vendorOrganization.model";

class VendorOrganizationService {
  static async getAllVendorOrganizations(): Promise<VendorOrganization[]> {
    return VendorOrganizationModel.getAllVendorOrganizations();
  }

  static async getVendorOrganizationById(
    vendorOrgId: number
  ): Promise<VendorOrganization | undefined> {
    return VendorOrganizationModel.getVendorOrganizationById(vendorOrgId);
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
    return VendorOrganizationModel.createVendorOrganization(vendorOrgData);
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
    return VendorOrganizationModel.updateVendorOrganization(
      vendorOrgId,
      vendorOrgData
    );
  }

  static async deleteVendorOrganization(
    vendorOrgId: number,
    deletedBy: number
  ): Promise<boolean> {
    return VendorOrganizationModel.deleteVendorOrganization(
      vendorOrgId,
      deletedBy
    );
  }
}

export default VendorOrganizationService;
