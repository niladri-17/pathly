import { z } from "zod";

export const addWebinarSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must be less than 100 characters"),
  duration: z
    .number()
    .min(15, "Duration must be at least 15 minutes")
    .max(480, "Duration cannot exceed 8 hours"),
  amount: z
    .number()
    .min(0, "Amount must be non-negative")
    .max(100000, "Amount cannot exceed ₹1,00,000"),
});
