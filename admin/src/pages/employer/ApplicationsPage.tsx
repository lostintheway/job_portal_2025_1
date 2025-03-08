import { useState, useEffect, useCallback } from "react";
import { api } from "../../api/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Loader2, ChevronLeft, ChevronRight, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface Job {
  jobId: string;
  title: string;
  company: string;
  location: string;
  description: string;
  requirements: string;
  salary: string;
}

interface Application {
  applicationId: string;
  jobId: string;
  userId: string;
  status: "pending" | "shortlisted" | "interviewed" | "accepted" | "rejected";
  applicantName: string;
  applicantEmail: string;
  createdAt: string;
  resume?: {
    education: string;
    experience: string;
    skills: string;
  };
  job?: Job;
}

interface PaginationResponse {
  data: Application[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function ApplicationsPage() {
  const navigate = useNavigate();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalApplications, setTotalApplications] = useState(0);
  const [viewingApplication, setViewingApplication] =
    useState<Application | null>(null);

  const PAGE_SIZE = 10;

  const fetchApplications = useCallback(async () => {
    try {
      setLoading(true);

      // Build query parameters
      const params = new URLSearchParams();
      params.append("page", currentPage.toString());
      params.append("limit", PAGE_SIZE.toString());

      if (selectedStatus !== "all") {
        params.append("status", selectedStatus);
      }

      const response = await api
        .getInstance()
        .get(`/api/applications?${params.toString()}`);

      const paginationData = response.data.data.data;

      setApplications(paginationData);
      setTotalPages(paginationData.totalPages);
      setTotalApplications(paginationData.total);
    } catch (error) {
      console.error("Error fetching applications:", error);
      toast.error("Failed to load applications");
    } finally {
      setLoading(false);
    }
  }, [currentPage, PAGE_SIZE, selectedStatus]);

  useEffect(() => {
    fetchApplications();
  }, [selectedStatus, currentPage, fetchApplications]);

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
      toast.success(`Application status updated to ${newStatus}`);
    } catch (error) {
      console.error("Error updating application status:", error);
      toast.error("Failed to update application status");
    }
  };

  const handleViewApplicantProfile = async (application: Application) => {
    setViewingApplication(application);

    // If we don't have resume data yet, fetch it
    if (!application.resume) {
      try {
        const response = await api
          .getInstance()
          .get(`/api/jobseeker-profile/${application.userId}`);

        const updatedApplication = {
          ...application,
          resume: response.data.data,
        };

        setViewingApplication(updatedApplication);

        // Update in the applications array too
        setApplications(
          applications.map((app) => {
            if (app.applicationId === application.applicationId) {
              return updatedApplication;
            }
            return app;
          })
        );
      } catch (error) {
        console.error("Error fetching applicant profile:", error);
        toast.error("Failed to load applicant profile");
      }
    }
  };

  const getStatusBadgeVariant = (status: Application["status"]) => {
    switch (status) {
      case "accepted":
        return "success";
      case "rejected":
        return "destructive";
      case "interviewed":
        return "warning";
      case "shortlisted":
        return "secondary";
      default:
        return "default";
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  if (loading && applications.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Applications Management</h1>
        <div className="flex space-x-4">
          <Button onClick={() => navigate("/employer/job-postings")}>
            View Job Postings
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filter Applications</CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <Select
              value={selectedStatus}
              onValueChange={(value) => {
                setSelectedStatus(value);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-full md:w-64">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="shortlisted">Shortlisted</SelectItem>
                <SelectItem value="interviewed">Interviewed</SelectItem>
                <SelectItem value="accepted">Accepted</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Applications List */}
      <Card>
        <CardHeader>
          {/* also show current status   */}
          <CardTitle>
            Applications ({selectedStatus === "all" ? "All" : selectedStatus})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {applications.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No applications found</p>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {applications?.map((application) => (
                  <Card
                    key={application.applicationId}
                    className="overflow-hidden"
                  >
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row justify-between">
                        <div className="mb-4 md:mb-0">
                          <h3 className="font-semibold text-lg">
                            {application.applicantName}
                          </h3>
                          <p className="text-gray-600">
                            {application.applicantEmail}
                          </p>
                          <p className="text-gray-500 text-sm">
                            Applied on:{" "}
                            {new Date(
                              application.createdAt
                            ).toLocaleDateString()}
                          </p>
                          <p className="text-gray-500 text-sm mt-2">
                            Job: {application.job?.title || "Unknown Job"}
                          </p>
                        </div>
                        <div className="flex flex-col items-start md:items-end space-y-2">
                          <Badge
                            variant={getStatusBadgeVariant(application.status)}
                          >
                            {application.status.charAt(0).toUpperCase() +
                              application.status.slice(1)}
                          </Badge>
                          <div className="flex space-x-2 mt-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                handleViewApplicantProfile(application)
                              }
                            >
                              <Eye className="h-4 w-4 mr-1" /> View Profile
                            </Button>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4">
                        <label className="block text-sm font-medium mb-1">
                          Update Status
                        </label>
                        <Select
                          value={application.status}
                          onValueChange={(value) =>
                            handleUpdateApplicationStatus(
                              application.applicationId,
                              value as Application["status"]
                            )
                          }
                        >
                          <SelectTrigger className="w-full md:w-48">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="shortlisted">
                              Shortlisted
                            </SelectItem>
                            <SelectItem value="interviewed">
                              Interviewed
                            </SelectItem>
                            <SelectItem value="accepted">Accepted</SelectItem>
                            <SelectItem value="rejected">Rejected</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Pagination */}
              <div className="flex justify-between items-center mt-6">
                <div className="text-sm text-gray-500">
                  Showing {applications.length} of {totalApplications}{" "}
                  applications
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

      {/* Applicant Profile Modal */}
      {viewingApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <CardHeader className="sticky top-0 bg-white z-10">
              <div className="flex justify-between items-center">
                <CardTitle>Applicant Profile</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setViewingApplication(null)}
                >
                  Close
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold">
                  {viewingApplication.applicantName}
                </h3>
                <p className="text-gray-600">
                  {viewingApplication.applicantEmail}
                </p>
              </div>

              {viewingApplication.resume ? (
                <>
                  {viewingApplication.resume.education && (
                    <div>
                      <h3 className="text-md font-semibold">Education</h3>
                      <p className="text-gray-700 whitespace-pre-line">
                        {viewingApplication.resume.education}
                      </p>
                    </div>
                  )}

                  {viewingApplication.resume.experience && (
                    <div>
                      <h3 className="text-md font-semibold">Experience</h3>
                      <p className="text-gray-700 whitespace-pre-line">
                        {viewingApplication.resume.experience}
                      </p>
                    </div>
                  )}

                  {viewingApplication.resume.skills && (
                    <div>
                      <h3 className="text-md font-semibold">Skills</h3>
                      <p className="text-gray-700 whitespace-pre-line">
                        {viewingApplication.resume.skills}
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex justify-center items-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              )}

              <div className="pt-4 border-t">
                <h3 className="text-md font-semibold mb-2">
                  Update Application Status
                </h3>
                <div className="flex space-x-2">
                  <Select
                    value={viewingApplication.status}
                    onValueChange={(value) =>
                      handleUpdateApplicationStatus(
                        viewingApplication.applicationId,
                        value as Application["status"]
                      )
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="shortlisted">Shortlisted</SelectItem>
                      <SelectItem value="interviewed">Interviewed</SelectItem>
                      <SelectItem value="accepted">Accepted</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
