import { ICommon } from "./ICommon";

export interface IJob extends ICommon {
  id?: number;
  title: string;
  description: string;
  requirements: string;
  salaryRange: string;
  location: string;
  companyId: number;
  jobType: "full-time" | "part-time" | "contract" | "internship";
  experienceLevel: string;
  status: "active" | "closed";
}
