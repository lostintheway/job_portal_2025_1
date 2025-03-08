import { useState, useEffect } from "react";
import { api } from "../../api/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Plus, Users, Briefcase, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface Job {
  jobId: string;
  title: string;
  company: string;
  location: string;
  jobType: string;
  deadLine: string;
  applicationCount: number;
  viewCount: number;
  isActive: boolean;
}

interface Application {
  applicationId: string;
  jobId: string;
  userId: string;
  status: "pending" | "shortlisted" | "interviewed" | "accepted" | "rejected";
  applicantName: string;
  applicantEmail: string;
  createdAt: string;
}

interface ApplicationStats {
  total: number;
  pending: number;
  shortlisted: number;
  interviewed: number;
  accepted: number;
  rejected: number;
}

export default function EmployerDashboard() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applicationStats, setApplicationStats] = useState<ApplicationStats>({
    total: 0,
    pending: 0,
    shortlisted: 0,
    interviewed: 0,
    accepted: 0,
    rejected: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [jobsResponse, applicationsResponse] = await Promise.all([
        api.getJobs(),
        api.getInstance().get("/api/applications"),
      ]);

      setJobs(jobsResponse.data.data);

      // Ensure applications is an array and handle the response properly
      const applications = Array.isArray(applicationsResponse.data.data)
        ? (applicationsResponse.data.data as Application[])
        : [];

      // Calculate application statistics
      const stats = {
        total: applications.length,
        pending: applications.filter(
          (app: Application) => app.status === "pending"
        ).length,
        shortlisted: applications.filter(
          (app: Application) => app.status === "shortlisted"
        ).length,
        interviewed: applications.filter(
          (app: Application) => app.status === "interviewed"
        ).length,
        accepted: applications.filter(
          (app: Application) => app.status === "accepted"
        ).length,
        rejected: applications.filter(
          (app: Application) => app.status === "rejected"
        ).length,
      };
      setApplicationStats(stats);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateJob = () => {
    navigate("/employer/create-job");
  };

  const handleViewJob = (jobId: string) => {
    navigate(`/employer/jobs/${jobId}`);
  };

  const handleViewApplications = () => {
    navigate("/employer/applications");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // Get active and expired jobs
  const activeJobs = jobs.filter(
    (job) => job.isActive && new Date(job.deadLine) > new Date()
  );
  //   const expiredJobs = jobs.filter(job => !job.isActive || new Date(job.deadLine) <= new Date());

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Employer Dashboard</h1>
        <Button onClick={handleCreateJob}>
          <Plus className="mr-2 h-4 w-4" /> Post New Job
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-6 md:grid-cols-4 mb-8">
        <Card>
          <CardContent className="p-6 flex flex-col items-center justify-center">
            <Briefcase className="h-8 w-8 text-blue-500 mb-2" />
            <p className="text-2xl font-bold">{jobs.length}</p>
            <p className="text-gray-500">Total Job Postings</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex flex-col items-center justify-center">
            <Clock className="h-8 w-8 text-green-500 mb-2" />
            <p className="text-2xl font-bold">{activeJobs.length}</p>
            <p className="text-gray-500">Active Jobs</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex flex-col items-center justify-center">
            <Users className="h-8 w-8 text-purple-500 mb-2" />
            <p className="text-2xl font-bold">{applicationStats.total}</p>
            <p className="text-gray-500">Total Applications</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex flex-col items-center justify-center">
            <Users className="h-8 w-8 text-yellow-500 mb-2" />
            <p className="text-2xl font-bold">
              {applicationStats.shortlisted + applicationStats.interviewed}
            </p>
            <p className="text-gray-500">In Progress</p>
          </CardContent>
        </Card>
      </div>

      {/* Application Status */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>Application Status</span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleViewApplications}
            >
              View All
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-lg font-bold text-yellow-500">
                {applicationStats.pending}
              </p>
              <p className="text-sm text-gray-500">Pending</p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-lg font-bold text-blue-500">
                {applicationStats.shortlisted}
              </p>
              <p className="text-sm text-gray-500">Shortlisted</p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-lg font-bold text-purple-500">
                {applicationStats.interviewed}
              </p>
              <p className="text-sm text-gray-500">Interviewed</p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-lg font-bold text-green-500">
                {applicationStats.accepted}
              </p>
              <p className="text-sm text-gray-500">Accepted</p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-lg font-bold text-red-500">
                {applicationStats.rejected}
              </p>
              <p className="text-sm text-gray-500">Rejected</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Job Postings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>Recent Job Postings</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/employer/job-postings")}
            >
              View All
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {jobs.length === 0 ? (
            <p className="text-center text-gray-500 py-4">
              No job postings yet
            </p>
          ) : (
            <div className="space-y-4">
              {jobs.slice(0, 5).map((job) => (
                <div key={job.jobId} className="border p-4 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{job.title}</h3>
                      <p className="text-sm text-gray-500">
                        {job.location} • {job.jobType}
                      </p>
                      <p className="text-xs text-gray-400">
                        Deadline: {new Date(job.deadLine).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex flex-col items-end">
                      <div className="flex items-center text-sm text-gray-500 mb-2">
                        <Users className="h-4 w-4 mr-1" />
                        <span>{job.applicationCount || 0} applications</span>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => handleViewJob(job.jobId)}
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
