import { z } from "zod";

export const envSchema = z.object({
  APP_LOG_LEVEL: z.enum(["debug", "info", "warn", "error"]).optional().default("info"),
  BCRYPT_SALT_ROUNDS: z.coerce.number().optional().default(10),
  DATABASE_URL: z.string().nonempty("DATABASE_URL is required"),
  JWT_ACCESS_EXPIRES_IN: z.string(),
  JWT_ACCESS_SECRET: z.string().min(32),
  JWT_REFRESH_EXPIRES_IN: z.string(),
  JWT_REFRESH_SECRET: z.string().min(32),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z
    .string()
    .transform(val => parseInt(val, 10))
    .optional()
    .default(4000),
  REDIS_APP_KEY_TTL: z.string().transform(Number),
  REDIS_CLOUD_HOST: z.string(),
  REDIS_CLOUD_PASSWORD: z.string(),
  REDIS_CLOUD_PORT: z.string().transform(Number),
  REDIS_CLOUD_USER: z.string().nonempty("REDIS_CLOUD_USER is required"),
  SERVER_URL: z.url("SERVER_URL must be a valid URL"),
});

export type Environment = z.infer<typeof envSchema>;
