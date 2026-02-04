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

// Endpoints
import { authRoutes } from "./routes/auth-routes.js";
import { memberRoutes } from "./routes/member-routes.js";
import { orgRoutes } from "./routes/org-routes.js";
import { systemRoutes } from "./routes/system-routes.js";

export const logger = pino({
  level: env.NODE_ENV === "production" ? "info" : "debug",
  transport:
    env.NODE_ENV !== "production"
      ? {
          target: "pino-pretty",
          options: {
            colorize: true,
            translateTime: "SYS:standard",
          },
        }
      : undefined,
});

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

// Middlewares
app.use(sessionMiddleware);

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/orgs", orgRoutes);
app.use("/api/members", memberRoutes);
app.use("/api/system", systemRoutes);

app.use(errorHandler);

app.listen(env.PORT, () => {
  logger.info(`Server running on http://localhost:${env.PORT}`);
});

export { app };
