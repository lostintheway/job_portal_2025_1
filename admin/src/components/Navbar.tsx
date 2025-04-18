import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

interface NavbarProps {
  role: "admin" | "employer" | "jobseeker";
}

export function Navbar({ role }: NavbarProps) {
  const navigate = useNavigate();

  const getProfilePath = () => {
    switch (role) {
      case "admin":
        return "/admin/profile";
      case "employer":
        return "/employer/company-profile";
      case "jobseeker":
        return "/profile";
      default:
        return "/profile";
    }
  };

  return (
    <nav className="border-b bg-background">
      <div className="container mx-auto flex h-16 items-center px-4">
        <div className="flex items-center space-x-4">
          <Link to={`/${role}`}>
            <h1 className="text-xl font-semibold">
              {role === "admin" ? "Job Portal Admin" : "Job Portal"}
            </h1>
          </Link>
        </div>

        <div className="ml-auto flex items-center space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => {
                  navigate(getProfilePath());
                }}
              >
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  localStorage.removeItem("token");
                  navigate("/login");
                }}
              >
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}
