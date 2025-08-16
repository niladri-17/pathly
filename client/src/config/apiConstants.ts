export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://api.example.com";
export const API_ENDPOINTS = {
  // Authentication endpoints
  AUTH_LOGIN: `/auth/login`,
  AUTH_REGISTER: `/auth/register`,
  AUTH_LOGOUT: `/auth/logout`,
  AUTH_REQUEST_OTP: `/auth/request-otp`,
  AUTH_VERIFY_OTP: `/auth/verify-otp`,
  AUTH_RESET_PASSWORD: `/auth/reset-password`,
} as const;
