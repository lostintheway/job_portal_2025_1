export interface JobListingQueryParams {
  page?: number;
  size?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  category?: string;
  jobType?: string;
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
