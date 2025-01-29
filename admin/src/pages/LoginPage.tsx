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

const loginSchema = z.object({
  email: z.string().min(1, "Email is required"),
  password: z.string().min(1, "Password is required"),
});

type Login = z.infer<typeof loginSchema>;

const LoginPage: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Login>({
    resolver: zodResolver(loginSchema),
  });
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<Login> = async (login) => {
    try {
      const response = await axios.post<{
        token: string;
      }>(BASE_URL + "/api/users/login", login);
      localStorage.setItem("token", response.data.token);
      alert("Login successful");
      navigate("/admin/gallery");
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert(`Error logging in: ${error.message}`);
      }
      console.log(error);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-300">
      <Card className="w-full max-w-md p-6 bg-gray-200 shadow-md">
        <CardHeader className="text-center mb-6">
          <h2 className="text-2xl font-semibold">Login</h2>
        </CardHeader>
        <div>
          <form onSubmit={handleSubmit(onSubmit)}>
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
              Sign In
            </Button>
          </form>
          <p className="text-center mt-4 text-sm">
            Don't have an account?{" "}
            <a href="/register" className="text-blue-500">
              Register
            </a>
          </p>
        </div>
      </Card>
    </div>
  );
};

export default LoginPage;
