import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "@/api/api";
import { Card, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Category {
  categoryId: number;
  name: string;
  description: string;
  createdDate: string;
}

const CategoriesPage = () => {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/categories`);
        setCategories(response.data.data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="p-6">
      <Card className="w-full">
        <CardHeader>
          <h2 className="text-2xl font-bold">Categories</h2>
        </CardHeader>
        <div className="p-4">
          <Button className="mb-4">Create New Category</Button>
          <div className="grid gap-4">
            {categories.map((category) => (
              <Card key={category.categoryId} className="p-4">
                <h3 className="font-bold">{category.name}</h3>
                <p>{category.description}</p>
                <p className="text-sm text-gray-500">
                  Created: {new Date(category.createdDate).toLocaleDateString()}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default CategoriesPage;
