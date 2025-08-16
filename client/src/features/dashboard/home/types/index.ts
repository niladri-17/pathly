import z from "zod";
import { registerSchema } from "../schemas/register.schema";
import {
  loginSchema,
  otpEmailSchema,
  otpVerifySchema,
} from "../schemas/login.schema";
import { forgotPasswordSchema } from "../schemas/forgotPassword.schema";

export type RegisterFormData = z.infer<typeof registerSchema>;

export type LoginFormData = z.infer<typeof loginSchema>;
export type OtpEmailFormData = z.infer<typeof otpEmailSchema>;
export type OtpVerifyFormData = z.infer<typeof otpVerifySchema>;

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
