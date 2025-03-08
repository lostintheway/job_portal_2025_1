import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../../api/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Bookmark, BookmarkCheck } from "lucide-react";
import { toast } from "sonner";
import { ApplicationData, JobDetails } from "@/api/JobListingResponse";

export default function JobDetailPage() {
  const { jobId } = useParams<{ jobId: string }>();
  // console.log({ jobId });
  const navigate = useNavigate();
  const [job, setJob] = useState<JobDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [application, setApplication] = useState<ApplicationData>({
    resumeUrl: "",
    coverLetter: "",
    expectedSalary: "",
  });

  useEffect(() => {
    if (jobId) {
      fetchJobDetails(jobId);
    }
  }, [jobId]);

  const fetchJobDetails = async (id: string) => {
    setLoading(true);
    try {
      // Fetch job details
      const response = await api.getJobById(id);
      const jobResponse = response.data.data;
      setJob(jobResponse);
      // Fetch bookmarks to check if this job is bookmarked
      // const bookmarksResponse = await api.getBookmarkedJobs();
      // const bookmarksData = bookmarksResponse.data;

      // Check if this job is in the user's bookmarks
      // const bookmarkedJobIds = new Set(
      //   bookmarksData.data.data.map((bookmark) => bookmark.jobId)
      // );

      // Set job with bookmark status
      // setJob({
      //   ...jobResponse,
      //   isBookmarked: bookmarkedJobIds.has(id),
      // });
    } catch (error) {
      console.error("Error fetching job details:", error);
      toast.error("Failed to load job details");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setApplication((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobId) return;

    try {
      setApplying(true);
      await api.applyForJob(jobId, application);
      toast.success("Application submitted successfully!");
      navigate("/applications");
    } catch (error) {
      console.error("Error applying for job:", error);
      toast.error("Failed to submit application");
    } finally {
      setApplying(false);
    }
  };

  const toggleBookmark = async () => {
    if (!job || !jobId) return;

    try {
      if (job.isBookmarked) {
        await api.removeBookmark(jobId);
        toast.success("Job removed from bookmarks");
      } else {
        await api.addBookmark(jobId);
        toast.success("Job added to bookmarks");
      }

      setJob({
        ...job,
        isBookmarked: !job.isBookmarked,
      });
    } catch (error) {
      console.error("Error toggling bookmark:", error);
      toast.error("Failed to update bookmark");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-6">
            <p className="text-center text-gray-500">Job not found</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader className="flex flex-row items-start justify-between">
          <div>
            <CardTitle className="text-2xl">{job.title}</CardTitle>
            <p className="text-gray-500 mt-1">
              {job.employerName || "Company"} • {job.jobLocation}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleBookmark}
            className="text-yellow-500"
          >
            {job.isBookmarked ? (
              <BookmarkCheck className="h-6 w-6" />
            ) : (
              <Bookmark className="h-6 w-6" />
            )}
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Job Details</h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm font-medium">Salary</p>
                <p className="text-gray-500">
                  {job.offeredSalary || "Not specified"}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Job Type</p>
                <p className="text-gray-500">{job.jobType}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Level</p>
                <p className="text-gray-500">{job.level}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Vacancies</p>
                <p className="text-gray-500">{job.vacancies}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Employment Type</p>
                <p className="text-gray-500">{job.employmentType}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Application Deadline</p>
                <p className="text-gray-500">{formatDate(job.deadLine)}</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Description</h3>
            <p className="text-gray-700 whitespace-pre-line">
              {job.jobDescription}
            </p>
          </div>

          {job.responsibilities && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Responsibilities</h3>
              <p className="text-gray-700 whitespace-pre-line">
                {job.responsibilities}
              </p>
            </div>
          )}

          {job.experienceRequired && (
            <div>
              <h3 className="text-lg font-semibold mb-2">
                Experience Required
              </h3>
              <p className="text-gray-700">{job.experienceRequired}</p>
            </div>
          )}

          {job.educationLevel && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Education Required</h3>
              <p className="text-gray-700">{job.educationLevel}</p>
            </div>
          )}

          {job.benefits && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Benefits</h3>
              <p className="text-gray-700 whitespace-pre-line">
                {job.benefits}
              </p>
            </div>
          )}

          <div className="pt-6 border-t">
            <h3 className="text-xl font-semibold mb-4">
              Apply for this position
            </h3>
            <form onSubmit={handleApply} className="space-y-4">
              <div>
                <Label htmlFor="resumeUrl">Resume URL</Label>
                <Input
                  id="resumeUrl"
                  name="resumeUrl"
                  placeholder="Link to your resume"
                  value={application.resumeUrl}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="coverLetter">Cover Letter</Label>
                <Textarea
                  id="coverLetter"
                  name="coverLetter"
                  placeholder="Write your cover letter here"
                  value={application.coverLetter}
                  onChange={handleInputChange}
                  className="min-h-[150px]"
                  required
                />
              </div>
              <div>
                <Label htmlFor="expectedSalary">Expected Salary</Label>
                <Input
                  id="expectedSalary"
                  name="expectedSalary"
                  placeholder="Your expected salary"
                  value={application.expectedSalary}
                  onChange={handleInputChange}
                />
              </div>
              <Button type="submit" className="w-full" disabled={applying}>
                {applying ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Application"
                )}
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
