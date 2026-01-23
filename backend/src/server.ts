import express, { Request, Response } from "express";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./auth";
import { env } from "./env";
import routes from "./routes";

const PORT = env.PORT || 5000;
const app = express();

// CORS with credentials (required for Better Auth cookies)
app.use(cors({
  origin: env.CORS_ORIGIN,
  credentials: true,
}));


// Better Auth handler - MUST be before express.json()
app.all("/api/auth/*", toNodeHandler(auth));

// Body parsing (after auth handler)
app.use(express.json());

// Health check
app.get("/", (_req: Request, res: Response) => {
  res.json({ status: "ok", message: "Apex API is running" });
});

// API routes
app.use("/api", routes);

app.listen(PORT, async () => {
  console.log(`🚀 Server is running on: http://localhost:${PORT}`);
  console.log(`📝 Auth endpoint: http://localhost:${PORT}/api/auth`);
});