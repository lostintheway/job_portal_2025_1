import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../../api/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  Eye,
  FileText,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { JobDetails } from "@/api/JobListingResponse";
import { Application } from "@/api/ApplicationsResponse";

export default function ApplicationManagementPage() {
  const navigate = useNavigate();
  const [applications, setApplications] = useState<Application[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<
    Application[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [sortField, setSortField] = useState<"createdDate" | "companyName">(
    "createdDate"
  );
  const [sortAsc, setSortAsc] = useState(false);
  const [selectedApplication, setSelectedApplication] =
    useState<Application | null>(null);
  const [selectedJob, setSelectedJob] = useState<JobDetails | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("application");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchApplications();
  }, []);

  const sortApplications = useCallback(() => {
    if (!applications || !applications.length) return;
    const sorted = [...applications].sort((a, b) => {
      if (sortField === "createdDate") {
        const dateA = new Date(a.createdDate);
        const dateB = new Date(b.createdDate);
        return sortAsc
          ? dateA.getTime() - dateB.getTime()
          : dateB.getTime() - dateA.getTime();
      }
      return 0;
    });
    setFilteredApplications(sorted);
    setCurrentPage(1);
    setTotalPages(Math.ceil(sorted.length / itemsPerPage));
  }, [applications, sortField, sortAsc, itemsPerPage]);

  useEffect(() => {
    sortApplications();
  }, [applications, sortField, sortAsc, sortApplications]);

  // Get current page items
  const getCurrentPageItems = useCallback(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredApplications.slice(startIndex, endIndex);
  }, [currentPage, filteredApplications]);

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await api.getMyApplications();
      setApplications(response.data.data);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (field: "createdDate" | "companyName") => {
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
      setSelectedJob(jobResponse.data.data);
      setIsDialogOpen(true);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "An error occurred");
    }
  };

  const getStatusColor = (status: Application["status"] | undefined) => {
    if (!status) return "#666666";
    const colors = {
      pending: "#FFA500", // Orange
      shortlisted: "#4169E1", // Royal Blue
      interviewed: "#800080", // Purple
      rejected: "#DC143C", // Crimson
      accepted: "#228B22" as const, // Forest Green
    } as const;
    return colors[status as keyof typeof colors] || "#666666";
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
            onClick={() => handleSort("createdDate")}
            variant="outline"
            className="border-gray-300 hover:border-gray-400"
          >
            Sort by Date{" "}
            {sortField === "createdDate" &&
              (sortAsc ? "↑ (Oldest)" : "↓ (Latest)")}
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
        <>
          <div className="space-y-6">
            {getCurrentPageItems().map((application) => (
              <Card key={application.applicationId}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-serif mb-2">
                        {application.jobTitle}
                      </h3>
                      <p className="text-gray-600 mb-1">
                        {application.jobLocation}
                      </p>
                      {/* offeredSalary */}
                      <p className="text-gray-500 text-sm">
                        {application.offeredSalary}
                      </p>
                      <p className="text-gray-500 text-sm">
                        Applied on {formatDate(application.createdDate)}
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

          {/* Pagination */}
          <div className="flex justify-center items-center gap-2 mt-6">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => handlePageChange(page)}
              >
                {page}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </>
      )}

      {/* Application Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">
              {selectedJob?.title} at {selectedJob?.employerName}
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

                {selectedJob && (
                  <div className="mt-4">
                    <Link to={`/jobs/${selectedJob.jobId}`} className="w-full">
                      View Full Job Posting
                    </Link>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );
}
