export interface JobListingQueryParams {
  page?: number;
  size?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  filters?: {
    jobType?: string;
    level?: string[];
    location?: string;
    category?: string;
    employerId?: number;
    isActive?: boolean;
    isPremium?: boolean;
    salaryRange?: {
      min?: number;
      max?: number;
    };
    deadline?: Date;
  };
}

export interface ApplicationQueryParams {
  page?: number;
  size?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  filters?: {
    status?: string[];
    userId?: number;
    jobId?: number;
  };
}

export interface PaginationParams {
  page: number;
  size: number;
}

export interface SortParams {
  sortBy: string;
  sortOrder: "asc" | "desc";
}
