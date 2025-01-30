import { ICommon } from "./ICommon";

export interface ICompany extends ICommon {
  id?: number;
  name: string;
  description: string;
  location: string;
  website: string;
  logoUrl: string;
  userId: number;
  industry: string;
  size: string;
}
