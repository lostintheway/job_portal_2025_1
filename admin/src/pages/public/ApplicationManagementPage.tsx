import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../api/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  Search,
  Filter,
  ArrowUpDown,
  Eye,
  FileText,
} from "lucide-react";
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

export default function ApplicationManagementPage() {
  const navigate = useNavigate();
  const [applications, setApplications] = useState<Application[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<
    Application[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [selectedApplication, setSelectedApplication] =
    useState<Application | null>(null);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("application");

  useEffect(() => {
    fetchApplications();
  }, []);

  useEffect(() => {
    applyFiltersAndSort();
  }, [applications, searchTerm, statusFilter, sortBy, sortOrder]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await api.getMyApplications();
      setApplications(response.data);
    } catch (error) {
      console.error("Error fetching applications:", error);
      toast.error("Failed to load applications");
    } finally {
      setLoading(false);
    }
  };

  const applyFiltersAndSort = () => {
    let result = [...applications];

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (app) =>
          app.jobTitle.toLowerCase().includes(term) ||
          app.companyName.toLowerCase().includes(term)
      );
    }

    // Apply status filter
    if (statusFilter) {
      result = result.filter((app) => app.status === statusFilter);
    }

    // Apply sorting
    result.sort((a, b) => {
      if (sortBy === "date") {
        return sortOrder === "asc"
          ? new Date(a.appliedDate).getTime() -
              new Date(b.appliedDate).getTime()
          : new Date(b.appliedDate).getTime() -
              new Date(a.appliedDate).getTime();
      } else if (sortBy === "company") {
        return sortOrder === "asc"
          ? a.companyName.localeCompare(b.companyName)
          : b.companyName.localeCompare(a.companyName);
      } else if (sortBy === "title") {
        return sortOrder === "asc"
          ? a.jobTitle.localeCompare(b.jobTitle)
          : b.jobTitle.localeCompare(a.jobTitle);
      } else {
        return 0;
      }
    });

    setFilteredApplications(result);
  };

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const resetFilters = () => {
    setSearchTerm("");
    setStatusFilter("");
    setSortBy("date");
    setSortOrder("desc");
  };

  const viewApplicationDetails = async (application: Application) => {
    setSelectedApplication(application);
    try {
      const jobResponse = await api.getJobById(application.jobId);
      setSelectedJob(jobResponse.data);
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
        <Button onClick={() => navigate("/public/jobs")} variant="outline">
          Browse Jobs
        </Button>
      </div>

      {/* Filters and Search */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="grid gap-4 md:grid-cols-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by job title or company"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

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

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Application Date</SelectItem>
                <SelectItem value="company">Company Name</SelectItem>
                <SelectItem value="title">Job Title</SelectItem>
              </SelectContent>
            </Select>

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
      {filteredApplications.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-gray-500 mb-4">
              {applications.length === 0
                ? "You haven't applied to any jobs yet."
                : "No applications match your search criteria."}
            </p>
            {applications.length > 0 && (
              <Button variant="outline" onClick={resetFilters}>
                Clear Filters
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-gray-500">
            Showing {filteredApplications.length} of {applications.length}{" "}
            applications
          </p>
          {filteredApplications.map((application) => (
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
                    onClick={() =>
                      navigate(`/public/jobs/${selectedJob?.jobId}`)
                    }
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
