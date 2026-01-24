import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./config/database.js";
import { env } from "./env.js";

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BASE_URL || "http://localhost:3000",
  database: prismaAdapter(prisma, {
    provider: "mongodb",
  }),
  emailAndPassword: {
    enabled: true,
  },
  trustedOrigins: [
    "http://localhost:5173",
    "http://localhost:3000",
  ],
  advanced: {
    // Allow requests without Origin header (for Postman, curl, mobile apps)
    disableCSRFCheck: process.env.NODE_ENV === "development",
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day (refresh session daily)
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // 5 minutes - reduces DB calls
    },
  },
});