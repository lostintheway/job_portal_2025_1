import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../../api/api";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, ArrowLeft, Edit, Trash2, Users, Eye } from "lucide-react";
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
  jobId: number;
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
  level: string;
  vacancies: number;
  employmentType: string;
  jobLocation: string;
  offeredSalary: string;
  categoryId: number;
  categoryName: string;
  educationLevel: string;
  experienceRequired: string;
  otherSpecification: string;
  responsibilities: string;
  benefits: string;
  isPremium: boolean;
  createdBy: number;
  createdDate: string;
  updatedBy: number | null;
  updatedDate: string | null;
  deletedBy: number | null;
  deletedDate: string | null;
  isDeleted: boolean;
}

export default function EmployerJobDetailPage() {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    fetchJobDetails();
  }, [jobId]);

  const fetchJobDetails = async () => {
    if (!jobId) return;

    try {
      setLoading(true);
      const response = await api.getInstance().get(`/api/jobs/${jobId}`);
      setJob(response.data.data);
    } catch (error) {
      console.error("Error fetching job details:", error);
      toast.error("Failed to load job details");
    } finally {
      setLoading(false);
    }
  };

  const handleEditJob = () => {
    if (job) {
      navigate(`/employer/create-job?edit=${job.jobId}`);
    }
  };

  const confirmDeleteJob = () => {
    setDeleteDialogOpen(true);
  };

  const handleDeleteJob = async () => {
    if (!job) return;

    try {
      const id = job.jobId;

      if (isNaN(Number(id))) {
        toast.error("Invalid job ID");
        return;
      }

      await api.deleteJob(job.jobId);
      toast.success("Job posting deleted successfully");
      setDeleteDialogOpen(false);
      navigate("/employer/job-postings");
    } catch (error) {
      console.error("Error deleting job:", error);
      toast.error("Failed to delete job posting");
    }
  };

  const handleViewApplications = () => {
    if (job) {
      navigate(`/employer/applications?jobId=${job.jobId}`);
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
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
        <div className="text-center py-8">
          <h2 className="text-2xl font-bold mb-4">Job Not Found</h2>
          <p className="text-gray-500 mb-4">
            The job posting you're looking for doesn't exist or has been
            removed.
          </p>
          <Button onClick={() => navigate("/employer/job-postings")}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Job Postings
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button
          variant="outline"
          onClick={() => navigate("/employer/job-postings")}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Job Postings
        </Button>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-3xl font-bold">{job.title}</h1>
            <div className="flex items-center mt-2 space-x-2">
              {getJobStatusBadge(job)}
              <Badge variant="secondary">{job.jobType}</Badge>
              <Badge variant="outline">{job.categoryName}</Badge>
            </div>
          </div>

          <div className="flex space-x-2 mt-4 md:mt-0">
            <Button variant="outline" onClick={handleEditJob}>
              <Edit className="mr-2 h-4 w-4" /> Edit
            </Button>
            <Button
              variant="outline"
              onClick={confirmDeleteJob}
              className="text-red-600 hover:bg-red-50"
            >
              <Trash2 className="mr-2 h-4 w-4" /> Delete
            </Button>
            <Button onClick={handleViewApplications}>
              <Users className="mr-2 h-4 w-4" /> View Applications
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Job Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold">Description</h3>
                <div className="mt-2 text-gray-700 whitespace-pre-line">
                  {job.description}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold">Responsibilities</h3>
                <div className="mt-2 text-gray-700 whitespace-pre-line">
                  {job.responsibilities}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold">Requirements</h3>
                <div className="mt-2 text-gray-700 whitespace-pre-line">
                  {job.requirements}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold">Benefits</h3>
                <div className="mt-2 text-gray-700 whitespace-pre-line">
                  {job.benefits}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Job Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Location</p>
                <p className="font-medium">{job.location || job.jobLocation}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Salary</p>
                <p className="font-medium">{job.salary || job.offeredSalary}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Level</p>
                <p className="font-medium">{job.level}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Vacancies</p>
                <p className="font-medium">{job.vacancies}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Employment Type</p>
                <p className="font-medium">{job.employmentType}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Application Deadline</p>
                <p className="font-medium">{formatDate(job.deadLine)}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Posted On</p>
                <p className="font-medium">{formatDate(job.createdAt)}</p>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4 flex justify-between">
              <div className="flex items-center text-sm text-gray-500">
                <Eye className="h-4 w-4 mr-1" />
                <span>{job.viewCount || 0} views</span>
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <Users className="h-4 w-4 mr-1" />
                <span>{job.applicationCount || 0} applications</span>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the job posting "{job.title}"?
              This action cannot be undone.
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
