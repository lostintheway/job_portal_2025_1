import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "@/api/api";
import { Card, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface JobDescription {
  jobDescriptionId: number;
  title: string;
  description: string;
  requirements: string;
  createdDate: string;
}

const JobDescriptionsPage = () => {
  const [jobDescriptions, setJobDescriptions] = useState<JobDescription[]>([]);

  useEffect(() => {
    const fetchJobDescriptions = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/job-descriptions`);
        setJobDescriptions(response.data);
      } catch (error) {
        console.error("Failed to fetch job descriptions:", error);
      }
    };

    fetchJobDescriptions();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const jobData = {
      title: formData.get("title"),
      description: formData.get("description"),
      requirements: formData.get("requirements"),
    };

    try {
      await axios.post(`${BASE_URL}/api/job-descriptions`, jobData);
      // Refresh the list
      const response = await axios.get(`${BASE_URL}/api/job-descriptions`);
      setJobDescriptions(response.data);
    } catch (error) {
      console.error("Failed to create job description:", error);
    }
  };

  return (
    <div className="p-6">
      <Card className="w-full">
        <CardHeader>
          <h2 className="text-2xl font-bold">Job Descriptions</h2>
        </CardHeader>
        <div className="p-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="mb-4">Create New Job Description</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Job Description</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input id="title" name="title" required />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" name="description" required />
                </div>
                <div>
                  <Label htmlFor="requirements">Requirements</Label>
                  <Textarea id="requirements" name="requirements" required />
                </div>
                <Button type="submit">Create</Button>
              </form>
            </DialogContent>
          </Dialog>
          <div className="grid gap-4">
            {jobDescriptions.map((job) => (
              <Card key={job.jobDescriptionId} className="p-4">
                <h3 className="font-bold">{job.title}</h3>
                <p className="mt-2">{job.description}</p>
                <p className="mt-2">Requirements: {job.requirements}</p>
                <p className="text-sm text-gray-500 mt-2">
                  Created: {new Date(job.createdDate).toLocaleDateString()}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default JobDescriptionsPage;
