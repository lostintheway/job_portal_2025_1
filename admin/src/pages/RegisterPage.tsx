import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { BASE_URL } from "@/api/api";
import { useNavigate } from "react-router-dom";

const registerSchema = z.object({
  email: z.string().email("Email is invalid").min(1, "Email is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  fullName: z.string().min(1, "Full name is required"),
  contactNumber: z.string().min(1, "Contact number is required"),
  address: z.string().min(1, "Address is required"),
  role: z.enum(["jobseeker", "vendor", "admin"], {
    required_error: "Please select a role",
  }),
  profileImage: z.string().optional()
});

type Register = z.infer<typeof registerSchema>;

const RegisterPage: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Register>({
    resolver: zodResolver(registerSchema),
  });

  const navigate = useNavigate();

  const onSubmit: SubmitHandler<Register> = async (registerData) => {
    try {
      await axios.post(BASE_URL + "/api/users/register", registerData);
      alert("Registration successful");
      navigate("/login");
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert(`Error registering: ${error.message}`);
      }
      console.log(error);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-500">
      <Card className="w-full max-w-md p-6 bg-slate-700 shadow-md">
        <CardHeader className="text-center mb-6">
          <h2 className="text-2xl font-semibold">Register</h2>
        </CardHeader>
        <div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-4">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                type="text"
                className="mt-1 w-full bg-white text-black"
                placeholder="Enter your full name"
                {...register("fullName")}
              />
              {errors.fullName && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.fullName.message}
                </p>
              )}
            </div>
            <div className="mb-4">
              <Label htmlFor="contactNumber">Contact Number</Label>
              <Input
                id="contactNumber"
                type="tel"
                className="mt-1 w-full bg-white text-black"
                placeholder="Enter your contact number"
                {...register("contactNumber")}
              />
              {errors.contactNumber && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.contactNumber.message}
                </p>
              )}
            </div>
            <div className="mb-4">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                type="text"
                className="mt-1 w-full bg-white text-black"
                placeholder="Enter your address"
                {...register("address")}
              />
              {errors.address && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.address.message}
                </p>
              )}
            </div>
            <div className="mb-4">
              <Label htmlFor="role">Role</Label>
              <Select onValueChange={(value) => setValue("role", value as "jobseeker" | "vendor" | "admin")}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="jobseeker">Job Seeker</SelectItem>
                  <SelectItem value="vendor">Vendor</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
              {errors.role && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.role.message}
                </p>
              )}
            </div>
            <div className="mb-4">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                className="mt-1 w-full"
                placeholder="Enter your email"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div className="mb-6">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                className="mt-1 w-full"
                placeholder="Enter your password"
                {...register("password")}
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>
            <Button className="w-full" type="submit">
              Sign Up
            </Button>
          </form>
          <p className="text-center mt-4 text-sm">
            Already have an account?{" "}
            <a href="/login" className="text-blue-500">
              Login
            </a>
          </p>
        </div>
      </Card>
    </div>
  );
};

export default RegisterPage;
