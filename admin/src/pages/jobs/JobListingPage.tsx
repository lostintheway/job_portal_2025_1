import { useState, useEffect } from "react";
import { api } from "../../api/api";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Star } from "lucide-react";

interface Job {
  jobId: string;
  title: string;
  company: string;
  location: string;
  description: string;
  requirements: string;
  salary: string;
  isBookmarked?: boolean;
}

export default function JobListingPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await api.getJobs();
      const bookmarksResponse = await api.getBookmarkedJobs();
      const bookmarkedJobIds = new Set(
        bookmarksResponse.data.map((job: Job) => job.jobId)
      );

      const jobsWithBookmarks = response.data.map((job: Job) => ({
        ...job,
        isBookmarked: bookmarkedJobIds.has(job.jobId),
      }));

      setJobs(jobsWithBookmarks);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const toggleBookmark = async (jobId: string) => {
    try {
      const job = jobs.find((j) => j.jobId === jobId);
      if (job?.isBookmarked) {
        await api.removeBookmark(jobId);
      } else {
        await api.addBookmark(jobId);
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
    }
  };

  const filteredJobs = jobs.filter(
    (job) =>
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
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
                  <Skeleton className="h-10 w-24" />
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
      <div className="mb-6">
        <Input
          type="text"
          placeholder="Search jobs by title, company, or location"
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredJobs.map((job) => (
          <Card key={job.jobId}>
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
              <h2 className="text-xl font-semibold text-foreground">
                {job.title}
              </h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => toggleBookmark(job.jobId)}
              >
                <Star
                  className={
                    job.isBookmarked
                      ? "fill-yellow-500 text-yellow-500"
                      : "text-muted-foreground"
                  }
                />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <p className="text-muted-foreground">{job.company}</p>
                <p className="text-muted-foreground">{job.location}</p>
                <p className="text-muted-foreground">{job.salary}</p>
              </div>
              <p className="text-muted-foreground line-clamp-3">
                {job.description}
              </p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                variant="ghost"
                onClick={() => (window.location.href = `/jobs/${job.jobId}`)}
              >
                View Details
              </Button>
              <Button
                onClick={() =>
                  (window.location.href = `/jobs/${job.jobId}/apply`)
                }
              >
                Apply Now
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {filteredJobs.length === 0 && (
        <div className="text-center text-muted-foreground mt-8">
          No jobs found matching your search criteria.
        </div>
      )}
    </div>
  );
}
