import { useState, useEffect } from "react";
import { api } from "../../api/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";

interface Application {
  applicationId: string;
  jobId: string;
  status: "pending" | "shortlisted" | "interviewed" | "rejected" | "accepted";
  jobTitle: string;
  companyName: string;
  appliedDate: string;
}

interface BookmarkedJob {
  jobId: string;
  title: string;
  company: string;
  location: string;
  bookmarkId: string;
  createdDate: string;
}

export default function JobSeekerDashboard() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [bookmarkedJobs, setBookmarkedJobs] = useState<BookmarkedJob[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [applicationsResponse, bookmarksResponse] = await Promise.all([
        api.getApplications(),
        api.getBookmarkedJobs(),
      ]);

      setApplications(applicationsResponse.data.data.data);
      setBookmarkedJobs(bookmarksResponse.data.data);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeColor = (status: Application["status"]) => {
    const colors = {
      pending: "bg-yellow-500",
      shortlisted: "bg-blue-500",
      interviewed: "bg-purple-500",
      rejected: "bg-red-500",
      accepted: "bg-green-500",
    };
    return colors[status] || "bg-gray-500";
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Applications */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {applications.length === 0 ? (
                <p className="text-gray-500">No applications yet</p>
              ) : (
                applications.map((application) => (
                  <div
                    key={application.applicationId}
                    className="border p-4 rounded-lg"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">
                          {application.jobTitle}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {application.companyName}
                        </p>
                        <p className="text-xs text-gray-400">
                          Applied:{" "}
                          {new Date(
                            application.appliedDate
                          ).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge
                        className={`${getStatusBadgeColor(
                          application.status
                        )} text-white`}
                      >
                        {application.status}
                      </Badge>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Bookmarked Jobs */}
        <Card>
          <CardHeader>
            <CardTitle>Bookmarked Jobs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {bookmarkedJobs.length === 0 ? (
                <p className="text-gray-500">No bookmarked jobs</p>
              ) : (
                bookmarkedJobs.map((job) => (
                  <div key={job.bookmarkId} className="border p-4 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{job.title}</h3>
                        <p className="text-sm text-gray-500">{job.company}</p>
                        <p className="text-xs text-gray-400">
                          Location: {job.location}
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          (window.location.href = `/jobs/${job.jobId}`)
                        }
                      >
                        View Job
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
