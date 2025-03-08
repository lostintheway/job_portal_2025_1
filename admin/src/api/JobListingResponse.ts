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

// Define proper API response types
export interface JobResponse {
  success: boolean;
  data: JobDetails;
}

export interface BookmarkResponse {
  success: boolean;
  data: {
    data: BookmarkedJob[];
    total: number;
    page: number;
    size: number;
    totalPages: number;
  };
}

export interface BookmarkedJob {
  bookmarkId: string;
  jobId: string;
  // Other bookmark properties
}

export interface JobDetails {
  jobId: number;
  employerId: number;
  categoryId: number;
  title: string;
  jobType: "full-time" | "part-time" | "contract" | "internship" | "remote";
  level: string;
  vacancies: number;
  employmentType: string;
  jobLocation: string;
  offeredSalary: string;
  deadLine: string;
  educationLevel: string;
  experienceRequired: string;
  otherSpecification: string | null;
  jobDescription: string;
  responsibilities: string;
  benefits: string;
  isPremium: boolean;
  isActive: boolean;
  viewCount: number;
  createdBy: number;
  createdDate: string;
  updatedBy: number | null;
  updatedDate: string | null;
  deletedBy: number | null;
  deletedDate: string | null;
  isDeleted: boolean;
  // Additional fields from join
  employerName?: string;
  employerAddress?: string;
  employerIndustry?: string;
  isBookmarked?: boolean;
}

export interface ApplicationData {
  jobId: number;
  coverLetter: string;
  expectedSalary: string;
}
