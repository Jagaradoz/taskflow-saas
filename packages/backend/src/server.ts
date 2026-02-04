import "dotenv/config";

// Libraries
import cors from "cors";
import express from "express";
import helmet from "helmet";

// Local
import { env } from "./config/env.js";
import { logger } from "./config/logger.js";
import { pool } from "./config/db.js";
import { errorHandler } from "./middleware/error.middleware.js";
import { sessionMiddleware } from "./middleware/session.middleware.js";

// Endpoints
import { authRoutes } from "./routes/auth-routes.js";
import { memberRoutes } from "./routes/member-routes.js";
import { orgRoutes } from "./routes/org-routes.js";
import { systemRoutes } from "./routes/system-routes.js";

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

// Endpoints
app.use("/api/auth", authRoutes);
app.use("/api/orgs", orgRoutes);
app.use("/api/members", memberRoutes);
app.use("/api/system", systemRoutes);

app.use(errorHandler);

app.listen(env.PORT, async () => {
  logger.info("Server connected (PORT: %d)", env.PORT);
  await pool.query("SELECT 1");
});

export { app };
