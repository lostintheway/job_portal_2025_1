import React, { useState } from "react";
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
import axiosInstance, { BASE_URL } from "@/api/api";

const companySchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, "Company name is required"),
  description: z.string().min(1, "Description is required"),
  location: z.string().min(1, "Location is required"),
  website: z.string().url("Must be a valid URL"),
  logoUrl: z.string().min(1, "Logo is required"),
  userId: z.number(),
  industry: z.string().min(1, "Industry is required"),
  size: z.string().min(1, "Company size is required"),
});

type Company = z.infer<typeof companySchema>;

const CompanyPage: React.FC = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [uploading, setUploading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<Company>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      userId: 1, // Set your default user ID here
    },
  });

  React.useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await axiosInstance.get("/api/companies");
        setCompanies(response.data);
      } catch (error) {
        console.error("Error fetching companies:", error);
      }
    };
    fetchCompanies();
  }, []);

  const logoUrl = watch("logoUrl")
    ? `${BASE_URL}/${watch("logoUrl")}`
    : undefined;

  const onSubmit: SubmitHandler<Company> = async (data) => {
    try {
      await axiosInstance.post("/api/companies", data);
      setCompanies([...companies, data]);
      reset();
      alert("Company added successfully");
    } catch (error) {
      console.error("Error adding company:", error);
    }
  };

  const onDelete = async (id: number) => {
    try {
      await axiosInstance.delete(`/api/companies/${id}`);
      setCompanies(companies.filter((company) => company.id !== id));
      alert("Company deleted successfully");
    } catch (error) {
      console.error("Error deleting company:", error);
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
      const response = await axiosInstance.post("/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
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
                    {...register("name")}
                    placeholder="Company Name"
                    className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-md"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.name.message}
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
                  <Input
                    {...register("website")}
                    placeholder="Website URL"
                    className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-md"
                  />
                  {errors.website && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.website.message}
                    </p>
                  )}
                </div>
                <div>
                  <Input
                    {...register("industry")}
                    placeholder="Industry"
                    className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-md"
                  />
                  {errors.industry && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.industry.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <Input
                  {...register("size")}
                  placeholder="Company Size (e.g., 1-10, 11-50, 51-200)"
                  className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-md"
                />
                {errors.size && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.size.message}
                  </p>
                )}
              </div>

              <div>
                <Textarea
                  {...register("description")}
                  placeholder="Company Description"
                  className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-md"
                />
                {errors.description && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.description.message}
                  </p>
                )}
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
                {errors.logoUrl && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.logoUrl.message}
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
                  <TableHead className="font-bold">Industry</TableHead>
                  <TableHead className="font-bold">Size</TableHead>
                  <TableHead className="font-bold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {companies.map((company) => (
                  <TableRow
                    key={company.id}
                    className="hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <TableCell>
                      <img
                        src={`${BASE_URL}/${company.logoUrl}`}
                        alt={company.name}
                        className="w-10 h-10 object-contain rounded-md"
                      />
                    </TableCell>
                    <TableCell>{company.name}</TableCell>
                    <TableCell>{company.location}</TableCell>
                    <TableCell>{company.industry}</TableCell>
                    <TableCell>{company.size}</TableCell>
                    <TableCell>
                      <Button
                        variant="destructive"
                        onClick={() => company.id && onDelete(company.id)}
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
