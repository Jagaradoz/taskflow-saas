import "dotenv/config";

// Libraries
import cors from "cors";
import express from "express";
import helmet from "helmet";
import pino from "pino";

// Local
import { env } from "./config/env.js";
import { errorHandler } from "./middleware/error.middleware.js";
import { sessionMiddleware } from "./middleware/session.middleware.js";
import { authRoutes } from "./routes/authRoutes.js";
import { orgRoutes } from "./routes/orgRoutes.js";
import { memberRoutes } from "./routes/memberRoutes.js";

const logger = pino({
  transport: {
    target: "pino-pretty",
    options: { colorize: true },
  },
});

const app = express();

// Security middleware
app.use(helmet());
app.use(
  cors({
    origin: env.CORS_ORIGIN,
    credentials: true,
  }),
);

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session middleware
app.use(sessionMiddleware);

// Health check
app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// API routes
app.use("/auth", authRoutes);
app.use("/orgs", orgRoutes);
app.use("/members", memberRoutes);

// Error handler (must be last)
app.use(errorHandler);

// Start server
app.listen(env.PORT, () => {
  logger.info(`Server running on http://localhost:${env.PORT}`);
});

export { app };
