import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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

const gallerySchema = z.object({
  id: z.number().optional(),
  title: z.string().min(1, "Title is required"),
  imageSrc: z.string().min(1, "Image is required"),
});

type Gallery = z.infer<typeof gallerySchema>;

const GalleryPage: React.FC = () => {
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [uploading, setUploading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<Gallery>({
    resolver: zodResolver(gallerySchema),
  });

  // fetch useEffect for gallery
  React.useEffect(() => {
    const fetchGallery = async () => {
      try {
        const response = await axiosInstance.get("/api/gallery");
        setGalleries(response.data);
      } catch (error) {
        console.error("Error fetching gallery:", error);
      }
    };
    fetchGallery();
  }, []);

  const imageSrc = watch("imageSrc")
    ? `${BASE_URL}/${watch("imageSrc")}`
    : undefined;

  const onSubmit: SubmitHandler<Gallery> = async (gallery) => {
    try {
      await axiosInstance.post("/api/gallery", gallery);
      setGalleries([...galleries, gallery]);
      reset();
    } catch (error) {
      console.error("Error adding gallery:", error);
    }
  };

  const onDelete = async (id: number) => {
    try {
      await axiosInstance.delete(`/api/gallery/${id}`);
      setGalleries(galleries.filter((gallery) => gallery.id !== id));
    } catch (error) {
      console.error("Error deleting gallery:", error);
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
              Add New Gallery Item
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Input
                    {...register("title")}
                    placeholder="Title"
                    className="w-full px-3 py-2 bg-gray-200 dark:bg-gray-700 rounded-md"
                  />
                  {errors.title && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.title.message}
                    </p>
                  )}
                </div>
                <div>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="w-full px-3 py-2 bg-gray-200 dark:bg-gray-700 rounded-md border"
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
            <CardTitle className="text-2xl font-bold">Gallery Items</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-bold">Title</TableHead>
                  <TableHead className="font-bold">Image</TableHead>
                  <TableHead className="font-bold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {galleries.map((gallery) => (
                  <TableRow
                    key={gallery.id}
                    className="hover:bg-gray-300 dark:hover:bg-gray-700"
                  >
                    <TableCell>{gallery.title}</TableCell>
                    <TableCell>
                      <img
                        src={BASE_URL + "/" + gallery.imageSrc}
                        alt={gallery.title}
                        className="w-20 h-20 object-cover rounded-md"
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="destructive"
                        onClick={() => gallery.id && onDelete(gallery.id)}
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

export default GalleryPage;
