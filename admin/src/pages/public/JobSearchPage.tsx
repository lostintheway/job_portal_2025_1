import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../api/api";
import { Input } from "@/components/ui/input";
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
  Search,
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

interface Job {
  jobId: string;
  title: string;
  company: string;
  location: string;
  description: string;
  jobType: string;
  deadLine: string;
  salary: string;
  categoryId: string;
  categoryName?: string;
  isBookmarked?: boolean;
}

export default function JobSearchPage() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>(
    []
  );
  const [loading, setLoading] = useState(true);

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedJobType, setSelectedJobType] = useState<string>("");
  const [selectedLocation, setSelectedLocation] = useState<string>("");

  // Unique locations derived from jobs
  const [locations, setLocations] = useState<string[]>([]);

  useEffect(() => {
    fetchJobs();
    fetchCategories();
  }, []);

  useEffect(() => {
    applyFilters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobs, searchTerm, selectedCategory, selectedJobType, selectedLocation]);

  const fetchJobs = async () => {
    try {
      const response = await api.getJobs();
      const bookmarksResponse = await api.getBookmarkedJobs();
      const bookmarkedJobIds = new Set(
        bookmarksResponse.data.data.map((job: { jobId: number }) => job.jobId)
      );

      const jobsWithBookmarks = response.data.data.map((job: Job) => ({
        ...job,
        isBookmarked: bookmarkedJobIds.has(job.jobId),
      }));

      setJobs(jobsWithBookmarks);

      // Extract unique locations
      const uniqueLocations = [
        ...jobsWithBookmarks.map((job: Job) => job.location),
      ];
      setLocations(uniqueLocations);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      toast.error("Failed to load jobs");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.getInstance().get("/api/categories");
      setCategories(response.data.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const applyFilters = () => {
    let result = [...jobs];

    // Apply search term filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (job) =>
          job.title.toLowerCase().includes(term) ||
          job.company.toLowerCase().includes(term) ||
          job.description.toLowerCase().includes(term)
      );
    }

    // Apply category filter
    if (selectedCategory) {
      result = result.filter((job) => job.categoryId === selectedCategory);
    }

    // Apply job type filter
    if (selectedJobType) {
      result = result.filter((job) => job.jobType === selectedJobType);
    }

    // Apply location filter
    if (selectedLocation) {
      result = result.filter((job) => job.location === selectedLocation);
    }

    setFilteredJobs(result);
  };

  const toggleBookmark = async (jobId: string) => {
    try {
      const job = jobs.find((j) => j.jobId === jobId);
      if (job?.isBookmarked) {
        await api.removeBookmark(jobId);
        toast.success("Job removed from bookmarks");
      } else {
        await api.addBookmark(jobId);
        toast.success("Job added to bookmarks");
      }

      setJobs(
        jobs.map((job) => {
          if (job.jobId === jobId) {
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

  const handleViewJob = (jobId: string) => {
    navigate(`/public/jobs/${jobId}`);
  };

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedCategory("");
    setSelectedJobType("");
    setSelectedLocation("");
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

        {/* Search and filters */}
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search jobs by title, company, or keywords"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <ErrorBoundary>
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filter by Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Categories</SelectItem>
                  {categories.map((category, index) => (
                    <SelectItem key={index} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </ErrorBoundary>
            <ErrorBoundary>
              <Select
                value={selectedJobType}
                onValueChange={setSelectedJobType}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Job Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Types</SelectItem>
                  <SelectItem value="full-time">Full-time</SelectItem>
                  <SelectItem value="part-time">Part-time</SelectItem>
                  <SelectItem value="contract">Contract</SelectItem>
                  <SelectItem value="internship">Internship</SelectItem>
                  <SelectItem value="remote">Remote</SelectItem>
                </SelectContent>
              </Select>
            </ErrorBoundary>
            <ErrorBoundary>
              <Select
                value={selectedLocation}
                onValueChange={setSelectedLocation}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Locations</SelectItem>
                  {locations.map((location, index) => (
                    <SelectItem key={index} value={location}>
                      {location}
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
                <p className="text-gray-500 font-medium">{job.company}</p>
              </CardHeader>

              <CardContent className="pb-2">
                <div className="flex flex-col space-y-2 mb-4">
                  <div className="flex items-center text-gray-500">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span>{job.location}</span>
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

                <p className="text-gray-700 line-clamp-3">{job.description}</p>

                {job.salary && (
                  <Badge className="mt-3 bg-green-100 text-green-800 hover:bg-green-100">
                    {job.salary}
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
    </div>
  );
}
