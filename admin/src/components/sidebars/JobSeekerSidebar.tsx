import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import {
  LayoutDashboard,
  Search,
  FileText,
  Bookmark,
  User,
} from "lucide-react";

export default function JobSeekerSidebar({
  sidebarOpen,
}: {
  sidebarOpen: boolean;
}) {
  return (
    <aside
      className={`bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-50 w-64 p-4 transition-all duration-300 ease-in-out transform ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      } absolute h-full z-10`}
    >
      <nav>
        <ul className="space-y-2">
          <li>
            <Link to="/dashboard">
              <Button
                variant="ghost"
                className="w-full justify-start hover:bg-purple-100 dark:hover:bg-purple-900"
              >
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Dashboard
              </Button>
            </Link>
          </li>
          <li>
            <Link to="/jobs">
              <Button
                variant="ghost"
                className="w-full justify-start hover:bg-purple-100 dark:hover:bg-purple-900"
              >
                <Search className="mr-2 h-4 w-4" />
                Search Jobs
              </Button>
            </Link>
          </li>
          <li>
            <Link to="/applications">
              <Button
                variant="ghost"
                className="w-full justify-start hover:bg-purple-100 dark:hover:bg-purple-900"
              >
                <FileText className="mr-2 h-4 w-4" />
                My Applications
              </Button>
            </Link>
          </li>
          <li>
            <Link to="/bookmarks">
              <Button
                variant="ghost"
                className="w-full justify-start hover:bg-purple-100 dark:hover:bg-purple-900"
              >
                <Bookmark className="mr-2 h-4 w-4" />
                Bookmarks
              </Button>
            </Link>
          </li>
          <li>
            <Link to="/profile">
              <Button
                variant="ghost"
                className="w-full justify-start hover:bg-purple-100 dark:hover:bg-purple-900"
              >
                <User className="mr-2 h-4 w-4" />
                Profile
              </Button>
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
