import { ICommon } from "./ICommon";

export interface IApplication extends ICommon {
  id?: number;
  jobId: number;
  userId: number;
  status: "pending" | "reviewed" | "shortlisted" | "rejected" | "accepted";
  resumeUrl: string;
  coverLetter: string;
}
