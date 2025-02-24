import { Link } from "react-router-dom";
import { Button } from "./ui/button";

export default function Sidebar({ sidebarOpen }: { sidebarOpen: boolean }) {
  return (
    <aside
      className={`bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-50 w-64 p-4 transition-all duration-300 ease-in-out transform ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      } absolute h-full z-10`}
    >
      <nav>
        <ul className="space-y-2">
          <li>
            <Link to="/admin/application">
              <Button
                variant="ghost"
                className="w-full justify-start hover:bg-purple-100 dark:hover:bg-purple-900"
              >
                Applications
              </Button>
            </Link>
          </li>
          <li>
            <Link to="/admin/vendor-organization">
              <Button
                variant="ghost"
                className="w-full justify-start hover:bg-purple-100 dark:hover:bg-purple-900"
              >
                Vendor Organizations
              </Button>
            </Link>
          </li>
          <li>
            <Link to="/admin/category">
              <Button
                variant="ghost"
                className="w-full justify-start hover:bg-purple-100 dark:hover:bg-purple-900"
              >
                Categories
              </Button>
            </Link>
          </li>
          <li>
            <Link to="/admin/job-description">
              <Button
                variant="ghost"
                className="w-full justify-start hover:bg-purple-100 dark:hover:bg-purple-900"
              >
                Job Descriptions
              </Button>
            </Link>
          </li>
          <li>
            <Link to="/admin/bookmarks">
              <Button
                variant="ghost"
                className="w-full justify-start hover:bg-purple-100 dark:hover:bg-purple-900"
              >
                Bookmarks
              </Button>
            </Link>
          </li>
          <li>
            <Link to="/admin/profile">
              <Button
                variant="ghost"
                className="w-full justify-start hover:bg-purple-100 dark:hover:bg-purple-900"
              >
                Profiles
              </Button>
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
