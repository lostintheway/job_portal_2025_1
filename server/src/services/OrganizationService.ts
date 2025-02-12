import { IOrganization } from "../interfaces/IOrganization";
import { Organization } from "../models/Organization";

export class OrganizationService {
  private organizationModel: Organization;

  constructor() {
    this.organizationModel = new Organization();
  }

  async createOrganization(organizationData: IOrganization): Promise<IOrganization> {
    const existingOrganization = await this.organizationModel.findByUserId(
      organizationData.userId
    );
    if (existingOrganization) {
      throw new Error("Organization profile already exists for this user");
    }
    return this.organizationModel.create(organizationData);
  }

  async getOrgById(id: number): Promise<IOrganization | null> {
    return this.organizationModel.findById(id);
  }

  async getOrgByUserId(userId: number): Promise<IOrganization | null> {
    return this.organizationModel.findByUserId(userId);
  }

  async updateOrg(
    id: number,
    organizationData: Partial<IOrganization>
  ): Promise<IOrganization | null> {
    return this.organizationModel.update(id, organizationData);
  }
}
