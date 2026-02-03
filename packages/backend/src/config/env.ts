// Libraries
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
    .min(1)
    .default(
      "cf2c588a47dfb149b60ba20236ff881e3045a2653b106e349a44caa60311e173",
    ),
  SESSION_MAX_AGE: z.coerce.number().positive().default(86400000),
});

export const env = envSchema.parse(process.env);
export type Env = z.infer<typeof envSchema>;
