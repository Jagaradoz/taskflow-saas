import "dotenv/config";

// Libraries
import cors from "cors";
import express from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

// Local
import { env } from "./config/env.js";
import { logger } from "./config/logger.js";
import { pool } from "./config/db.js";
import { errorHandler } from "./middleware/error.middleware.js";
import { sessionMiddleware } from "./config/session.js";

// Endpoints
import { authRoutes } from "./routes/auth-routes.js";
import { memberRoutes } from "./routes/member-routes.js";
import { orgRoutes } from "./routes/org-routes.js";
import { systemRoutes } from "./routes/system-routes.js";
import { taskRoutes } from "./routes/task-routes.js";
import { inviteRoutes } from "./routes/invite.routes.js";
import { joinRequestRoutes } from "./routes/join-request.routes.js";

const app = express();

// Configurations
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(
  cors({
    origin: env.CORS_ORIGIN,
    credentials: true,
  }),
);

// Rate limiting
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { status: "error", message: "Too many requests, please try again later" },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 10,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { status: "error", message: "Too many authentication attempts, please try again later" },
});

// Middlewares
app.use(sessionMiddleware);
app.use("/api", generalLimiter);
app.use("/api/auth/login", authLimiter);
app.use("/api/auth/register", authLimiter);

// Endpoints
app.use("/api/auth", authRoutes);
app.use("/api/orgs", orgRoutes);
app.use("/api/members", memberRoutes);
app.use("/api/system", systemRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api", inviteRoutes);
app.use("/api", joinRequestRoutes);

app.use(errorHandler);

app.listen(env.PORT, async () => {
  logger.info("Server connected (PORT: %d)", env.PORT);
  try {
    await pool.query("SELECT 1");
    logger.info("Database connection verified");
  } catch (error) {
    logger.error({ err: error }, "Database connection failed on startup");
    process.exit(1);
  }
});

export { app };
