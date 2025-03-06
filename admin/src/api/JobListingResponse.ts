export interface JobListingResponse {
  success: boolean;
  data: Data;
}

export interface Data {
  data: JobListingModel[];
  total: number;
  page: number;
  size: number;
}

export interface JobListingModel {
  jobId: number;
  employerId: number;
  categoryId: number;
  title: string;
  jobType: string;
  level: string;
  vacancies: number;
  employmentType: string;
  jobLocation: string;
  offeredSalary: string;
  deadLine: string;
  educationLevel: string;
  experienceRequired: string;
  otherSpecification: string;
  jobDescription: string;
  responsibilities: string;
  benefits: string;
  isPremium: boolean;
  isActive: boolean;
  viewCount: number;
  createdBy: number;
  createdDate: string;
  updatedBy?: number;
  updatedDate?: string;
  deletedBy?: number;
  deletedDate?: string;
  isDeleted: boolean;
  employerName: string;
  employerAddress: string;
  employerIndustry: string;
}
