import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Spinner from "@/components/ui/Spinner";

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 48 48">
    <path
      fill="#EA4335"
      d="M24 9.5c3.15 0 5.94 1.08 8.17 2.86l6.1-6.1C34.55 3.12 29.55 1 24 1 14.61 1 6.68 6.74 3.19 14.58l7.76 6.03C12.88 14.3 17.98 9.5 24 9.5z"
    />
    <path
      fill="#4285F4"
      d="M46.15 24.5c0-1.64-.15-3.22-.42-4.74H24v9h12.42c-.54 2.91-2.16 5.4-4.58 7.05l7.22 5.6C43.9 37.51 46.15 31.48 46.15 24.5z"
    />
    <path
      fill="#FBBC05"
      d="M10.95 28.05a14.49 14.49 0 0 1-.76-4.55c0-1.58.28-3.11.76-4.55l-7.76-6.03A23.963 23.963 0 0 0 1 23.5c0 3.84.94 7.45 2.59 10.65l7.36-6.1z"
    />
    <path
      fill="#34A853"
      d="M24 46c6.48 0 11.91-2.14 15.88-5.8l-7.22-5.6C30.6 36.17 27.47 37 24 37c-6.02 0-11.12-4.8-12.76-11.11l-7.76 6.03C6.68 41.26 14.61 46 24 46z"
    />
    <path fill="none" d="M1 1h46v46H1z" />
  </svg>
);

const SignUpForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate login process
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsLoading(false);
    console.log("Login attempt:", { email, password });
  };

  return (
    <Card className="w-full max-w-md bg-card border-border">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-card-foreground">
          Get Started
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Enter your credentials to create a new account
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="flex justify-between gap-4">
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-sm font-medium text-foreground"
              >
                First Name
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your first name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="bg-background border-input text-foreground placeholder:text-muted-foreground"
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-sm font-medium text-foreground"
              >
                Last Name
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="bg-background border-input text-foreground placeholder:text-muted-foreground"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="email"
              className="text-sm font-medium text-foreground"
            >
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-background border-input text-foreground placeholder:text-muted-foreground"
            />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>Password</Label>
              <Link
                to="/forgot-password"
                className="text-sm text-primary hover:text-primary/80 hover:underline underline-offset-4"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-background border-input text-foreground placeholder:text-muted-foreground pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 mt-6">
          <Button
            onClick={handleSubmit}
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Spinner />
                Signing up...
              </>
            ) : (
              "Sign up"
            )}
          </Button>

          <Button variant="outline" className="w-full">
            <GoogleIcon />
            <span>Login with Google</span>
          </Button>
          <div className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-sm text-primary hover:text-primary/80 hover:underline underline-offset-4"
            >
              Sign in
            </Link>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
};

export default SignUpForm;
