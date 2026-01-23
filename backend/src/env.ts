import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const EnvSchema = z.object({
    DATABASE_URL: z.string().url(),
    PORT: z.string().default("5000"),
    BASE_URL: z.string().default("http://localhost:5000"),
    NODE_ENV: z.string().default("development"),
    CORS_ORIGIN: z.string().default("http://localhost:5173"),
    BETTER_AUTH_SECRET: z.string().min(32).optional(),
});

export const env = EnvSchema.parse(process.env);
