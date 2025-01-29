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
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Email is invalid").min(1, "Email is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
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
    <div className="flex items-center justify-center h-screen bg-gray-300">
      <Card className="w-full max-w-md p-6 bg-gray-200 shadow-md">
        <CardHeader className="text-center mb-6">
          <h2 className="text-2xl font-semibold">Register</h2>
        </CardHeader>
        <div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-4">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                className="mt-1 w-full"
                placeholder="Enter your name"
                {...register("name")}
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.name.message}
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
