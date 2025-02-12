import React, { useState } from "react";
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
import axiosInstance from "@/api/api";

const jobSchema = z.object({
  id: z.number().optional(),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  requirements: z.string().min(1, "Requirements are required"),
  salaryRange: z.string().min(1, "Salary range is required"),
  location: z.string().min(1, "Location is required"),
  organizationId: z.number(),
  jobType: z.enum(
    ["full-time", "part-time", "contract", "internship", "remote"],
    {
      required_error: "Please select a job type",
    }
  ),
  experienceLevel: z.string().min(1, "Experience level is required"),
  status: z.enum(["active", "closed"], {
    required_error: "Please select a status",
  }),
});

type Job = z.infer<typeof jobSchema>;

const JobPage: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<Job>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      organizationId: 1, // Set your default organization ID here
      status: "active",
    },
  });

  React.useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axiosInstance.get("/api/jobs");
        setJobs(response.data);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };
    fetchJobs();
  }, []);

  const onSubmit: SubmitHandler<Job> = async (data) => {
    try {
      await axiosInstance.post("/api/jobs", data);
      setJobs([...jobs, data]);
      reset();
      alert("Job posted successfully");
    } catch (error) {
      console.error("Error posting job:", error);
    }
  };

  const onDelete = async (id: number) => {
    try {
      await axiosInstance.delete(`/api/jobs/${id}`);
      setJobs(jobs.filter((job) => job.id !== id));
      alert("Job deleted successfully");
    } catch (error) {
      console.error("Error deleting job:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-300 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <Card className="bg-white dark:bg-gray-800 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Post New Job</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Input
                    {...register("title")}
                    placeholder="Job Title"
                    className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-md"
                  />
                  {errors.title && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.title.message}
                    </p>
                  )}
                </div>
                <div>
                  <Input
                    {...register("location")}
                    placeholder="Location"
                    className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-md"
                  />
                  {errors.location && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.location.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Select
                    onValueChange={(value) =>
                      setValue("jobType", value as Job["jobType"])
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select job type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full-time">Full Time</SelectItem>
                      <SelectItem value="part-time">Part Time</SelectItem>
                      <SelectItem value="contract">Contract</SelectItem>
                      <SelectItem value="internship">Internship</SelectItem>
                      <SelectItem value="remote">Remote</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.jobType && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.jobType.message}
                    </p>
                  )}
                </div>
                <div>
                  <Input
                    {...register("salaryRange")}
                    placeholder="Salary Range"
                    className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-md"
                  />
                  {errors.salaryRange && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.salaryRange.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <Textarea
                  {...register("description")}
                  placeholder="Job Description"
                  className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-md"
                />
                {errors.description && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.description.message}
                  </p>
                )}
              </div>

              <div>
                <Textarea
                  {...register("requirements")}
                  placeholder="Job Requirements"
                  className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-md"
                />
                {errors.requirements && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.requirements.message}
                  </p>
                )}
              </div>

              <div>
                <Input
                  {...register("experienceLevel")}
                  placeholder="Experience Level"
                  className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-md"
                />
                {errors.experienceLevel && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.experienceLevel.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-600 text-white"
              >
                Post Job
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Posted Jobs</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-bold">Title</TableHead>
                  <TableHead className="font-bold">Location</TableHead>
                  <TableHead className="font-bold">Type</TableHead>
                  <TableHead className="font-bold">Status</TableHead>
                  <TableHead className="font-bold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {jobs.map((job) => (
                  <TableRow
                    key={job.id}
                    className="hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <TableCell>{job.title}</TableCell>
                    <TableCell>{job.location}</TableCell>
                    <TableCell className="capitalize">{job.jobType}</TableCell>
                    <TableCell className="capitalize">{job.status}</TableCell>
                    <TableCell>
                      <Button
                        variant="destructive"
                        onClick={() => job.id && onDelete(job.id)}
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

export default JobPage;
