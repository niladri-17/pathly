import z from "zod";

export const baseEditServiceSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title too long"),
  description: z
    .string()
    .min(1, "Description is required")
    .max(200, "Description too long"),
  pricing: z.string().min(1, "Pricing is required"),
  //   configurations: z.object({
  //     enableNotifications: z.boolean().default(false),
  //     enableAnalytics: z.boolean().default(false),
  //     enableSharing: z.boolean().default(false),
  //   }),
});

// Service-specific schemas
export const editOneOnOneCallSchema = baseEditServiceSchema.extend({
  serviceType: z.literal("1-1-call"),
  duration: z
    .number()
    .min(15, "Minimum 15 minutes")
    .max(180, "Maximum 180 minutes"),
  meetingLink: z.string().url("Invalid URL").optional().or(z.literal("")),
  preparationNotes: z.string().optional(),
});

export const editPriorityDMSchema = baseEditServiceSchema.extend({
  serviceType: z.literal("priority-dm"),
  responseTime: z.enum(["immediate", "1-hour", "24-hours"]),
  platforms: z.array(z.string()).min(1, "Select at least one platform"),
  maxMessages: z
    .number()
    .min(1, "Minimum 1 message")
    .max(1000, "Maximum 1000 messages"),
});

export const editWebinarSchema = baseEditServiceSchema.extend({
  serviceType: z.literal("webinar"),
  capacity: z
    .number()
    .min(1, "Minimum 1 attendee")
    .max(1000, "Maximum 1000 attendees"),
  duration: z
    .number()
    .min(30, "Minimum 30 minutes")
    .max(480, "Maximum 480 minutes"),
  recordingEnabled: z.boolean(),
  materials: z.string().optional(),
});

// Discriminated union schema
export const editServiceFormSchema = z.discriminatedUnion("serviceType", [
  editOneOnOneCallSchema,
  editPriorityDMSchema,
  editWebinarSchema,
]);
