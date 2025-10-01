import path from "path";
import { expand } from "dotenv-expand";
import { z } from "zod";
import { config } from "dotenv";

expand(config({
  path: path.resolve(
    process.cwd(),
    process.env.NODE_ENV === "development" ? ".env.local" : ".env",
  ),
}));

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.coerce.number().default(3000),
  HOST: z.string().min(1, "HOST is required").default("localhost"),
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  DATABASE_HOST: z.string().min(1, "DATABASE_HOST is required"),
  DATABASE_USER: z.string().min(1, "DATABASE_USER is required"),
  DATABASE_PASSWORD: z.string().min(1, "DATABASE_PASSWORD is required"),
  DATABASE_NAME: z.string().min(1, "DATABASE_NAME is required"),
  DATABASE_PORT: z.coerce.number().optional().default(3306),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error("❌ Invalid environment variables:", _env.error.format());
  throw new Error("Invalid environment variables");
}

export const env = _env.data;
