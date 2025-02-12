import { ICommon } from "./ICommon";

export interface IUser extends ICommon {
  id?: number;
  email: string;
  password: string;
  fullName: string;
  role: "jobseeker" | "organization" | "admin";
}
