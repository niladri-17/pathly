import z from "zod";

// Zod schemas
export const registerSchema = z.object({
  firstName: z
    .string()
    .min(2, "First name must be at least 2 characters")
    .max(100, "First name must be at most 100 characters"),
  lastName: z
    .string()
    .min(2, "Last name must be at least 2 characters")
    .max(100, "Last name must be at most 100 characters"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
  rememberMe: z.boolean().optional(),
});

export type RegisterFormData = z.infer<typeof registerSchema>;
