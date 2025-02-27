import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../api/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { isAxiosError } from "axios";

type UserRole = "jobseeker" | "employer" | "admin";

interface RegisterFormData {
  email: string;
  password: string;
  fullName: string;
  contactNumber: string;
  address: string;
  role: UserRole;
}

export default function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<RegisterFormData>({
    email: "",
    password: "",
    fullName: "",
    contactNumber: "",
    address: "",
    role: "jobseeker",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.register(formData);

      if (response.data.success) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("userType", formData.role);
        toast.success("Registration successful!");
        navigate(formData.role === "jobseeker" ? "/jobs" : "/dashboard");
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error("Error: " + error.message);
        console.error("Registration error:", error);
      } else if (isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Registration failed");
      } else if (
        typeof error === "object" &&
        error !== null &&
        "response" in error
      ) {
        // Handle axios error-like objects
        const axiosError = error as {
          response?: { data?: { message?: string } };
        };
        toast.error(
          axiosError.response?.data?.message || "Registration failed"
        );
        console.error("Registration error:", error);
      } else {
        toast.error("Registration failed");
        console.error("Unknown registration error:", error);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="text-center dark:text-white">
            Create your account
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="dark:text-gray-300">
                  Email address
                </Label>
                <Input
                  id="email"
                  type="email"
                  required
                  placeholder="Email address"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="dark:bg-gray-700 dark:text-white dark:border-gray-600"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="dark:text-gray-300">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  required
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="dark:bg-gray-700 dark:text-white dark:border-gray-600"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fullName" className="dark:text-gray-300">
                  Full Name
                </Label>
                <Input
                  id="fullName"
                  type="text"
                  required
                  placeholder="Full Name"
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                  className="dark:bg-gray-700 dark:text-white dark:border-gray-600"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactNumber" className="dark:text-gray-300">
                  Contact Number
                </Label>
                <Input
                  id="contactNumber"
                  type="tel"
                  required
                  placeholder="Contact Number"
                  value={formData.contactNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, contactNumber: e.target.value })
                  }
                  className="dark:bg-gray-700 dark:text-white dark:border-gray-600"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address" className="dark:text-gray-300">
                  Address
                </Label>
                <Input
                  id="address"
                  type="text"
                  required
                  placeholder="Address"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  className="dark:bg-gray-700 dark:text-white dark:border-gray-600"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role" className="dark:text-gray-300">
                  I am a
                </Label>
                <Select
                  value={formData.role}
                  onValueChange={(value: UserRole) =>
                    setFormData({ ...formData, role: value })
                  }
                >
                  <SelectTrigger className="dark:bg-gray-700 dark:text-white dark:border-gray-600">
                    <SelectValue placeholder="Select user type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="jobseeker">Job Seeker</SelectItem>
                    <SelectItem value="employer">Employer</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button type="submit" className="w-full">
              Sign up
            </Button>

            <div className="text-center">
              <Button
                variant="link"
                type="button"
                onClick={() => navigate("/login")}
                className="dark:text-gray-300"
              >
                Already have an account? Sign in
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
