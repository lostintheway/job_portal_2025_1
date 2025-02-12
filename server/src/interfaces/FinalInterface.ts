// Base interface for common fields
export interface ICommon {
  createdBy: number;
  createdDate: Date;
  updatedBy: number;
  updatedDate: Date;
  deletedBy: number;
  deletedDate: Date;
  isDeleted: boolean;
}

// User and Profile Management
export interface IUser extends ICommon {
  userId?: number;
  email: string;
  password: string;
  fullName: string;
  contactNumber: string;
  address: string;
  role: "jobseeker" | "vendor" | "admin";
  profileImage?: string;
}

export interface IProfile extends ICommon {
  profileId?: number;
  userId: number;
  headline: string;
  summary?: string;
  experience: IExperience[];
  education: IEducation[];
  skills: string[];
  languages: ILanguage[];
  isPublic: boolean;
}

// Job Management
export interface IJobDescription extends ICommon {
  jobDescriptionId?: number;
  vendorOrgId: number;
  categoryId: number;
  jobType: string;
  level: string;
  vacancyNo: number;
  employeeType: string;
  jobLocation: string;
  offeredSalary: string;
  deadLine: Date;
  educationLevel: string;
  experienceRequired: string;
  otherSpecification: string;
  jobWorkDescription: string;
  vendorName?: string;
  categoryName?: string;
  vendorImage?: string;
}

export interface IApplication extends ICommon {
  applicationId?: number;
  jobDescriptionId: number;
  userId: number;
  status: "pending" | "shortlisted" | "interviewed" | "rejected" | "accepted";
  resumeUrl: string;
  coverLetter?: string;
  expectedSalary?: string;
}

export interface IBookmark extends ICommon {
  bookmarkId?: number;
  userId: number;
  jobDescriptionId: number;
  notes?: string;
  reminderDate?: Date;
  status: "saved" | "applied" | "archived";
}

// Organization Management
export interface IVendorOrganization extends ICommon {
  vendorOrgId?: number;
  vendorOrgName: string;
  vendorOrgAddress: string;
  vendorOrgContact: string;
  vendorOrgEmail: string;
  vendorOrgImage?: string;
}

export interface ICategory extends ICommon {
  categoryId?: number;
  categoryName: string;
}

// Supporting interfaces for Profile
interface IExperience {
  title: string;
  company: string;
  startDate: Date;
  endDate?: Date;
  current: boolean;
}

interface IEducation {
  degree: string;
  institution: string;
  graduationYear: number;
}

interface ILanguage {
  name: string;
  level: "basic" | "intermediate" | "fluent";
}

// Utility interfaces for API responses
export interface IApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
}

export interface IPaginatedResponse<T> {
  items: T[];
  totalItems: number;
  currentPage: number;
  pageSize: number;
  totalPages: number;
}

// Dashboard statistics
export interface IDashboard {
  vendorCount: number;
  jobListingCount: number;
  activeApplications?: number;
  totalUsers?: number;
}

// Search Parameters
export interface IJobSearchParams {
  categoryId?: number;
  location?: string;
  jobType?: string;
  experienceRequired?: string;
  educationLevel?: string;
  salaryRange?: {
    min?: number;
    max?: number;
  };
  page?: number;
  pageSize?: number;
}
