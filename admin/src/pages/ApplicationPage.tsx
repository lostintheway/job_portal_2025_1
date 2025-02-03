import React, { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Upload } from "lucide-react";
import axiosInstance, { BASE_URL } from "@/api/api";

const applicationSchema = z.object({
  id: z.number().optional(),
  jobId: z.number(),
  userId: z.number(),
  status: z.enum(
    ["pending", "reviewed", "shortlisted", "rejected", "accepted"],
    {
      required_error: "Please select a status",
    }
  ),
  resumeUrl: z.string().min(1, "Resume is required"),
  coverLetter: z.string().min(1, "Cover letter is required"),
});

type Application = z.infer<typeof applicationSchema>;

interface Job {
  id: number;
  title: string;
}

interface User {
  id: number;
  name: string;
}

const ApplicationPage: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [uploading, setUploading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<Application>({
    resolver: zodResolver(applicationSchema),
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [applicationsRes, jobsRes, usersRes] = await Promise.all([
          axiosInstance.get("/api/applications"),
          axiosInstance.get("/api/jobs"),
          axiosInstance.get("/api/users"),
        ]);
        setApplications(applicationsRes.data);
        setJobs(jobsRes.data);
        setUsers(usersRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const resumeUrl = watch("resumeUrl")
    ? `${BASE_URL}/${watch("resumeUrl")}`
    : undefined;

  const onSubmit: SubmitHandler<Application> = async (data) => {
    try {
      await axiosInstance.post("/api/applications", data);
      setApplications([...applications, data]);
      reset();
      alert("Application added successfully");
    } catch (error) {
      console.error("Error adding application:", error);
    }
  };

  const onDelete = async (id: number) => {
    try {
      await axiosInstance.delete(`/api/applications/${id}`);
      setApplications(applications.filter((app) => app.id !== id));
      alert("Application deleted successfully");
    } catch (error) {
      console.error("Error deleting application:", error);
    }
  };

  const handleResumeUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("resume", file);

    try {
      const response = await axiosInstance.post("/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setValue("resumeUrl", response.data.url);
    } catch (error) {
      console.error("Error uploading resume:", error);
    } finally {
      setUploading(false);
    }
  };

  const getJobTitle = (jobId: number) => {
    return jobs.find((job) => job.id === jobId)?.title || "Unknown Job";
  };

  const getUserName = (userId: number) => {
    return users.find((user) => user.id === userId)?.name || "Unknown User";
  };

  return (
    <div className="min-h-screen bg-gray-300 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <Card className="bg-white dark:bg-gray-800 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              Add New Application
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Select
                    onValueChange={(value) =>
                      setValue("jobId", parseInt(value))
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a job" />
                    </SelectTrigger>
                    <SelectContent>
                      {jobs.map((job) => (
                        <SelectItem key={job.id} value={job.id.toString()}>
                          {job.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.jobId && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.jobId.message}
                    </p>
                  )}
                </div>
                <div>
                  <Select
                    onValueChange={(value) =>
                      setValue("userId", parseInt(value))
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a user" />
                    </SelectTrigger>
                    <SelectContent>
                      {users.map((user) => (
                        <SelectItem key={user.id} value={user.id.toString()}>
                          {user.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.userId && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.userId.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <Select
                  onValueChange={(value) =>
                    setValue("status", value as Application["status"])
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="reviewed">Reviewed</SelectItem>
                    <SelectItem value="shortlisted">Shortlisted</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                    <SelectItem value="accepted">Accepted</SelectItem>
                  </SelectContent>
                </Select>
                {errors.status && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.status.message}
                  </p>
                )}
              </div>

              <div>
                <Input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleResumeUpload}
                  className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-md"
                />
                {resumeUrl && (
                  <a
                    href={resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:text-blue-600 mt-2 block"
                  >
                    View Resume
                  </a>
                )}
                {errors.resumeUrl && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.resumeUrl.message}
                  </p>
                )}
              </div>

              <div>
                <Textarea
                  {...register("coverLetter")}
                  placeholder="Cover Letter"
                  className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-md"
                />
                {errors.coverLetter && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.coverLetter.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center"
                disabled={uploading}
              >
                {uploading ? (
                  <>
                    <Upload className="animate-spin mr-2" />
                    Uploading...
                  </>
                ) : (
                  "Add Application"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-bold">Job</TableHead>
                  <TableHead className="font-bold">Applicant</TableHead>
                  <TableHead className="font-bold">Status</TableHead>
                  <TableHead className="font-bold">Resume</TableHead>
                  <TableHead className="font-bold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {applications.map((application) => (
                  <TableRow
                    key={application.id}
                    className="hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <TableCell>{getJobTitle(application.jobId)}</TableCell>
                    <TableCell>{getUserName(application.userId)}</TableCell>
                    <TableCell className="capitalize">
                      {application.status}
                    </TableCell>
                    <TableCell>
                      <a
                        href={`${BASE_URL}/${application.resumeUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:text-blue-600"
                      >
                        View Resume
                      </a>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="destructive"
                        onClick={() =>
                          application.id && onDelete(application.id)
                        }
                        className="bg-red-500 hover:bg-red-600 text-white"
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ApplicationPage;
