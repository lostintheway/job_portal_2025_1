"use client";

import { useNavigate } from "react-router-dom";
import { api } from "../../api/api";
import { toast } from "sonner";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import FormInput from "@/components/form/FormInput";
import { isAxiosError } from "axios";

// Define a validation schema using zod
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
  userType: z.enum(["jobseeker", "employer", "admin"]),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const navigate = useNavigate();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      userType: "jobseeker",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const response = await api.login(data);
      if (response?.data?.data?.token) {
        toast.success("Login successful");
        const res = response.data.data;
        localStorage.setItem("token", res.token);
        localStorage.setItem("userType", res.user.role);
        if (res.user.role === "jobseeker") {
          navigate("/public");
        } else if (res.user.role === "admin") {
          navigate("/admin");
        } else if (res.user.role === "employer") {
          navigate("/employer");
        }
      }
    } catch (error) {
      if (isAxiosError(error)) {
        toast.error(error.response?.data.error);
        return;
      }
      toast.error("Login failed");
      console.error("Authentication error:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-500 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">
            Sign in to your account
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormInput name="email" control={form.control} />
              <FormInput
                type="password"
                name="password"
                control={form.control}
              />

              <FormField
                control={form.control}
                name="userType"
                render={() => (
                  <FormItem>
                    <FormLabel>I am a</FormLabel>
                    <FormControl>
                      <Controller
                        control={form.control}
                        name="userType"
                        render={({ field: { onChange, value } }) => (
                          <Select value={value} onValueChange={onChange}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select user type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="jobseeker">
                                Job Seeker
                              </SelectItem>
                              <SelectItem value="employer">Employer</SelectItem>
                              <SelectItem value="admin">Admin</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">
                Sign in
              </Button>
            </form>
          </Form>

          <div className="mt-4 text-center">
            <Button
              variant="link"
              type="button"
              onClick={() => navigate("/register")}
            >
              Need an account? Sign up
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
