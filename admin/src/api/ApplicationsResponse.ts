export interface ApplicationsResponse {
  success: boolean;
  data: Application[];
}

export interface Application {
  applicationId: number;
  jobId: number;
  userId: number;
  status: string;
  resumeUrl: string;
  coverLetter: string;
  expectedSalary: string;
  applicationDate: string;
  interviewDate: null | string;
  interviewNotes: null | string;
  rejectionReason: null | string;
  createdBy: number;
  createdDate: string;
  updatedBy: null;
  updatedDate: null;
  deletedBy: null;
  deletedDate: null;
  isDeleted: boolean;
  jobDescription: string;
  jobTitle: string;
  jobLocation: string;
  jobType: string;
  offeredSalary: string;
}
