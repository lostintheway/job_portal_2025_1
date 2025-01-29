import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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

const portfolioSchema = z.object({
  id: z.number().optional(),
  title: z.string().min(1, "Title is required"),
  category: z.enum(["wedding", "portrait", "nature"], {
    required_error: "Please select a category",
  }),
  imageSrc: z.string().min(1, "Image is required"),
});

type Portfolio = z.infer<typeof portfolioSchema>;

const PortfolioPage: React.FC = () => {
  const [portfolioItems, setPortfolioItems] = useState<Portfolio[]>([]);
  const [uploading, setUploading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<Portfolio>({
    resolver: zodResolver(portfolioSchema),
  });

  // fetch useEffect for portfolio
  React.useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const response = await axiosInstance.get("/api/portfolios");
        setPortfolioItems(response.data);
      } catch (error) {
        console.error("Error fetching portfolio:", error);
      }
    };
    fetchPortfolio();
  }, []);

  const imageSrc = watch("imageSrc")
    ? `${BASE_URL}/${watch("imageSrc")}`
    : undefined;

  const onSubmit: SubmitHandler<Portfolio> = async (item) => {
    try {
      await axiosInstance.post("/api/portfolios", item);
      setPortfolioItems([...portfolioItems, item]);
      reset();
      alert("Portfolio item added successfully");
    } catch (error) {
      console.error("Error adding portfolio item:", error);
    }
  };

  const onDelete = async (id: number) => {
    try {
      await axiosInstance.delete(`/api/portfolios/${id}`);
      setPortfolioItems(portfolioItems.filter((item) => item.id !== id));
      alert("Portfolio item deleted successfully");
    } catch (error) {
      console.error("Error deleting portfolio item:", error);
    }
  };

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await axiosInstance.post(
        BASE_URL + "/upload",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setValue("imageSrc", response.data.url);
    } catch (error) {
      console.error("Error uploading image:", error);
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
              Add New Portfolio Item
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Input
                    {...register("title")}
                    placeholder="Title"
                    className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-md"
                  />
                  {errors.title && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.title.message}
                    </p>
                  )}
                </div>
                <div>
                  <Select
                    onValueChange={(value) =>
                      setValue("category", value as Portfolio["category"])
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="wedding">Wedding</SelectItem>
                      <SelectItem value="portrait">Portrait</SelectItem>
                      <SelectItem value="nature">Nature</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.category && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.category.message}
                    </p>
                  )}
                </div>
              </div>
              <div>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-md"
                />
                {imageSrc && (
                  <img
                    src={imageSrc}
                    alt="Preview"
                    className="mt-2 max-w-full h-32 object-cover rounded-md"
                  />
                )}
                {errors.imageSrc && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.imageSrc.message}
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
                  "Add"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              Portfolio Items
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-bold">Title</TableHead>
                  <TableHead className="font-bold">Category</TableHead>
                  <TableHead className="font-bold">Image</TableHead>
                  <TableHead className="font-bold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {portfolioItems.map((item) => (
                  <TableRow
                    key={item.id}
                    className="hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <TableCell>{item.title}</TableCell>
                    <TableCell className="capitalize">
                      {item.category}
                    </TableCell>
                    <TableCell>
                      <img
                        src={BASE_URL + "/" + item.imageSrc}
                        alt={item.title}
                        className="w-20 h-20 object-cover rounded-md"
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="destructive"
                        onClick={() => item.id && onDelete(item.id)}
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

export default PortfolioPage;
