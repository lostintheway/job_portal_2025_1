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
  jobDescriptionId: z.number().optional(),
  vendorOrgId: z.number(),
  categoryId: z.number(),
  jobType: z.string().min(1, "Job type is required"),
  level: z.string().min(1, "Level is required"),
  vacancyNo: z.number().min(1, "Number of vacancies is required"),
  employeeType: z.string().min(1, "Employee type is required"),
  jobLocation: z.string().min(1, "Location is required"),
  offeredSalary: z.string().min(1, "Salary is required"),
  deadLine: z.string().min(1, "Deadline is required"),
  educationLevel: z.string().min(1, "Education level is required"),
  experienceRequired: z.string().min(1, "Experience requirement is required"),
  otherSpecification: z.string().optional(),
  jobWorkDescription: z.string().min(1, "Job description is required"),
});

type Job = z.infer<typeof jobSchema>;

const JobPage: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [organizations, setOrganizations] = useState<
    { id: number; name: string }[]
  >([]);
  const [categories, setCategories] = useState<{ id: number; name: string }[]>(
    []
  );
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<Job>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      vendorOrgId: 1,
      categoryId: 1,
      vacancyNo: 1,
    },
  });

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [jobsRes, orgsRes, catsRes] = await Promise.all([
          axiosInstance.get("/api/job-descriptions"),
          axiosInstance.get("/api/vendor-organizations"),
          axiosInstance.get("/api/categories"),
        ]);
        setJobs(jobsRes.data);
        setOrganizations(orgsRes.data);
        setCategories(catsRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const onSubmit: SubmitHandler<Job> = async (data) => {
    try {
      const response = await axiosInstance.post("/api/jobs", data);
      setJobs([...jobs, response.data]);
      reset();
      alert("Job posted successfully");
    } catch (error) {
      console.error("Error posting job:", error);
    }
  };

  const onDelete = async (id: number) => {
    try {
      await axiosInstance.delete(`/api/jobs/${id}`);
      setJobs(jobs.filter((job) => job.jobDescriptionId !== id));
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
                      setValue("vendorOrgId", parseInt(value))
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select organization" />
                    </SelectTrigger>
                    <SelectContent>
                      {organizations.map((org) => (
                        <SelectItem key={org.id} value={org.id.toString()}>
                          {org.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.vendorOrgId && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.vendorOrgId.message}
                    </p>
                  )}
                </div>
                <div>
                  <Select
                    onValueChange={(value) =>
                      setValue("categoryId", parseInt(value))
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id.toString()}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.categoryId && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.categoryId.message}
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
