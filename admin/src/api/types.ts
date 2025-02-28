export interface AxiosResponse<T> {
  data: T;
}

export interface LoginResponse {
  success: boolean;
  data: {
    user: User;
    token: string;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}

export interface User {
  userId: number;
  email: string;
  fullName: string;
  contactNumber: string;
  address: string;
  role: "jobseeker" | "employer" | "admin";
}

export interface JobListing {
  jobId: number;
  employerId: number;
  categoryId: number;
  title: string;
  jobType: "full-time" | "part-time" | "contract" | "internship" | "remote";
  level: string;
  vacancies: number;
  employmentType: string;
  jobLocation: string;
  offeredSalary?: string;
  deadLine: string;
  educationLevel?: string;
  experienceRequired?: string;
  otherSpecification?: string;
  jobDescription: string;
  responsibilities?: string;
  benefits?: string;
  isPremium: boolean;
  isActive: boolean;
  viewCount: number;
  createdDate: string;
  updatedDate?: string;
  companyName?: string; // Joined from employer profile
  companyLogo?: string; // Joined from employer profile
}

export interface Application {
  applicationId: number;
  jobId: number;
  userId: number;
  status: "pending" | "shortlisted" | "interviewed" | "rejected" | "accepted";
  resumeUrl: string;
  coverLetter?: string;
  expectedSalary?: string;
  applicationDate: string;
  interviewDate?: string;
  interviewNotes?: string;
  rejectionReason?: string;
  createdDate: string;
  updatedDate?: string;
  jobTitle?: string; // Joined from job listing
  companyName?: string; // Joined from employer profile
}

export interface JobSeekerProfile {
  profileId: number;
  userId: number;
  headline: string;
  summary?: string;
  experience?: string;
  education?: string;
  skills?: string;
  languages?: string;
  isPublic: boolean;
  createdDate: string;
  updatedDate?: string;
}

export interface EmployerProfile {
  employerId: number;
  userId: number;
  companyName: string;
  companyAddress: string;
  companyContact: string;
  companyEmail: string;
  companyLogo?: string;
  companyDescription?: string;
  industryType?: string;
  establishedDate?: string;
  companySize?: string;
  companyWebsite?: string;
  createdDate: string;
  updatedDate?: string;
}

export interface Category {
  categoryId: number;
  categoryName: string;
  createdDate: string;
  updatedDate?: string;
}

export interface Bookmark {
  bookmarkId: number;
  userId: number;
  jobId: number;
  notes?: string;
  reminderDate?: string;
  status: "saved" | "applied" | "archived";
  createdDate: string;
  updatedDate?: string;
  jobTitle?: string; // Joined from job listing
  companyName?: string; // Joined from employer profile
}

export interface JobSearchFilters {
  keyword?: string;
  location?: string;
  category?: string;
  jobType?: string;
  salary?: string;
}
