import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { api } from "../../api/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const jobFormSchema = z.object({
  title: z.string().min(1, "Job title is required"),
  jobType: z.enum([
    "full-time",
    "part-time",
    "contract",
    "internship",
    "remote",
  ]),
  level: z.string(),
  vacancies: z.number().min(1, "Number of vacancies must be at least 1"),
  employmentType: z.string(),
  jobLocation: z.string().min(1, "Job location is required"),
  offeredSalary: z.string(),
  deadLine: z.string().min(1, "Application deadline is required"),
  educationLevel: z.string(),
  experienceRequired: z.string(),
  otherSpecification: z.string(),
  jobDescription: z.string().min(1, "Job description is required"),
  responsibilities: z.string(),
  benefits: z.string(),
  isPremium: z.boolean(),
  categoryId: z.number().default(1),
});

type JobFormValues = z.infer<typeof jobFormSchema>;

export default function CreateJobPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [jobId, setJobId] = useState<string | null>(null);
  const [initialLoading, setInitialLoading] = useState(false);
  const [categories, setCategories] = useState<
    { categoryId: number; categoryName: string }[]
  >([]);

  const form = useForm<JobFormValues>({
    resolver: zodResolver(jobFormSchema),
    defaultValues: {
      title: "",
      jobType: "full-time",
      level: "",
      vacancies: 1,
      employmentType: "",
      jobLocation: "",
      offeredSalary: "",
      deadLine: "",
      educationLevel: "",
      experienceRequired: "",
      otherSpecification: "",
      jobDescription: "",
      responsibilities: "",
      benefits: "",
      isPremium: false,
      categoryId: 1,
    },
  });

  // Fetch categories when component mounts
  useEffect(() => {
    fetchCategories();
  }, []);

  // Parse query parameters to check for edit mode
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const editJobId = queryParams.get("edit");

    if (editJobId) {
      setIsEditMode(true);
      setJobId(editJobId);
      fetchJobDetails(editJobId);
    }
  }, [location.search]);

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const response = await api.getInstance().get("/api/categories");
      setCategories(response.data.data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to load job categories");
    }
  };

  // Fetch job details when in edit mode
  const fetchJobDetails = async (id: string) => {
    try {
      setInitialLoading(true);
      const response = await api.getInstance().get(`/api/jobs/${id}`);
      const jobData = response.data.data;

      // Format the date to YYYY-MM-DD for the date input
      const formattedDeadline = jobData.deadLine
        ? new Date(jobData.deadLine).toISOString().split("T")[0]
        : "";

      // Map the API response to form fields
      form.reset({
        title: jobData.title || "",
        jobType: jobData.jobType || "full-time",
        level: jobData.level || "",
        vacancies: jobData.vacancies || 1,
        employmentType: jobData.employmentType || "",
        jobLocation: jobData.jobLocation || "",
        offeredSalary: jobData.offeredSalary || "",
        deadLine: formattedDeadline,
        educationLevel: jobData.educationLevel || "",
        experienceRequired: jobData.experienceRequired || "",
        otherSpecification: jobData.otherSpecification || "",
        jobDescription: jobData.jobDescription || "",
        responsibilities: jobData.responsibilities || "",
        benefits: jobData.benefits || "",
        isPremium: jobData.isPremium || false,
        categoryId: jobData.categoryId || 1,
      });
    } catch (error) {
      console.error("Error fetching job details:", error);
      toast.error("Failed to load job details");
    } finally {
      setInitialLoading(false);
    }
  };

  async function onSubmit(data: JobFormValues) {
    try {
      setLoading(true);

      // Prepare data with correct field names for the API
      const jobData = {
        ...data,
        // Don't include description field as it will conflict with jobDescription
        jobDescription: data.jobDescription,
        // Format the date to ISO format for the API
        deadLine: new Date(data.deadLine).toISOString(),
      };

      if (isEditMode && jobId) {
        // Update existing job
        await api.updateJob(jobId, jobData);
        toast.success("Job updated successfully!");
      } else {
        // Create new job
        await api.createJob(jobData);
        toast.success("Job posted successfully!");
      }

      navigate("/employer/job-postings");
    } catch (error) {
      console.error("Error saving job:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to save job"
      );
    } finally {
      setLoading(false);
    }
  }

  if (initialLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>
            {isEditMode ? "Edit Job Posting" : "Post a New Job"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Job Title</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="jobType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Job Type</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select job type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="full-time">Full Time</SelectItem>
                            <SelectItem value="part-time">Part Time</SelectItem>
                            <SelectItem value="contract">Contract</SelectItem>
                            <SelectItem value="internship">
                              Internship
                            </SelectItem>
                            <SelectItem value="remote">Remote</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="categoryId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Job Category</FormLabel>
                        <Select
                          onValueChange={(value) =>
                            field.onChange(parseInt(value))
                          }
                          value={field.value.toString()}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select job category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem
                                key={category.categoryId}
                                value={category.categoryId.toString()}
                              >
                                {category.categoryName}
                              </SelectItem>
                            ))}
                            {categories.length === 0 && (
                              <SelectItem value="1">
                                Default Category
                              </SelectItem>
                            )}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="level"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Level</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="e.g. Senior, Junior, Mid-level"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="vacancies"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Number of Vacancies</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="1"
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="employmentType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Employment Type</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="e.g. Permanent, Temporary"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="jobLocation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Job Location</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="offeredSalary"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Offered Salary</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="e.g. Rs50,000 - Rs70,000 per year"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="deadLine"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Application Deadline</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="educationLevel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Required Education Level</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="e.g. Bachelor's Degree"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="experienceRequired"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Required Experience</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="e.g. 3+ years in similar role"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="jobDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Job Description</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          className="min-h-[150px]"
                          placeholder="Provide a detailed description of the job"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="responsibilities"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Responsibilities</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          className="min-h-[150px]"
                          placeholder="List the key responsibilities of the role"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="benefits"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Benefits</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          className="min-h-[100px]"
                          placeholder="List the benefits offered with this position"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="isPremium"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <input
                          type="checkbox"
                          checked={field.value}
                          onChange={field.onChange}
                          className="h-4 w-4 rounded border-gray-300"
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Premium Job Listing</FormLabel>
                        <p className="text-sm text-gray-500">
                          Premium job listings appear at the top of search
                          results and get more visibility.
                        </p>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="otherSpecification"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Other Specifications</FormLabel>
                      <FormControl>
                        <Textarea {...field} className="min-h-[100px]" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/employer/job-postings")}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {isEditMode ? "Updating..." : "Posting..."}
                    </>
                  ) : (
                    <>{isEditMode ? "Update Job" : "Post Job"}</>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
