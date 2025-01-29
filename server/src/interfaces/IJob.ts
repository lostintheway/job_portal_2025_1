import { ICommon } from "./ICommon";

export interface IJob extends ICommon {
  id?: number;
  title: string;
  description: string;
  requirements: string;
  salary_range: string;
  location: string;
  company_id: number;
  job_type: "full-time" | "part-time" | "contract" | "internship";
  experience_level: string;
  status: "active" | "closed";
}
