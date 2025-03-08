import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../api/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Filter, ArrowUpDown, Eye, FileText } from "lucide-react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ErrorBoundary from "@/components/ErrorBoundary";
import { Pagination } from "@/components/ui/pagination";

interface Application {
  applicationId: string;
  jobId: string;
  status: "pending" | "shortlisted" | "interviewed" | "rejected" | "accepted";
  jobTitle: string;
  companyName: string;
  appliedDate: string;
  resumeUrl: string;
  coverLetter: string;
  expectedSalary: string;
  feedback?: string;
}

interface Job {
  jobId: string;
  title: string;
  company: string;
  location: string;
  description: string;
  requirements: string;
  responsibilities: string;
  benefits: string;
  salary: string;
  jobType: string;
  deadLine: string;
}

interface ApplicationsResponse {
  data: Application[];
  total: number;
  page: number;
  size: number;
  totalPages: number;
}

export default function ApplicationManagementPage() {
  const navigate = useNavigate();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("appliedDate");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [selectedApplication, setSelectedApplication] =
    useState<Application | null>(null);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("application");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchApplications();
  }, [currentPage, pageSize, statusFilter, sortBy, sortOrder]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await api.getMyApplications();
      const data = response.data as ApplicationsResponse;
      setApplications(data.data);
      setTotalPages(data.totalPages);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to load applications"
      );
    } finally {
      setLoading(false);
    }
  };

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const resetFilters = () => {
    setStatusFilter("");
    setSortBy("appliedDate");
    setSortOrder("desc");
    setCurrentPage(1);
  };

  const viewApplicationDetails = async (application: Application) => {
    setSelectedApplication(application);
    try {
      const jobResponse = await api.getJobById(application.jobId);
      setSelectedJob(jobResponse.data.data);
      setIsDialogOpen(true);
    } catch (error) {
      console.error("Error fetching job details:", error);
      toast.error("Failed to load job details");
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Applications</h1>
        <Button onClick={() => navigate("/jobs")} variant="outline">
          Browse Jobs
        </Button>
      </div>

      {/* Filters and Sort */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="grid gap-4 md:grid-cols-3">
            <ErrorBoundary>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="shortlisted">Shortlisted</SelectItem>
                  <SelectItem value="interviewed">Interviewed</SelectItem>
                  <SelectItem value="accepted">Accepted</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </ErrorBoundary>

            <ErrorBoundary>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="appliedDate">Application Date</SelectItem>
                  <SelectItem value="companyName">Company Name</SelectItem>
                  <SelectItem value="jobTitle">Job Title</SelectItem>
                </SelectContent>
              </Select>
            </ErrorBoundary>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={toggleSortOrder}
                className="flex-shrink-0"
              >
                <ArrowUpDown
                  className={`h-4 w-4 ${
                    sortOrder === "asc" ? "rotate-180" : ""
                  }`}
                />
              </Button>
              <Button
                variant="outline"
                onClick={resetFilters}
                className="flex-grow"
              >
                <Filter className="h-4 w-4 mr-2" />
                Reset Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Applications List */}
      {applications.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-gray-500 mb-4">
              You haven't applied to any jobs yet.
            </p>
            <Button variant="outline" onClick={() => navigate("/jobs")}>
              Browse Jobs
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {applications.map((application) => (
            <Card key={application.applicationId} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <div className="flex-grow">
                    <h3 className="text-lg font-semibold">
                      {application.jobTitle}
                    </h3>
                    <p className="text-gray-600">{application.companyName}</p>
                    <p className="text-sm text-gray-500">
                      Applied on {formatDate(application.appliedDate)}
                    </p>
                  </div>
                  <div className="flex flex-col items-end justify-between">
                    <Badge
                      className={`${getStatusBadgeColor(
                        application.status
                      )} text-white mb-2`}
                    >
                      {application.status.charAt(0).toUpperCase() +
                        application.status.slice(1)}
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => viewApplicationDetails(application)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Pagination */}
          <div className="mt-6 flex justify-center">
            <Pagination>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <span className="mx-2">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </Pagination>
          </div>
        </div>
      )}

      {/* Application Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">
              {selectedJob?.title} at {selectedJob?.company}
            </DialogTitle>
            <DialogDescription>
              Application submitted on{" "}
              {selectedApplication &&
                formatDate(selectedApplication.appliedDate)}
            </DialogDescription>
          </DialogHeader>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="application">Application Details</TabsTrigger>
              <TabsTrigger value="job">Job Details</TabsTrigger>
            </TabsList>

            <TabsContent value="application" className="space-y-4 mt-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Application Status</h3>
                <Badge
                  className={`${
                    selectedApplication &&
                    getStatusBadgeColor(selectedApplication.status)
                  } text-white`}
                >
                  {selectedApplication?.status
                    ? selectedApplication.status.charAt(0).toUpperCase() +
                      selectedApplication.status.slice(1)
                    : ""}
                </Badge>
              </div>

              {selectedApplication?.feedback && (
                <div className="bg-gray-50 p-4 rounded-md">
                  <h4 className="font-medium mb-2">Employer Feedback</h4>
                  <p className="text-gray-700">
                    {selectedApplication.feedback}
                  </p>
                </div>
              )}

              <div>
                <h4 className="font-medium mb-2">Resume</h4>
                <div className="flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-blue-500" />
                  <a
                    href={selectedApplication?.resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    View Resume
                  </a>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Cover Letter</h4>
                <div className="bg-gray-50 p-4 rounded-md whitespace-pre-line">
                  {selectedApplication?.coverLetter}
                </div>
              </div>

              {selectedApplication?.expectedSalary && (
                <div>
                  <h4 className="font-medium mb-2">Expected Salary</h4>
                  <p>{selectedApplication.expectedSalary}</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="job" className="space-y-4 mt-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Job Details</h3>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm font-medium">Salary</p>
                    <p className="text-gray-500">
                      {selectedJob?.salary || "Not specified"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Job Type</p>
                    <p className="text-gray-500">{selectedJob?.jobType}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Location</p>
                    <p className="text-gray-500">{selectedJob?.location}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Application Deadline</p>
                    <p className="text-gray-500">
                      {selectedJob?.deadLine &&
                        formatDate(selectedJob.deadLine)}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-lg font-semibold mb-2">Description</h4>
                    <p className="text-gray-700 whitespace-pre-line">
                      {selectedJob?.description}
                    </p>
                  </div>

                  {selectedJob?.requirements && (
                    <div>
                      <h4 className="text-lg font-semibold mb-2">
                        Requirements
                      </h4>
                      <p className="text-gray-700 whitespace-pre-line">
                        {selectedJob.requirements}
                      </p>
                    </div>
                  )}

                  {selectedJob?.responsibilities && (
                    <div>
                      <h4 className="text-lg font-semibold mb-2">
                        Responsibilities
                      </h4>
                      <p className="text-gray-700 whitespace-pre-line">
                        {selectedJob.responsibilities}
                      </p>
                    </div>
                  )}

                  {selectedJob?.benefits && (
                    <div>
                      <h4 className="text-lg font-semibold mb-2">Benefits</h4>
                      <p className="text-gray-700 whitespace-pre-line">
                        {selectedJob.benefits}
                      </p>
                    </div>
                  )}
                </div>

                <div className="mt-4">
                  <Button
                    onClick={() => navigate(`/jobs/${selectedJob?.jobId}`)}
                    className="w-full"
                  >
                    View Full Job Posting
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );
}
