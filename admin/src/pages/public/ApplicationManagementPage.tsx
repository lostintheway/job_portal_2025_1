import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../api/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Eye, FileText } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
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

interface JobDetails {
  jobId: number;
  title: string;
  companyName: string;
  jobLocation: string;
  jobDescription: string;
  experienceRequired: string;
  responsibilities: string;
  benefits: string;
  offeredSalary: string;
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
  const [sortField, setSortField] = useState<"appliedDate" | "companyName">(
    "appliedDate"
  );
  const [sortAsc, setSortAsc] = useState(false);
  const [selectedApplication, setSelectedApplication] =
    useState<Application | null>(null);
  const [selectedJob, setSelectedJob] = useState<JobDetails | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("application");

  useEffect(() => {
    fetchApplications();
  }, []);

  useEffect(() => {
    sortApplications();
  }, [applications, sortField, sortAsc]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await api.getMyApplications();
      setApplications(response.data.data);
    } catch (error) {
      toast.error("Failed to load applications");
    } finally {
      setLoading(false);
    }
  };

  const sortApplications = () => {
    const sorted = [...applications].sort((a, b) => {
      if (sortField === "appliedDate") {
        return sortAsc
          ? new Date(a.appliedDate).getTime() -
              new Date(b.appliedDate).getTime()
          : new Date(b.appliedDate).getTime() -
              new Date(a.appliedDate).getTime();
      }
      return sortAsc
        ? a.companyName.localeCompare(b.companyName)
        : b.companyName.localeCompare(a.companyName);
    });
    setFilteredApplications(sorted);
  };

  const handleSort = (field: "appliedDate" | "companyName") => {
    if (field === sortField) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const viewApplicationDetails = async (application: Application) => {
    setSelectedApplication(application);
    try {
      const jobResponse = await api.getJobById(application.jobId);
      setSelectedJob(jobResponse.data);
      setIsDialogOpen(true);
    } catch (error) {
      toast.error("Failed to load job details");
    }
  };

  const getStatusColor = (status: Application["status"]) => {
    const colors = {
      pending: "#FFA500", // Orange
      shortlisted: "#4169E1", // Royal Blue
      interviewed: "#800080", // Purple
      rejected: "#DC143C", // Crimson
      accepted: "#228B22", // Forest Green
    };
    return colors[status] || "#666666";
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

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-serif text-gray-800">My Applications</h1>
        <div className="space-x-4">
          <Button
            onClick={() => handleSort("appliedDate")}
            variant="outline"
            className="border-gray-300 hover:border-gray-400"
          >
            Sort by Date {sortField === "appliedDate" && (sortAsc ? "↑" : "↓")}
          </Button>
          <Button
            onClick={() => handleSort("companyName")}
            variant="outline"
            className="border-gray-300 hover:border-gray-400"
          >
            Sort by Company{" "}
            {sortField === "companyName" && (sortAsc ? "↑" : "↓")}
          </Button>
        </div>
      </div>

      {filteredApplications.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-gray-600 text-lg mb-4">No applications found</p>
            <Button
              onClick={() => navigate("/jobs")}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Browse Jobs
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {filteredApplications.map((application) => (
            <Card key={application.applicationId}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-serif mb-2">
                      {application.jobTitle}
                    </h3>
                    <p className="text-gray-600 mb-1">
                      {application.companyName}
                    </p>
                    <p className="text-gray-500 text-sm">
                      Applied on {formatDate(application.appliedDate)}
                    </p>
                  </div>
                  <div className="flex flex-col items-end space-y-3">
                    <Badge
                      style={{
                        backgroundColor: getStatusColor(application.status),
                        color: "white",
                        fontWeight: 500,
                        padding: "4px 12px",
                      }}
                    >
                      {application.status.charAt(0).toUpperCase() +
                        application.status.slice(1)}
                    </Badge>
                    <Button
                      onClick={() => viewApplicationDetails(application)}
                      variant="outline"
                      className="border-gray-300 hover:border-gray-400"
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
              {selectedJob?.title} at {selectedJob?.companyName}
            </DialogTitle>
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
                  style={{
                    backgroundColor: getStatusColor(
                      selectedApplication?.status
                    ),
                    color: "white",
                    fontWeight: 500,
                    padding: "4px 12px",
                  }}
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
                      {selectedJob?.offeredSalary || "Not specified"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Job Type</p>
                    <p className="text-gray-500">{selectedJob?.jobType}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Location</p>
                    <p className="text-gray-500">{selectedJob?.jobLocation}</p>
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
                      {selectedJob?.jobDescription}
                    </p>
                  </div>

                  {selectedJob?.experienceRequired && (
                    <div>
                      <h4 className="text-lg font-semibold mb-2">
                        Experience Required
                      </h4>
                      <p className="text-gray-700 whitespace-pre-line">
                        {selectedJob.experienceRequired}
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
