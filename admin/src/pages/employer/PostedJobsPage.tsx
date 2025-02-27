import { useState, useEffect } from "react";
import { api } from "../../api/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";

interface Job {
  jobId: string;
  title: string;
  company: string;
  location: string;
  description: string;
  requirements: string;
  salary: string;
  applications: Application[];
}

interface Application {
  applicationId: string;
  jobId: string;
  userId: string;
  status: "pending" | "reviewing" | "accepted" | "rejected";
  applicantName: string;
  applicantEmail: string;
  createdAt: string;
}

export default function PostedJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEmployerData();
  }, []);

  const fetchEmployerData = async () => {
    try {
      const [jobsResponse, applicationsResponse] = await Promise.all([
        api.getJobs(),
        api.getApplications(),
      ]);

      setJobs(jobsResponse.data);
      setApplications(applicationsResponse.data);
    } catch (error) {
      console.error("Error fetching employer data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateApplicationStatus = async (
    applicationId: string,
    newStatus: Application["status"]
  ) => {
    try {
      await api.updateApplication(applicationId, { status: newStatus });
      setApplications(
        applications.map((app) => {
          if (app.applicationId === applicationId) {
            return { ...app, status: newStatus };
          }
          return app;
        })
      );
    } catch (error) {
      console.error("Error updating application status:", error);
    }
  };

  const handleDeleteJob = async (jobId: string) => {
    if (!window.confirm("Are you sure you want to delete this job posting?"))
      return;

    try {
      await api.deleteJob(jobId);
      setJobs(jobs.filter((job) => job.jobId !== jobId));
    } catch (error) {
      console.error("Error deleting job:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const getStatusBadgeVariant = (status: Application["status"]) => {
    switch (status) {
      case "accepted":
        return "success";
      case "rejected":
        return "destructive";
      case "reviewing":
        return "warning";
      default:
        return "secondary";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Employer Dashboard</h1>
        <Button onClick={() => (window.location.href = "/jobs/new")}>
          Post New Job
        </Button>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <h2 className="text-xl font-semibold mb-4">Your Job Postings</h2>
          <div className="space-y-4">
            {jobs.map((job) => (
              <Card key={job.jobId}>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold">{job.title}</h3>
                    <div className="space-x-2">
                      <Button
                        variant="ghost"
                        onClick={() =>
                          (window.location.href = `/jobs/${job.jobId}/edit`)
                        }
                      >
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => handleDeleteJob(job.jobId)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                  <p className="text-gray-600">{job.location}</p>
                  <p className="text-gray-600">{job.salary}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Recent Applications</h2>
          <div className="space-y-4">
            {applications.map((application) => (
              <Card key={application.applicationId}>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold">
                        {application.applicantName}
                      </h3>
                      <p className="text-gray-600">
                        {application.applicantEmail}
                      </p>
                    </div>
                    <Badge variant={getStatusBadgeVariant(application.status)}>
                      {application.status.charAt(0).toUpperCase() +
                        application.status.slice(1)}
                    </Badge>
                  </div>
                  <Select
                    value={application.status}
                    onValueChange={(value) =>
                      handleUpdateApplicationStatus(
                        application.applicationId,
                        value as Application["status"]
                      )
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="reviewing">Reviewing</SelectItem>
                      <SelectItem value="accepted">Accepted</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
