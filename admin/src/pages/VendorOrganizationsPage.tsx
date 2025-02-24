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

interface VendorOrganization {
  vendorOrgId: number;
  name: string;
  description: string;
  contactInfo: string;
  createdDate: string;
}

const VendorOrganizationsPage = () => {
  const [vendorOrgs, setVendorOrgs] = useState<VendorOrganization[]>([]);

  useEffect(() => {
    const fetchVendorOrgs = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/api/vendor-organizations`
        );
        setVendorOrgs(response.data.data);
      } catch (error) {
        console.error("Failed to fetch vendor organizations:", error);
      }
    };

    fetchVendorOrgs();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const vendorData = {
      name: formData.get("name"),
      description: formData.get("description"),
      contactInfo: formData.get("contactInfo"),
    };

    try {
      await axios.post(`${BASE_URL}/api/vendor-organizations`, vendorData);
      // Refresh the list
      const response = await axios.get(`${BASE_URL}/api/vendor-organizations`);
      setVendorOrgs(response.data.data);
    } catch (error) {
      console.error("Failed to create vendor organization:", error);
    }
  };

  return (
    <div className="p-6">
      <Card className="w-full">
        <CardHeader>
          <h2 className="text-2xl font-bold">Vendor Organizations</h2>
        </CardHeader>
        <div className="p-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="mb-4">Create New Vendor Organization</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Vendor Organization</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" name="name" required />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" name="description" required />
                </div>
                <div>
                  <Label htmlFor="contactInfo">Contact Information</Label>
                  <Input id="contactInfo" name="contactInfo" required />
                </div>
                <Button type="submit">Create</Button>
              </form>
            </DialogContent>
          </Dialog>
          <div className="grid gap-4">
            {vendorOrgs.map((org) => (
              <Card key={org.vendorOrgId} className="p-4">
                <h3 className="font-bold">{org.name}</h3>
                <p className="mt-2">{org.description}</p>
                <p className="mt-2">Contact: {org.contactInfo}</p>
                <p className="text-sm text-gray-500 mt-2">
                  Created: {new Date(org.createdDate).toLocaleDateString()}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default VendorOrganizationsPage;
