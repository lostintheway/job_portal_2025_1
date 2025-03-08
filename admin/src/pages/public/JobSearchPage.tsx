import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../api/api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Bookmark,
  BookmarkCheck,
  MapPin,
  Briefcase,
  Calendar,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import ErrorBoundary from "@/components/ErrorBoundary";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { JobListingModel } from "@/api/JobListingResponse";

// Define filter state interface
interface FilterState {
  category?: string;
  jobType?: string;
}

export default function JobSearchPage() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<JobListingModel[]>([]);
  const [categories, setCategories] = useState<
    { categoryId: string; categoryName: string }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const pageSize = 9; // Fixed page size

  // Search and filter states
  const [filters, setFilters] = useState<FilterState>({
    category: "all",
    jobType: "all",
  });
  const [jobTypes, setJobTypes] = useState<string[]>([]);

  // Fetch jobs with filters applied
  const fetchJobs = useCallback(async () => {
    setLoading(true);
    try {
      // Prepare filter parameters for API call
      const apiFilters: {
        keyword?: string;
        location?: string;
        category?: string;
        jobType?: string;
        salary?: string;
        page?: string;
        size?: string;
      } = {};

      if (filters.category && filters.category !== "all") {
        apiFilters.category = filters.category;
      }

      if (filters.jobType && filters.jobType !== "all") {
        apiFilters.jobType = filters.jobType;
      }

      // If we have filters, use searchJobs API, otherwise use pagination API
      let response;
      if (Object.keys(apiFilters).length > 0) {
        apiFilters.page = page.toString();
        apiFilters.size = pageSize.toString();
        response = await api.searchJobs(apiFilters);
      } else {
        response = await api.getJobsByPageAndSize(page, pageSize);
      }

      // Get bookmarked jobs to mark them in the UI
      const bookmarksResponse = await api.getBookmarkedJobs();
      const bookmarkedJobIds = new Set(
        bookmarksResponse.data.data.map((job: { jobId: number }) => job.jobId)
      );

      // Add isBookmarked flag to each job
      const jobsWithBookmarks = response.data.data.data.map(
        (job: JobListingModel) => ({
          ...job,
          isBookmarked: bookmarkedJobIds.has(job.jobId),
        })
      );

      setJobs(jobsWithBookmarks);
      setTotal(response.data.data.total);

      // Extract unique job types for the filter dropdown
      const uniqueJobTypes = [
        ...new Set(
          jobsWithBookmarks.map((job: JobListingModel) => job.jobType)
        ),
      ];
      setJobTypes(uniqueJobTypes as string[]);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to load jobs"
      );
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, filters]);

  // Fetch categories for the filter dropdown
  const fetchCategories = useCallback(async () => {
    try {
      const response = await api.getInstance().get("/api/categories");
      const categoriesData = response.data.data.map(
        (category: { categoryId: string; categoryName: string }) => ({
          ...category,
          categoryId: category.categoryId.toString(),
        })
      );
      setCategories(categoriesData);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to load categories"
      );
    }
  }, []);

  // Initial data loading
  useEffect(() => {
    fetchJobs();
    fetchCategories();
  }, [fetchJobs, fetchCategories]);

  // Handle category filter change
  const handleCategoryChange = (value: string) => {
    setFilters((prev: FilterState) => ({ ...prev, category: value }));
    setPage(1); // Reset to first page when filter changes
  };

  // Handle job type filter change
  const handleJobTypeChange = (value: string) => {
    setFilters((prev: FilterState) => ({ ...prev, jobType: value }));
    setPage(1); // Reset to first page when filter changes
  };

  // Reset all filters
  const resetFilters = () => {
    setFilters({ category: "all", jobType: "all" });
    setPage(1); // Reset to first page
  };

  // Toggle bookmark status for a job
  const toggleBookmark = async (jobId: number) => {
    try {
      const job = jobs.find((j) => j.jobId === jobId);
      if (job?.isBookmarked) {
        await api.removeBookmark(jobId.toString());
        toast.success("Job removed from bookmarks");
      } else {
        await api.addBookmark(jobId.toString());
        toast.success("Job added to bookmarks");
      }

      // Update local state to reflect bookmark change
      setJobs(
        jobs.map((job) => {
          if (job.jobId === jobId) {
            return { ...job, isBookmarked: !job.isBookmarked };
          }
          return job;
        })
      );
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update bookmark"
      );
    }
  };

  // Navigate to job details page
  const handleViewJob = (jobId: number) => {
    navigate(`/jobs/${jobId}`);
  };

  // Loading state UI
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 flex flex-col gap-4">
          <Skeleton className="h-10 w-full" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <Skeleton className="h-6 w-3/4 mb-4" />
                <Skeleton className="h-4 w-1/2 mb-2" />
                <Skeleton className="h-4 w-1/3 mb-2" />
                <Skeleton className="h-20 w-full mb-4" />
                <div className="flex justify-between">
                  <Skeleton className="h-10 w-24" />
                  <Skeleton className="h-10 w-10" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Calculate total pages for pagination
  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 bg-transparent">
        <h1 className="text-3xl font-bold mb-6">Find Your Perfect Job</h1>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <ErrorBoundary>
              <Select
                value={filters.category}
                onValueChange={handleCategoryChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filter by Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category, index) => (
                    <SelectItem key={index} value={category.categoryId}>
                      {category.categoryName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </ErrorBoundary>
            <ErrorBoundary>
              <Select
                value={filters.jobType || "all"}
                onValueChange={handleJobTypeChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Job Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {jobTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </ErrorBoundary>

            <Button variant="outline" onClick={resetFilters}>
              Reset Filters
            </Button>
          </div>
        </div>
      </div>

      {/* Results count */}
      <div className="mb-4">
        <p className="text-gray-500">
          {total} {total === 1 ? "job" : "jobs"} found
        </p>
      </div>

      {/* Job listings */}
      {jobs.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-gray-500 mb-2">
              No jobs match your search criteria
            </p>
            <Button variant="outline" onClick={resetFilters}>
              Clear Filters
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {jobs.map((job) => (
            <Card key={job.jobId} className="overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">{job.title}</CardTitle>
                <p className="text-gray-500 font-medium">{job.employerName}</p>
              </CardHeader>

              <CardContent className="pb-2">
                <div className="flex flex-col space-y-2 mb-4">
                  <div className="flex items-center text-gray-500">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span>{job.employerAddress}</span>
                  </div>
                  <div className="flex items-center text-gray-500">
                    <Briefcase className="h-4 w-4 mr-2" />
                    <span>{job.jobType}</span>
                  </div>
                  <div className="flex items-center text-gray-500">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>
                      Deadline: {new Date(job.deadLine).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <p className="text-gray-700 line-clamp-3">
                  {job.jobDescription}
                </p>

                {job.offeredSalary && (
                  <div className="mt-3 inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-green-100 text-green-800 hover:bg-green-100">
                    {job.offeredSalary}
                  </div>
                )}
              </CardContent>

              <CardFooter className="flex justify-between pt-2">
                <Button onClick={() => handleViewJob(job.jobId)}>
                  View Details
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => toggleBookmark(job.jobId)}
                  className="text-yellow-500"
                >
                  {job.isBookmarked ? (
                    <BookmarkCheck className="h-5 w-5" />
                  ) : (
                    <Bookmark className="h-5 w-5" />
                  )}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setPage(Math.max(1, page - 1))}
                  aria-disabled={page === 1}
                  className={page === 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>

              {/* Show first page */}
              {page > 3 && (
                <PaginationItem>
                  <PaginationLink onClick={() => setPage(1)}>1</PaginationLink>
                </PaginationItem>
              )}

              {/* Show ellipsis if needed */}
              {page > 4 && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}

              {/* Show pages around current page */}
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                // Calculate the page number to display
                let pageNum;
                if (page <= 3) {
                  // If near the start, show first 5 pages
                  pageNum = i + 1;
                } else if (page >= totalPages - 2) {
                  // If near the end, show last 5 pages
                  pageNum = totalPages - 4 + i;
                } else {
                  // Otherwise show 2 before and 2 after current page
                  pageNum = page - 2 + i;
                }

                // Only show if the page number is valid
                if (pageNum > 0 && pageNum <= totalPages) {
                  return (
                    <PaginationItem key={pageNum}>
                      <PaginationLink
                        isActive={page === pageNum}
                        onClick={() => setPage(pageNum)}
                      >
                        {pageNum}
                      </PaginationLink>
                    </PaginationItem>
                  );
                }
                return null;
              })}

              {/* Show ellipsis if needed */}
              {page < totalPages - 3 && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}

              {/* Show last page */}
              {page < totalPages - 2 && (
                <PaginationItem>
                  <PaginationLink onClick={() => setPage(totalPages)}>
                    {totalPages}
                  </PaginationLink>
                </PaginationItem>
              )}

              <PaginationItem>
                <PaginationNext
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  aria-disabled={page === totalPages}
                  className={
                    page === totalPages ? "pointer-events-none opacity-50" : ""
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
