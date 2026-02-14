// Third-party
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  PORT: z.coerce.number().default(3000),
  CORS_ORIGIN: z.string().url().default("http://localhost:5173"),
  DATABASE_URL: z
    .string()
    .url()
    .default("postgres://postgres:postgres@localhost:5432/taskflow"),
  REDIS_URL: z.string().url().default("redis://localhost:6379"),
  SESSION_SECRET: z
    .string()
    .min(1, "SESSION_SECRET environment variable is required"),
  SESSION_MAX_AGE: z.coerce.number().positive().default(86400000),
});

export const env = envSchema.parse(process.env);
export type Env = z.infer<typeof envSchema>;
