// Libraries
import pg from "pg";

// Local
import { env } from "./env.js";

export const pool = new pg.Pool({
  connectionString: env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

pool.on("error", (err) => {
  console.error("Database pool error:", err.message);
});

pool.on("connect", () => {
  console.log("Database connected");
});

export const closeDatabase = async (): Promise<void> => {
  await pool.end();
  console.log("Database connection closed");
};
