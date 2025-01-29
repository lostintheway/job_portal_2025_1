import { ICommon } from "./ICommon";

export interface ICompany extends ICommon {
  id?: number;
  name: string;
  description: string;
  location: string;
  website?: string;
  logo_url?: string;
  user_id: number;
  industry: string;
  size: string;
}
