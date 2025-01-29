import { ICompany } from "../interfaces/ICompany";
import { Company } from "../models/Company";

export class CompanyService {
  private companyModel: Company;

  constructor() {
    this.companyModel = new Company();
  }

  async createCompany(companyData: ICompany): Promise<ICompany> {
    const existingCompany = await this.companyModel.findByUserId(
      companyData.user_id
    );
    if (existingCompany) {
      throw new Error("Company profile already exists for this user");
    }
    return this.companyModel.create(companyData);
  }

  async getCompanyById(id: number): Promise<ICompany | null> {
    return this.companyModel.findById(id);
  }

  async getCompanyByUserId(userId: number): Promise<ICompany | null> {
    return this.companyModel.findByUserId(userId);
  }

  async updateCompany(
    id: number,
    companyData: Partial<ICompany>
  ): Promise<ICompany | null> {
    return this.companyModel.update(id, companyData);
  }
}
