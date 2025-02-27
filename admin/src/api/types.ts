export interface AxiosResponse<T> {
  data: T;
}

export interface LoginResponse {
  success: boolean;
  data: Data;
}

interface Data {
  user: User;
  token: string;
}

interface User {
  userId: number;
  email: string;
  fullName: string;
  contactNumber: string;
  address: string;
  role: string;
}
