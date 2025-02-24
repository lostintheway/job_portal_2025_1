import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "@/api/api";
import { Card, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Bookmark {
  bookmarkId: number;
  // Add other bookmark properties based on your model
  title: string;
  createdDate: string;
}

const BookmarksPage = () => {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/bookmarks`);
        setBookmarks(response.data);
      } catch (error) {
        console.error("Failed to fetch bookmarks:", error);
      }
    };

    fetchBookmarks();
  }, []);

  return (
    <div className="p-6">
      <Card className="w-full">
        <CardHeader>
          <h2 className="text-2xl font-bold">Bookmarks</h2>
        </CardHeader>
        <div className="p-4">
          <Button className="mb-4">Create New Bookmark</Button>
          <div className="grid gap-4">
            {bookmarks.map((bookmark) => (
              <Card key={bookmark.bookmarkId} className="p-4">
                <h3>{bookmark.title}</h3>
                <p>
                  Created: {new Date(bookmark.createdDate).toLocaleDateString()}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default BookmarksPage;
