// Libraries
import pg from "pg";

// Local
import { env } from "./env.js";
import { logger } from "./logger.js";

export const pool = new pg.Pool({
  connectionString: env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

pool.on("error", (err) => {
  logger.error("Database pool error: %s", err.message);
});

pool.on("connect", () => {
  logger.info("Database connected");
});

export const closeDatabase = async (): Promise<void> => {
  await pool.end();
  logger.info("Database connection closed");
};
