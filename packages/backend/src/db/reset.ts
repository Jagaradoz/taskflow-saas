import "dotenv/config";
import pg from "pg";

const { Pool } = pg;

async function reset() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not defined");
  }

  const pool = new Pool({ connectionString });

  try {
    console.log("Re-creating public schema...");
    await pool.query(
      "DROP SCHEMA public CASCADE; CREATE SCHEMA public; GRANT ALL ON SCHEMA public TO public;",
    );
    console.log("[DONE] Schema reset");
  } finally {
    await pool.end();
  }
}

reset().catch((err) => {
  console.error("Reset failed:", err);
  process.exit(1);
});
