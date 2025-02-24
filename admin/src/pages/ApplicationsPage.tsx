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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Application {
  applicationId: number;
  jobId: number;
  userId: number;
  status: string;
  createdDate: string;
}

const ApplicationsPage = () => {
  const [applications, setApplications] = useState<Application[]>([]);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/applications`);
        setApplications(response.data);
      } catch (error) {
        console.error("Failed to fetch applications:", error);
      }
    };

    fetchApplications();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const applicationData = {
      jobId: Number(formData.get("jobId")),
      userId: Number(formData.get("userId")),
      status: formData.get("status"),
    };

    try {
      await axios.post(`${BASE_URL}/api/applications`, applicationData);
      // Refresh the list
      const response = await axios.get(`${BASE_URL}/api/applications`);
      setApplications(response.data);
    } catch (error) {
      console.error("Failed to create application:", error);
    }
  };

  return (
    <div className="p-6">
      <Card className="w-full">
        <CardHeader>
          <h2 className="text-2xl font-bold">Applications</h2>
        </CardHeader>
        <div className="p-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="mb-4">Create New Application</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Application</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="jobId">Job ID</Label>
                  <Input id="jobId" name="jobId" type="number" required />
                </div>
                <div>
                  <Label htmlFor="userId">User ID</Label>
                  <Input id="userId" name="userId" type="number" required />
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select name="status">
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="accepted">Accepted</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit">Create</Button>
              </form>
            </DialogContent>
          </Dialog>
          <div className="grid gap-4">
            {applications.map((application) => (
              <Card key={application.applicationId} className="p-4">
                <h3>Application #{application.applicationId}</h3>
                <p>Status: {application.status}</p>
                <p>
                  Created:{" "}
                  {new Date(application.createdDate).toLocaleDateString()}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ApplicationsPage;
