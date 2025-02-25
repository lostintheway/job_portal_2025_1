// import { CommonFields } from "./CommonFields";

export interface CommonFields {
  createdBy: number;
  createdDate: Date;
  updatedBy: number | null;
  updatedDate: Date | null;
  deletedBy: number | null;
  deletedDate: Date | null;
  isDeleted: boolean;
}

export interface Application extends CommonFields {
  applicationId: number;
  jobDescriptionId: number;
  userId: number;
  status: "pending" | "shortlisted" | "interviewed" | "rejected" | "accepted";
  resumeUrl: string;
  coverLetter?: string;
  expectedSalary?: string;
}

export interface Bookmark extends CommonFields {
  bookmarkId: number;
  userId: number;
  jobDescriptionId: number;
  notes?: string;
  reminderDate?: Date;
  status: "saved" | "applied" | "archived";
}

export interface Category extends CommonFields {
  categoryId: number;
  categoryName: string;
}

export interface JobDescription extends CommonFields {
  jobDescriptionId: number;
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
  otherSpecification?: string;
  jobWorkDescription: string;
}

export interface Profile extends CommonFields {
  profileId: number;
  userId: number;
  headline: string;
  summary: string | null;
  experience: string;
  education: string;
  skills: string;
  languages: string;
  isPublic: boolean;
}
export interface User extends CommonFields {
  userId: number;
  email: string;
  password: string;
  fullName: string;
  contactNumber: string;
  address: string;
  role: "jobseeker" | "vendor" | "admin";
  profileImage?: string;
}

export interface VendorOrganization extends CommonFields {
  vendorOrgId: number;
  vendorOrgName: string;
  vendorOrgAddress: string;
  vendorOrgContact: string;
  vendorOrgEmail: string;
  vendorOrgImage: string | null;
}
