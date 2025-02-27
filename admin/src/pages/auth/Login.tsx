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

type UserType = "jobseeker" | "employer";

interface AuthFormData {
  email: string;
  password: string;
  name?: string;
  userType: UserType;
}

export default function AuthPage() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState<AuthFormData>({
    email: "",
    password: "",
    name: "",
    userType: "jobseeker",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = isLogin
        ? await api.login(formData)
        : await api.register(formData);

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("userType", formData.userType);
        navigate(formData.userType === "jobseeker" ? "/jobs" : "/dashboard");
      }
    } catch (error) {
      console.error("Authentication error:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">
            {isLogin ? "Sign in to your account" : "Create a new account"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    type="text"
                    required
                    placeholder="Full name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  placeholder="Email address"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="userType">I am a</Label>
                <Select
                  value={formData.userType}
                  onValueChange={(value: UserType) =>
                    setFormData({ ...formData, userType: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select user type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="jobseeker">Job Seeker</SelectItem>
                    <SelectItem value="employer">Employer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button type="submit" className="w-full">
              {isLogin ? "Sign in" : "Sign up"}
            </Button>

            <div className="text-center">
              <Button
                variant="link"
                type="button"
                onClick={() => setIsLogin(!isLogin)}
              >
                {isLogin
                  ? "Need an account? Sign up"
                  : "Already have an account? Sign in"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
