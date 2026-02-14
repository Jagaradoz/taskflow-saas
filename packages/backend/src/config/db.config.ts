// Third-party
import pg from "pg";

// Config
import { env } from "./env.config.js";
import { logger } from "./logger.config.js";

export const pool = new pg.Pool({
  connectionString: env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

pool.on("error", (err) => {
  logger.error("Database pool error: %s", err.message);
});

export const closeDatabase = async (): Promise<void> => {
  await pool.end();
  logger.info("Database connection closed");
};
