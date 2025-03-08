import { useState, useEffect } from "react";
import { api } from "../../api/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  Edit,
  Trash2,
  Eye,
  Plus,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Job {
  jobId: string;
  title: string;
  company: string;
  location: string;
  description: string;
  requirements: string;
  salary: string;
  jobType: string;
  deadLine: string;
  applicationCount: number;
  viewCount: number;
  isActive: boolean;
  createdAt: string;
}

export default function PostedJobsPage() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalJobs, setTotalJobs] = useState(0);
  const [jobToDelete, setJobToDelete] = useState<Job | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "expired"
  >("all");

  const PAGE_SIZE = 10;

  useEffect(() => {
    fetchJobs();
  }, [currentPage, statusFilter]);

  const fetchJobs = async () => {
    try {
      setLoading(true);

      // Build query parameters
      const params = new URLSearchParams();
      params.append("page", currentPage.toString());
      params.append("limit", PAGE_SIZE.toString());

      if (statusFilter !== "all") {
        params.append("status", statusFilter);
      }

      const response = await api
        .getInstance()
        .get(`/api/jobs/employer?${params.toString()}`);

      const paginationData = response.data;

      setJobs(paginationData.data);
      setTotalPages(paginationData.totalPages);
      setTotalJobs(paginationData.total);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      toast.error("Failed to load job postings");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateJob = () => {
    navigate("/employer/create-job");
  };

  const handleEditJob = (jobId: string) => {
    navigate(`/employer/create-job?edit=${jobId}`);
  };

  const handleViewJob = (jobId: string) => {
    navigate(`/employer/jobs/${jobId}`);
  };

  const handleViewApplications = (jobId: string) => {
    navigate(`/employer/applications?jobId=${jobId}`);
  };

  const confirmDeleteJob = (job: Job) => {
    setJobToDelete(job);
    setDeleteDialogOpen(true);
  };

  const handleDeleteJob = async () => {
    if (!jobToDelete) return;

    try {
      // Ensure jobId is a number if it's stored as a string
      const jobId =
        typeof jobToDelete.jobId === "string"
          ? parseInt(jobToDelete.jobId)
          : jobToDelete.jobId;

      // Check if jobId is a valid number
      if (isNaN(jobId)) {
        toast.error("Invalid job ID");
        return;
      }

      await api.deleteJob(jobToDelete.jobId);
      setJobs(jobs.filter((job) => job.jobId !== jobToDelete.jobId));
      toast.success("Job posting deleted successfully");
      setDeleteDialogOpen(false);
      setJobToDelete(null);
    } catch (error) {
      console.error("Error deleting job:", error);
      toast.error("Failed to delete job posting");
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const getJobStatusBadge = (job: Job) => {
    const isExpired = new Date(job.deadLine) < new Date();

    if (!job.isActive) {
      return <Badge variant="destructive">Inactive</Badge>;
    } else if (isExpired) {
      return <Badge variant="outline">Expired</Badge>;
    } else {
      return <Badge variant="success">Active</Badge>;
    }
  };

  if (loading && jobs.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Posted Jobs</h1>
        <Button onClick={handleCreateJob}>
          <Plus className="mr-2 h-4 w-4" /> Post New Job
        </Button>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-wrap gap-2">
            <Button
              variant={statusFilter === "all" ? "default" : "outline"}
              onClick={() => setStatusFilter("all")}
            >
              All Jobs
            </Button>
            <Button
              variant={statusFilter === "active" ? "default" : "outline"}
              onClick={() => setStatusFilter("active")}
            >
              Active Jobs
            </Button>
            <Button
              variant={statusFilter === "expired" ? "default" : "outline"}
              onClick={() => setStatusFilter("expired")}
            >
              Expired Jobs
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Jobs List */}
      <Card>
        <CardHeader>
          <CardTitle>Job Postings ({totalJobs})</CardTitle>
        </CardHeader>
        <CardContent>
          {jobs.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">No job postings found</p>
              <Button onClick={handleCreateJob}>Post Your First Job</Button>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {jobs.map((job) => (
                  <Card key={job.jobId} className="overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row justify-between">
                        <div className="mb-4 md:mb-0">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-lg">
                              {job.title}
                            </h3>
                            {getJobStatusBadge(job)}
                          </div>
                          <p className="text-gray-600">
                            {job.location} • {job.jobType}
                          </p>
                          <p className="text-gray-600">{job.salary}</p>
                          <p className="text-gray-500 text-sm mt-2">
                            Posted on:{" "}
                            {new Date(job.createdAt).toLocaleDateString()}
                          </p>
                          <p className="text-gray-500 text-sm">
                            Deadline:{" "}
                            {new Date(job.deadLine).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex flex-col space-y-2">
                          <div className="flex items-center text-sm text-gray-500 mb-2">
                            <span className="mr-4">
                              {job.applicationCount || 0} applications
                            </span>
                            <span>{job.viewCount || 0} views</span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewJob(job.jobId)}
                            >
                              <Eye className="h-4 w-4 mr-1" /> View
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditJob(job.jobId)}
                            >
                              <Edit className="h-4 w-4 mr-1" /> Edit
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => confirmDeleteJob(job)}
                              className="text-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4 mr-1" /> Delete
                            </Button>
                          </div>
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => handleViewApplications(job.jobId)}
                            className="mt-2"
                          >
                            View Applications
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Pagination */}
              <div className="flex justify-between items-center mt-6">
                <div className="text-sm text-gray-500">
                  Showing {jobs.length} of {totalJobs} job postings
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-sm">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the job posting "
              {jobToDelete?.title}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteJob}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
