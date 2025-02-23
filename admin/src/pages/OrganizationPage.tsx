import React, { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
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
import axiosInstance, { BASE_URL, api } from "@/api/api";

const vendorOrgSchema = z.object({
  vendorOrgId: z.number().optional(),
  vendorOrgName: z.string().min(1, "Organization name is required"),
  vendorOrgAddress: z.string().min(1, "Address is required"),
  vendorOrgContact: z.string().min(1, "Contact is required"),
  vendorOrgEmail: z.string().email("Must be a valid email"),
  vendorOrgImage: z.string().optional(),
});

type VendorOrg = z.infer<typeof vendorOrgSchema>;

const CompanyPage: React.FC = () => {
  const [organizations, setOrganizations] = useState<VendorOrg[]>([]);
  const [uploading, setUploading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<VendorOrg>({
    resolver: zodResolver(vendorOrgSchema),
    defaultValues: {},
  });

  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const response = await api.getVendorOrganizations();
        setOrganizations(response.data);
      } catch (error) {
        console.error("Error fetching organizations:", error);
      }
    };
    fetchOrganizations();
  }, []);

  const logoUrl = watch("logoUrl")
    ? `${BASE_URL}/${watch("logoUrl")}`
    : undefined;

  const onSubmit: SubmitHandler<VendorOrg> = async (data) => {
    try {
      const response = await api.createVendorOrganization(data);
      setOrganizations([...organizations, response.data]);
      reset();
      alert("Organization added successfully");
    } catch (error) {
      console.error("Error adding organization:", error);
    }
  };

  const onDelete = async (id: number) => {
    try {
      await api.deleteVendorOrganization(id);
      setOrganizations(organizations.filter((org) => org.vendorOrgId !== id));
      alert("Organization deleted successfully");
    } catch (error) {
      console.error("Error deleting organization:", error);
    }
  };

  const handleLogoUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("logo", file);

    try {
      const response = await api.uploadFile(file);
      setValue("logoUrl", response.data.url);
    } catch (error) {
      console.error("Error uploading logo:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-300 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <Card className="bg-white dark:bg-gray-800 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              Add New Company
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Input
                    {...register("vendorOrgName")}
                    placeholder="Company Name"
                    className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-md"
                  />
                  {errors.vendorOrgName && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.vendorOrgName.message}
                    </p>
                  )}
                </div>
                <div>
                  <Input
                    {...register("vendorOrgAddress")}
                    placeholder="Location"
                    className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-md"
                  />
                  {errors.vendorOrgAddress && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.vendorOrgAddress.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Input
                    {...register("vendorOrgEmail")}
                    placeholder="Email"
                    className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-md"
                  />
                  {errors.vendorOrgEmail && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.vendorOrgEmail.message}
                    </p>
                  )}
                </div>
                <div>
                  <Input
                    {...register("vendorOrgContact")}
                    placeholder="Contact"
                    className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-md"
                  />
                  {errors.vendorOrgContact && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.vendorOrgContact.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-md"
                />
                {logoUrl && (
                  <img
                    src={logoUrl}
                    alt="Company Logo"
                    className="mt-2 max-w-full h-32 object-contain rounded-md"
                  />
                )}
                {errors.vendorOrgImage && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.vendorOrgImage.message}
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
                  "Add Company"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Companies</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-bold">Logo</TableHead>
                  <TableHead className="font-bold">Name</TableHead>
                  <TableHead className="font-bold">Location</TableHead>
                  <TableHead className="font-bold">Email</TableHead>
                  <TableHead className="font-bold">Contact</TableHead>
                  <TableHead className="font-bold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {organizations.map((company) => (
                  <TableRow
                    key={company.vendorOrgId}
                    className="hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <TableCell>
                      <img
                        src={`${BASE_URL}/${company.vendorOrgImage}`}
                        alt={company.vendorOrgName}
                        className="w-10 h-10 object-contain rounded-md"
                      />
                    </TableCell>
                    <TableCell>{company.vendorOrgName}</TableCell>
                    <TableCell>{company.vendorOrgAddress}</TableCell>
                    <TableCell>{company.vendorOrgEmail}</TableCell>
                    <TableCell>{company.vendorOrgContact}</TableCell>
                    <TableCell>
                      <Button
                        variant="destructive"
                        onClick={() =>
                          company.vendorOrgId && onDelete(company.vendorOrgId)
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

export default CompanyPage;
