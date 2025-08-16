import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, ArrowLeft, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Spinner from "@/components/ui/Spinner";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import GoogleIcon from "@/components/icons/GoogleIcon";
import { Link } from "react-router-dom";
import {
  loginSchema,
  otpEmailSchema,
  otpVerifySchema,
} from "../schemas/login.schema";
import type {
  LoginFormData,
  OtpEmailFormData,
  OtpVerifyFormData,
} from "../types";

const LoginForm: React.FC = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoginWithOtp, setIsLoginWithOtp] = useState<boolean>(false);
  const [isOtpSent, setIsOtpSent] = useState<boolean>(false);
  const [otpValue, setOtpValue] = useState<string>("");
  const [countdown, setCountdown] = useState<number>(0);
  const [isResendingOtp, setIsResendingOtp] = useState<boolean>(false);
  const [currentEmail, setCurrentEmail] = useState<string>("");

  // React Hook Form for main login
  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
    mode: "onSubmit",
  });

  // React Hook Form for OTP email
  const otpEmailForm = useForm<OtpEmailFormData>({
    resolver: zodResolver(otpEmailSchema),
    defaultValues: {
      email: "",
    },
  });

  // React Hook Form for OTP verification - Fix: Update defaultValues when currentEmail changes
  const otpVerifyForm = useForm<OtpVerifyFormData>({
    resolver: zodResolver(otpVerifySchema),
    defaultValues: {
      email: "",
      otp: "",
    },
  });

  // Update OTP verify form email when currentEmail changes
  useEffect(() => {
    if (currentEmail) {
      otpVerifyForm.setValue("email", currentEmail);
    }
  }, [currentEmail, otpVerifyForm]);

  // Countdown timer for resend OTP
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [countdown]);

  // Sync OTP input with form
  useEffect(() => {
    otpVerifyForm.setValue("otp", otpValue);
    if (otpValue.length === 6) {
      otpVerifyForm.trigger("otp");
    }
  }, [otpValue, otpVerifyForm]);

  const onLoginSubmit = async (data: LoginFormData) => {
    try {
      console.log("Login attempt:", data);
      // Simulate login process
      await new Promise((resolve) => setTimeout(resolve, 2000));
      alert("Login successful!");
    } catch (error) {
      console.error("Login error:", error);
      loginForm.setError("root", {
        type: "manual",
        message: "Login failed. Please try again.",
      });
    }
  };

  const onOtpEmailSubmit = async (data: OtpEmailFormData) => {
    try {
      setCurrentEmail(data.email);
      // Simulate OTP sending
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setIsOtpSent(true);
      setCountdown(60);
      console.log("OTP sent to:", data.email);
    } catch (error) {
      console.error("OTP send error:", error);
      otpEmailForm.setError("root", {
        type: "manual",
        message: "Failed to send OTP. Please try again.",
      });
    }
  };

  const onOtpVerifySubmit = async (data: OtpVerifyFormData) => {
    try {
      // Simulate OTP verification
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // For demo purposes, accept "123456" as valid OTP
      if (data.otp === "123456") {
        console.log("OTP verified successfully for:", currentEmail);
        alert("Login successful!");
        // Reset all forms and states after successful login
        resetAllForms();
      } else {
        otpVerifyForm.setError("otp", {
          type: "manual",
          message: "Invalid OTP. Please try again.",
        });
      }
    } catch (error) {
      console.error("OTP verification error:", error);
      otpVerifyForm.setError("root", {
        type: "manual",
        message: "Verification failed. Please try again.",
      });
    }
  };

  const handleResendOtp = async () => {
    try {
      setIsResendingOtp(true);
      setOtpValue("");
      otpVerifyForm.clearErrors();
      otpVerifyForm.setValue("otp", "");

      // Simulate OTP resending
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setCountdown(60);
      console.log("OTP resent to:", currentEmail);
    } catch (error) {
      console.error("Resend OTP error:", error);
    } finally {
      setIsResendingOtp(false);
    }
  };

  const resetAllForms = () => {
    // Reset all forms
    loginForm.reset();
    otpEmailForm.reset();
    otpVerifyForm.reset();

    // Reset all states
    setIsLoginWithOtp(false);
    setIsOtpSent(false);
    setOtpValue("");
    setCountdown(0);
    setCurrentEmail("");
    setIsResendingOtp(false);
    setShowPassword(false);
  };

  const handleBackToLogin = () => {
    if (isOtpSent) {
      // Go back to OTP email step
      setIsOtpSent(false);
      setOtpValue("");
      setCountdown(0);
      otpVerifyForm.reset();
      return;
    }
    // Go back to main login
    resetAllForms();
  };

  const handleGoogleLogin = () => {
    console.log("Google login clicked");
    // Implement Google OAuth here
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  // OTP Login Flow
  if (isLoginWithOtp) {
    return (
      <Card className="w-full max-w-md bg-card border-border">
        <CardHeader className="space-y-1">
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBackToLogin}
              className="p-0 h-auto"
              aria-label="Go back"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <CardTitle className="text-2xl font-bold text-card-foreground">
              {isOtpSent ? "Verify OTP" : "Login with OTP"}
            </CardTitle>
          </div>
          <CardDescription className="text-muted-foreground">
            {isOtpSent
              ? `Enter the 6-digit code sent to ${currentEmail}`
              : "Enter your email to receive an OTP"}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {!isOtpSent ? (
            <Form {...otpEmailForm}>
              <form onSubmit={otpEmailForm.handleSubmit(onOtpEmailSubmit)}>
                <div className="space-y-4">
                  <FormField
                    control={otpEmailForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="Enter your email"
                            {...field}
                            className="bg-background border-input text-foreground placeholder:text-muted-foreground"
                            disabled={otpEmailForm.formState.isSubmitting}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {otpEmailForm.formState.errors.root && (
                    <div className="text-sm text-destructive">
                      {otpEmailForm.formState.errors.root.message}
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={otpEmailForm.formState.isSubmitting}
                  >
                    {otpEmailForm.formState.isSubmitting ? (
                      <>
                        <Spinner />
                        Sending OTP...
                      </>
                    ) : (
                      "Send OTP"
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          ) : (
            <Form {...otpVerifyForm}>
              <form onSubmit={otpVerifyForm.handleSubmit(onOtpVerifySubmit)}>
                <div className="space-y-4">
                  <FormField
                    control={otpVerifyForm.control}
                    name="otp"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="flex justify-center">
                            <InputOTP
                              maxLength={6}
                              value={otpValue}
                              onChange={(value) => {
                                setOtpValue(value);
                                field.onChange(value);
                                // Clear errors when user starts typing
                                if (otpVerifyForm.formState.errors.otp) {
                                  otpVerifyForm.clearErrors("otp");
                                }
                              }}
                              disabled={otpVerifyForm.formState.isSubmitting}
                            >
                              <InputOTPGroup>
                                {Array.from({ length: 6 }, (_, index) => (
                                  <InputOTPSlot key={index} index={index} />
                                ))}
                              </InputOTPGroup>
                            </InputOTP>
                          </div>
                        </FormControl>
                        <FormMessage className="text-center" />
                      </FormItem>
                    )}
                  />

                  {otpVerifyForm.formState.errors.root && (
                    <div className="text-sm text-destructive text-center">
                      {otpVerifyForm.formState.errors.root.message}
                    </div>
                  )}

                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-2">
                      Didn't receive the code?
                    </p>
                    {countdown > 0 ? (
                      <p className="text-sm text-muted-foreground">
                        Resend OTP in {countdown}s
                      </p>
                    ) : (
                      <Button
                        type="button"
                        variant="link"
                        onClick={handleResendOtp}
                        disabled={isResendingOtp}
                        className="px-0 font-normal text-primary hover:text-primary/80"
                      >
                        {isResendingOtp ? (
                          <>
                            <Spinner />
                            Resending...
                          </>
                        ) : (
                          "Resend OTP"
                        )}
                      </Button>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={
                      otpVerifyForm.formState.isSubmitting ||
                      otpValue.length !== 6
                    }
                  >
                    {otpVerifyForm.formState.isSubmitting ? (
                      <>
                        <Spinner />
                        Verifying...
                      </>
                    ) : (
                      "Verify OTP"
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          )}
        </CardContent>
      </Card>
    );
  }

  // Regular Login Form
  return (
    <Card className="w-full max-w-md bg-card border-border">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-card-foreground">
          Welcome back
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Enter your credentials to access your account
        </CardDescription>
      </CardHeader>

      <Form {...loginForm}>
        <form onSubmit={loginForm.handleSubmit(onLoginSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={loginForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      {...field}
                      className="bg-background border-input text-foreground placeholder:text-muted-foreground"
                      disabled={loginForm.formState.isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={loginForm.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <div className="flex justify-between">
                    <FormLabel>Password</FormLabel>
                    <Link
                      to="/forgot-password"
                      className="text-sm text-primary hover:text-primary/80 hover:underline underline-offset-4"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <FormControl>
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        {...field}
                        className="bg-background border-input text-foreground placeholder:text-muted-foreground pr-10"
                        disabled={loginForm.formState.isSubmitting}
                      />
                    </FormControl>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={togglePasswordVisibility}
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {loginForm.formState.errors.root && (
              <div className="text-sm text-destructive">
                {loginForm.formState.errors.root.message}
              </div>
            )}
          </CardContent>

          <CardFooter className="flex flex-col space-y-4 mt-4">
            <Button
              type="submit"
              className="w-full"
              disabled={loginForm.formState.isSubmitting}
            >
              {loginForm.formState.isSubmitting ? (
                <>
                  <Spinner />
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </Button>

            <div className="flex gap-2 w-full">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => setIsLoginWithOtp(true)}
                disabled={loginForm.formState.isSubmitting}
              >
                <Smartphone className="w-4 h-4 mr-2" />
                <span>Login with OTP</span>
              </Button>

              <Button
                type="button"
                variant="outline"
                className="flex-1 flex items-center justify-center gap-2"
                onClick={handleGoogleLogin}
                disabled={loginForm.formState.isSubmitting}
              >
                <GoogleIcon />
                <span>Login with Google</span>
              </Button>
            </div>

            <div className="text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-sm text-primary hover:text-primary/80 hover:underline underline-offset-4"
              >
                Sign up
              </Link>
            </div>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};

export default LoginForm;
