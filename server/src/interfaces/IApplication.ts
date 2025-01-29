import { ICommon } from "./ICommon";

export interface IApplication extends ICommon {
  id?: number;
  job_id: number;
  user_id: number;
  status: "pending" | "reviewed" | "shortlisted" | "rejected" | "accepted";
  resume_url: string;
  cover_letter?: string;
}
