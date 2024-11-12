"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { initiateGoogleLogin } from "@/lib/auth/google";
import { signIn, signUp } from "@/lib/auth";
import { handleAuthTokens } from "@/lib/utils";
import { Icons } from "@/components/icons";

export default function AuthPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isSignIn, setIsSignIn] = useState(true);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const router = useRouter();

  const handleGoogleLogin = async () => {
    try {
      const authUrl = await initiateGoogleLogin();
      window.location.href = authUrl;
    } catch (error) {
      console.error("Google login error:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let data;
      if (isSignIn) {
        data = await signIn(formData.email, formData.password);
      } else {
        data = await signUp({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
        });
      }

      if (handleAuthTokens(data)) {
        router.push("/dashboard");
      } else {
        throw new Error("Failed to authenticate");
      }
    } catch (error) {
      console.error("Authentication error:", error);
      // You might want to add user-facing error handling here
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-r from-blue-50 to-blue-100">
      <div className="w-full max-w-md space-y-6">
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="bg-blue-500 p-1 rounded-lg">
            {Icons.logo}
          </div>
          <h1 className="text-2xl font-bold text-gray-800">LLM Gateway</h1>
        </div>

        <Card className="shadow-lg rounded-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-semibold tracking-tight text-gray-800">
              {isSignIn ? "Welcome back" : "Create an account"}
            </CardTitle>
            <CardDescription className="text-gray-600">
              {isSignIn
                ? "Enter your credentials to access your account"
                : "Enter your information to get started"}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <Button
              variant="outline"
              className="w-full py-3 text-base font-normal relative mb-6 border-gray-300 flex items-center justify-center gap-2"
              onClick={handleGoogleLogin}
            >
              {Icons.google}
              <span>Sign In with Google</span>
            </Button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">
                  or continue with
                </span>
              </div>
            </div>

            <Tabs
              defaultValue={isSignIn ? "signin" : "signup"}
              className="mb-6"
              onValueChange={(value) => setIsSignIn(value === "signin")}
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
            </Tabs>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-4">
                {!isSignIn && (
                  <div className="flex flex-row gap-2">
                    <Input
                      type="text"
                      name="firstName"
                      placeholder="First Name"
                      className="h-12"
                      value={formData.firstName}
                      onChange={handleInputChange}
                    />
                    <Input
                      type="text"
                      name="lastName"
                      placeholder="Last Name"
                      className="h-12"
                      value={formData.lastName}
                      onChange={handleInputChange}
                    />
                  </div>
                )}
                <Input
                  type="email"
                  name="email"
                  placeholder="Email"
                  className="h-12"
                  value={formData.email}
                  onChange={handleInputChange}
                />

                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Password"
                    className="h-12 pr-10"
                    value={formData.password}
                    onChange={handleInputChange}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? (
                      <EyeOffIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-12 text-base bg-blue-500 text-white hover:bg-blue-600"
              >
                {isSignIn ? "Sign In" : "Sign Up"}
              </Button>

              {isSignIn && (
                <Button
                  variant="ghost"
                  className="w-full font-normal text-sm text-blue-500 hover:underline"
                >
                  Forgot password?
                </Button>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
