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
import { Badge } from "@/components/ui/badge";
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
} from "@/components/ui/pagination";
import { JobListingModel } from "@/api/JobListingResponse";

export default function JobSearchPage() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<JobListingModel[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<JobListingModel[]>([]);
  const [categories, setCategories] = useState<
    { categoryId: string; categoryName: string }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  // Search and filter states
  const [selectedCategory, setSelectedCategory] = useState<number>(0);
  const [selectedJobType, setSelectedJobType] = useState<string>("all");

  const fetchJobsByPageAndSize = useCallback(async () => {
    try {
      const response = await api.getJobsByPageAndSize(page, 10);
      const bookmarksResponse = await api.getBookmarkedJobs();
      const bookmarkedJobIds = new Set(
        bookmarksResponse.data.data.map((job: { jobId: number }) => job.jobId)
      );

      const jobsWithBookmarks = response.data.data.data.map(
        (job: JobListingModel) => ({
          ...job,
          isBookmarked: bookmarkedJobIds.has(job.jobId),
        })
      );

      setJobs(jobsWithBookmarks);
      setTotal(response.data.data.total);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      toast.error("Failed to load jobs");
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchJobsByPageAndSize();
    fetchCategories();
  }, [fetchJobsByPageAndSize]);

  useEffect(() => {
    applyFilters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobs, selectedCategory, selectedJobType]);

  const fetchCategories = async () => {
    try {
      const response = await api.getInstance().get("/api/categories");
      const categories = response.data.data;
      setCategories(categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const [jobTypes, setJobTypes] = useState<string[]>([]);

  useEffect(() => {
    const uniqueJobTypes = [...new Set(jobs.map((job) => job.jobType))];
    setJobTypes(uniqueJobTypes);
  }, [jobs]);

  const applyFilters = () => {
    let result = [...jobs];

    // Apply category filter
    if (
      selectedCategory &&
      selectedCategory !== 0 &&
      // @ts-expect-error - all is a string
      selectedCategory !== "all"
    ) {
      result = result.filter((job) => job.categoryId === selectedCategory);
    }

    // Apply job type filter
    if (selectedJobType && selectedJobType !== "all") {
      result = result.filter((job) => job.jobType === selectedJobType);
    }

    setFilteredJobs(result);
  };

  const toggleBookmark = async (jobId: number) => {
    try {
      const job = jobs.find((j) => j.jobId === jobId);
      // @ts-expect-error - all is a string
      if (job?.isBookmarked) {
        // @ts-expect-error - all is a string
        await api.removeBookmark(jobId);
        toast.success("Job removed from bookmarks");
      } else {
        // @ts-expect-error - all is a string
        await api.addBookmark(jobId);
        toast.success("Job added to bookmarks");
      }

      setJobs(
        jobs.map((job) => {
          if (job.jobId === jobId) {
            // @ts-expect-error - all is a string
            return { ...job, isBookmarked: !job.isBookmarked };
          }
          return job;
        })
      );
    } catch (error) {
      console.error("Error toggling bookmark:", error);
      toast.error("Failed to update bookmark");
    }
  };

  const handleViewJob = (jobId: number) => {
    navigate(`/public/jobs/${jobId}`);
  };

  const resetFilters = () => {
    setSelectedCategory(0);
    setSelectedJobType("all");
  };

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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-6">Find Your Perfect Job</h1>

        {JSON.stringify({ jobs })}
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <ErrorBoundary>
              <Select
                value={(selectedCategory || "all").toString()}
                onValueChange={(val) => {
                  setSelectedCategory(Number(val));
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filter by Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={"all"}>All Categories</SelectItem>
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
                value={(selectedJobType || "all").toString()}
                onValueChange={(val) => {
                  setSelectedJobType(val);
                }}
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
          {filteredJobs.length} {filteredJobs.length === 1 ? "job" : "jobs"}{" "}
          found
        </p>
      </div>
      {/* Job listings */}
      {filteredJobs.length === 0 ? (
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
          {filteredJobs.map((job) => (
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
                  <Badge className="mt-3 bg-green-100 text-green-800 hover:bg-green-100">
                    {job.offeredSalary}
                  </Badge>
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
                  {/* @ts-expect-error - all is a string */}
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
      <Pagination>
        <PaginationContent>
          {[...Array(Math.ceil(total / 10)).keys()].map((page) => (
            <PaginationItem key={page}>
              <PaginationLink
                isActive={page === page}
                onClick={() => setPage(page)}
              >
                {page + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
          {page < Math.ceil(total / 10) - 1 && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}
          <PaginationItem>
            <PaginationNext
              aria-disabled={page >= Math.ceil(total / 10) - 1}
              onClick={() => setPage(page + 1)}
              className={page >= Math.ceil(total / 10) - 1 ? "disabled" : ""}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
