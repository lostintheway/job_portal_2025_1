import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "@/api/api";
import { Card, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Category {
  categoryId: number;
  categoryName: string;
  createdBy: number;
  createdDate: Date;
  updatedBy: number | null;
  updatedDate: Date | null;
  deletedBy: number | null;
  deletedDate: Date | null;
  isDeleted: boolean;
}

const CategoriesPage = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState('');

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

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) {
      setError('Category name is required');
      return;
    }

    setIsCreating(true);
    setError('');

    try {
      const response = await axios.post(`${BASE_URL}/api/categories`, {
        categoryName: newCategoryName
      });
      
      setCategories([...categories, response.data.data]);
      setNewCategoryName('');
      setIsCreating(false);
    } catch (error) {
      console.error('Failed to create category:', error);
      setError('Failed to create category. Please try again.');
      setIsCreating(false);
    }
  };

  return (
    <div className="p-6">
      <Card className="w-full">
        <CardHeader>
          <h2 className="text-2xl font-bold">Categories</h2>
        </CardHeader>
        <div className="p-4">
          <div className="mb-4 flex gap-4 items-center">
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="Enter category name"
              className="px-3 py-2 border rounded-md flex-1"
            />
            <Button 
              onClick={handleCreateCategory}
              disabled={isCreating}
            >
              {isCreating ? 'Creating...' : 'Create Category'}
            </Button>
          </div>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <div className="grid gap-4">
            {categories.map((category) => (
              <Card key={category.categoryId} className="p-4">
                <h3 className="font-bold">{category.categoryName}</h3>
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
