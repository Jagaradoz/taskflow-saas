import "dotenv/config";

// Third-party
import cors from "cors";
import express from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

// Config
import { env } from "./config/env.config.js";
import { logger } from "./config/logger.config.js";
import { pool } from "./config/db.config.js";
import { sessionMiddleware } from "./config/session.config.js";

// Modules
import { errorHandler } from "./middleware/error.middleware.js";
import { authRoutes } from "./routes/auth.route.js";
import { inviteRoutes } from "./routes/invite.route.js";
import { joinRequestRoutes } from "./routes/join-request.route.js";
import { memberRoutes } from "./routes/member.route.js";
import { orgRoutes } from "./routes/org.route.js";
import { systemRoutes } from "./routes/system.route.js";
import { taskRoutes } from "./routes/task.route.js";

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
  message: {
    status: "error",
    message: "Too many requests, please try again later",
  },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: env.NODE_ENV === "production" ? 10 : 100,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: {
    status: "error",
    message: "Too many authentication attempts, please try again later",
  },
});

// Middleware
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
    logger.info("Database connected");
  } catch (error) {
    logger.error({ err: error }, "Database connection failed on startup");
    process.exit(1);
  }
});