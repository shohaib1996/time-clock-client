"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import Lottie from "lottie-react";
import loginAnimation from "../../../public/Login.json";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import { useRouter } from "next/navigation";
import { AuthAPI } from "@/lib/api";
import { toast } from "sonner";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginType, setLoginType] = useState<"admin" | "employee">("admin");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsLoading(true);

    try {
      const res =
        loginType === "admin"
          ? await AuthAPI.loginAdmin({ email, password })
          : await AuthAPI.loginEmployee({ email, password });

      const { name, role, id } = res.data.user;
      const userData = { name, email, role, id };

      localStorage.setItem("user", JSON.stringify(userData));

      toast.success(`${loginType === "admin" ? "Admin" : "Employee"} login successful!`);
      router.push(loginType === "admin" ? "/admin" : "/employee");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Invalid credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-indigo-100 via-white to-purple-100 dark:from-slate-900 dark:via-slate-950 dark:to-indigo-950">
      {/* === Top Right Theme Toggle === */}
      <div className="absolute top-6 right-6 z-50 flex items-center justify-end">
        <div className="backdrop-blur-md bg-white/50 dark:bg-slate-900/30 rounded-full shadow-md px-3 py-2">
          <AnimatedThemeToggler />
        </div>
      </div>

      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-purple-600/10 pointer-events-none" />

      <div className="w-full max-w-5xl flex flex-col md:flex-row items-center justify-center md:justify-between gap-10 px-6 py-12 relative z-10 backdrop-blur-xl bg-white/40 dark:bg-white/5 rounded-3xl shadow-2xl border border-white/20">
        {/* Left Side: Lottie Animation */}
        <div className="md:w-1/2 w-full flex items-center justify-center">
          <div className="w-4/5 md:w-full max-w-sm animate-float">
            <Lottie animationData={loginAnimation} loop={true} />
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="md:w-1/2 w-full">
          <Card className="w-full max-w-md mx-auto shadow-lg border-0 bg-white/80 dark:bg-slate-900/70 backdrop-blur-md rounded-2xl">
            <CardHeader className="text-center space-y-2">
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                {loginType === "admin" ? "Admin Login" : "Employee Login"} 👋
              </CardTitle>
              <CardDescription className="text-gray-500 dark:text-gray-400">
                Sign in to your {loginType} dashboard and stay productive
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Toggle Login Type */}
              <div className="flex justify-center gap-4">
                <Button
                  type="button"
                  variant={loginType === "admin" ? "default" : "outline"}
                  className={`rounded-xl w-32 transition-all ${
                    loginType === "admin"
                      ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md"
                      : ""
                  }`}
                  onClick={() => setLoginType("admin")}
                  disabled={isLoading}
                >
                  Admin
                </Button>
                <Button
                  type="button"
                  variant={loginType === "employee" ? "default" : "outline"}
                  className={`rounded-xl w-32 transition-all ${
                    loginType === "employee"
                      ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md"
                      : ""
                  }`}
                  onClick={() => setLoginType("employee")}
                  disabled={isLoading}
                >
                  Employee
                </Button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    className="h-12 rounded-xl border-gray-200 dark:border-gray-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="password"
                    className="text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isLoading}
                      className="h-12 rounded-xl pr-12 border-gray-200 dark:border-gray-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-3 top-1/2 -translate-y-1/2 h-6 w-6 p-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isLoading}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                {/* Button with loading spinner */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="animate-spin h-5 w-5 mr-2" />
                      Logging in...
                    </>
                  ) : loginType === "admin" ? (
                    "Sign in as Admin"
                  ) : (
                    "Sign in as Employee"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Floating animation keyframes */}
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
