import { z } from 'zod';

const envSchema = z.object({
  // Auth Service
  AUTH_SERVICE_HOST: z.string().min(1),
  AUTH_SERVICE_PORT: z.coerce.number().int().min(1).max(65535),

  // Database
  MONGO_URI: z.string().url(),

  // Redis
  REDIS_HOST: z.string().min(1),
  REDIS_PORT: z.coerce.number().int().min(1).max(65535),
  REDIS_PASSWORD: z.string(), // Keep optional if you want

  // RabbitMQ
  RABBITMQ_HOST: z.string().min(1),
  RABBITMQ_PORT: z.coerce.number().min(1).max(65535),
  RABBITMQ_USERNAME: z.string().min(1),
  RABBITMQ_PASSWORD: z.string().min(1),
  RABBITMQ_VHOST: z.string().min(1),

  // OTP
  OTP_LENGTH: z.coerce.number().int().min(4).max(8),
  OTP_TTL: z.coerce.number().int().min(60),
  OTP_MAX_ATTEMPTS: z.coerce.number().int().min(1).max(10),

  JWT_SECRET: z.string().min(1),

  // Access Token
  ACCESS_TOKEN_SECRET: z.string().min(1),
  ACCESS_TOKEN_TTL: z.string().min(1),

  // Refresh Token
  REFRESH_TOKEN_SECRET: z.string().min(1),
  REFRESH_TOKEN_DEFAULT_TTL: z.string().min(1),
  REFRESH_TOKEN_REMEMBER_ME_TTL: z.string().min(1),

  // Mail
  MAIL_PROVIDER: z.enum(['sendgrid', 'ses', 'smtp']),

  // SendGrid
  SENDGRID_API_KEY: z.string().min(1),
  SENDGRID_FROM_EMAIL: z.string().email(),
  SENDGRID_FROM_NAME: z.string().min(1),
});

export function validate(config: Record<string, unknown>) {
  const result = envSchema.safeParse(config);

  if (!result.success) {
    throw new Error(`Environment validation failed: ${result.error.message}`);
  }

  return result.data;
}

export type EnvConfig = z.infer<typeof envSchema>;
