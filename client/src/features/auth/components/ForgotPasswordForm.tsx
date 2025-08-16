import React from "react";
import { ArrowLeft, Mail, CheckCircle } from "lucide-react";
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
import { Link } from "react-router-dom";
import { toast } from "sonner";
import Spinner from "../../../components/ui/Spinner";

const ForgotPasswordForm = () => {
  const [email, setEmail] = React.useState<string>("");
  const [sendEmailError, setSendEmailError] = React.useState<string>("");
  const [isEmailSent, setIsEmailSent] = React.useState<boolean>(false);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const handleBack = () => {
    setIsEmailSent(false);
    setSendEmailError("");
  };

  const handleSendResetEmail = async () => {
    if (!email) {
      setSendEmailError("Please enter your email address");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setSendEmailError("Please enter a valid email address");
      toast.error("Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    setSendEmailError("");

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Simulate success
      setIsEmailSent(true);
      console.log("Password reset email sent to:", email);
    } catch (error) {
      setSendEmailError("Failed to send reset email. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md bg-card border-border">
      <CardHeader className="space-y-1">
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="p-0 h-auto"
          >
            {isEmailSent && <ArrowLeft className="h-4 w-4" />}
          </Button>
          <CardTitle className="text-2xl font-bold text-card-foreground">
            {isEmailSent ? "Check your email" : "Forgot your password?"}
          </CardTitle>
        </div>
        <CardDescription className="text-muted-foreground">
          {isEmailSent || "Enter your email to receive a password reset link"}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {!isEmailSent ? (
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
              onChange={(e) => {
                setEmail(e.target.value);
                setSendEmailError("");
              }}
              className="bg-background border-input text-foreground placeholder:text-muted-foreground"
            />
            {sendEmailError && (
              <p className="text-sm text-red-500">{sendEmailError}</p>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex flex-col items-center space-y-4">
              <div className="flex justify-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              </div>

              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground">
                  {`We've sent a password reset link to ${email}.`} Please check
                  your inbox and follow the instructions to reset your password.
                </p>
                <p className="text-xs text-muted-foreground">
                  Don't see the email? Check your spam folder.
                </p>
              </div>

              {sendEmailError && (
                <p className="text-sm text-red-500 text-center">
                  {sendEmailError}
                </p>
              )}
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex flex-col space-y-3">
        {!isEmailSent ? (
          <Button
            onClick={handleSendResetEmail}
            className="w-full"
            disabled={isLoading || !email}
          >
            {isLoading ? (
              <>
                <Spinner />
                <span>Sending...</span>
              </>
            ) : (
              <>
                <Mail className="h-4 w-4" />
                <span>Reset Password</span>
              </>
            )}
          </Button>
        ) : (
          <Button variant="outline" className="w-full">
            <ArrowLeft />
            <Link to="/login"> Back to login</Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default ForgotPasswordForm;
