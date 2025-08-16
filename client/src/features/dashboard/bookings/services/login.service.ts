import type {
  LoginFormData,
  OtpEmailFormData,
  OtpVerifyFormData,
} from "../types";
import httpClient from "@/lib/httpClient";

export const login = async ({ email, password }: LoginFormData) => {
  const response = await httpClient.post("/auth/login", { email, password });
  return response.data;
};

export const requestOtpEmail = async ({ email }: OtpEmailFormData) => {
  const response = await httpClient.post("/auth/request-otp", { email });
  return response.data;
};

export const verifyOtp = async ({ email, otp }: OtpVerifyFormData) => {
  const response = await httpClient.post("/auth/verify-otp", { email, otp });
  return response.data;
};
