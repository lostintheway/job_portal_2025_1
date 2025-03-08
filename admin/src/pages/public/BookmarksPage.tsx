import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../api/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface Bookmark {
  bookmarkId: string;
  jobId: string;
  jobTitle: string;
  jobLocation: string;
  jobType: string;
  jobDescription: string;
  jobSalary: string;
  // Add other bookmark properties if needed
}

interface BookmarkResponse {
  success: boolean;
  data: Bookmark[];
}

export default function BookmarksPage() {
  const navigate = useNavigate();
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookmarks();
  }, []);

  const fetchBookmarks = async () => {
    try {
      const response = await api.getBookmarkedJobs();
      const bookmarksData = response.data as BookmarkResponse;
      setBookmarks(bookmarksData.data);
    } catch (error) {
      console.error("Error fetching bookmarks:", error);
      toast.error("Failed to load bookmarks");
    } finally {
      setLoading(false);
    }
  };

  const viewJobDetails = (jobId: string) => {
    navigate(`/jobs/${jobId}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (bookmarks.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-6">
            <p className="text-center text-gray-500">No bookmarks found</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">My Bookmarks</h1>
      <div className="space-y-4">
        {bookmarks.map((bookmark) => (
          <Card key={bookmark.bookmarkId} className="overflow-hidden">
            <CardContent className="p-6 flex justify-between items-center">
              <div>
                <p className="text-normal">Job ID: {bookmark.jobId}</p>

                <p className="text-sm text-gray-800 font-semibold">
                  Job Title: {bookmark.jobTitle}
                </p>
                <p className="text-sm text-gray-500">
                  Location: {bookmark.jobLocation}
                </p>
                <p className="text-sm text-gray-500">
                  Type: {bookmark.jobType}
                </p>
                <p className="text-sm text-gray-500">
                  Description: {bookmark.jobDescription}
                </p>
                <p className="text-sm text-gray-500">
                  Salary: {bookmark.jobSalary}
                </p>
                <Button
                  className="bg-green-500 hover:bg-green-600"
                  variant="outline"
                  onClick={() => viewJobDetails(bookmark.jobId)}
                >
                  View Job
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
