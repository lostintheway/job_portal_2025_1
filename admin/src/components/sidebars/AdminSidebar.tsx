import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { LayoutDashboard, Users, Briefcase, Settings } from "lucide-react";

export default function AdminSidebar({ sidebarOpen }: { sidebarOpen: boolean }) {
  return (
    <aside
      className={`bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-50 w-64 p-4 transition-all duration-300 ease-in-out transform ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      } absolute h-full z-10`}
    >
      <nav>
        <ul className="space-y-2">
          <li>
            <Link to="/admin/dashboard">
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
            <Link to="/admin/users">
              <Button
                variant="ghost"
                className="w-full justify-start hover:bg-purple-100 dark:hover:bg-purple-900"
              >
                <Users className="mr-2 h-4 w-4" />
                User Management
              </Button>
            </Link>
          </li>
          <li>
            <Link to="/admin/job-listings">
              <Button
                variant="ghost"
                className="w-full justify-start hover:bg-purple-100 dark:hover:bg-purple-900"
              >
                <Briefcase className="mr-2 h-4 w-4" />
                Job Listings
              </Button>
            </Link>
          </li>
          <li>
            <Link to="/admin/settings">
              <Button
                variant="ghost"
                className="w-full justify-start hover:bg-purple-100 dark:hover:bg-purple-900"
              >
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Button>
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
}