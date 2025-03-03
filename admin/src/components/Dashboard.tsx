import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, Moon, Sun } from "lucide-react";
import { useTheme } from "./theme-provider";
import { Outlet } from "react-router-dom";
import AdminSidebar from "./sidebars/AdminSidebar";
import EmployerSidebar from "./sidebars/EmployerSidebar";
import JobSeekerSidebar from "./sidebars/JobSeekerSidebar";

interface DashboardProps {
  role: "admin" | "employer" | "jobseeker";
}

const Dashboard = ({ role }: DashboardProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { theme, setTheme } = useTheme();

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-50">
      {/* Navbar */}
      <nav className="text-white p-4 flex justify-between items-center shadow z-50">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="text-gray hover:bg-purple-600"
          >
            <Menu className="h-6 w-6 text-gray-600" />
          </Button>
          <h1 className="text-xl font-semibold text-slate-600">
            {role.charAt(0).toUpperCase() + role.slice(1)} Dashboard
          </h1>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="text-white hover:bg-purple-600"
        >
          {theme === "dark" ? (
            <Sun className="h-6 w-6" />
          ) : (
            <Moon className="h-6 w-6" />
          )}
        </Button>
      </nav>

      {/* Main content area with sidebar */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar based on role */}
        {role === "admin" && <AdminSidebar sidebarOpen={sidebarOpen} />}
        {role === "employer" && <EmployerSidebar sidebarOpen={sidebarOpen} />}
        {role === "jobseeker" && <JobSeekerSidebar sidebarOpen={sidebarOpen} />}

        {/* Main content */}
        <main
          className={`flex-1 overflow-auto transition-all duration-300 ease-in-out ${
            sidebarOpen ? "md:ml-64" : "ml-0"
          }`}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;

/* <h2 className="text-2xl font-bold mb-4 text-purple-500">
            Welcome to Your Dashboard
          </h2>
          <p>
            This is where your main content would go. You can add charts,
            tables, or any other components here.
          </p> */
