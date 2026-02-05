import "dotenv/config";
import pg from "pg";
import { execSync } from "child_process";

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

  // Run migrations
  console.log("\nRunning migrations...");
  execSync("npm run db:migrate", { stdio: "inherit" });

  // Run seeds
  console.log("\nRunning seed...");
  execSync("npm run db:seed", { stdio: "inherit" });
}

reset().catch((err) => {
  console.error("Reset failed:", err);
  process.exit(1);
});
