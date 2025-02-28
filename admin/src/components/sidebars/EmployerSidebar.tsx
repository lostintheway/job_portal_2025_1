import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { LayoutDashboard, Briefcase, Users, Building } from "lucide-react";

export default function EmployerSidebar({ sidebarOpen }: { sidebarOpen: boolean }) {
  return (
    <aside
      className={`bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-50 w-64 p-4 transition-all duration-300 ease-in-out transform ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      } absolute h-full z-10`}
    >
      <nav>
        <ul className="space-y-2">
          <li>
            <Link to="/employer/dashboard">
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
            <Link to="/employer/job-postings">
              <Button
                variant="ghost"
                className="w-full justify-start hover:bg-purple-100 dark:hover:bg-purple-900"
              >
                <Briefcase className="mr-2 h-4 w-4" />
                Job Postings
              </Button>
            </Link>
          </li>
          <li>
            <Link to="/employer/applications">
              <Button
                variant="ghost"
                className="w-full justify-start hover:bg-purple-100 dark:hover:bg-purple-900"
              >
                <Users className="mr-2 h-4 w-4" />
                Applications
              </Button>
            </Link>
          </li>
          <li>
            <Link to="/employer/company-profile">
              <Button
                variant="ghost"
                className="w-full justify-start hover:bg-purple-100 dark:hover:bg-purple-900"
              >
                <Building className="mr-2 h-4 w-4" />
                Company Profile
              </Button>
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
}