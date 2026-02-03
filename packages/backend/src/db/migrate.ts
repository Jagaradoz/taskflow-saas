import "dotenv/config";

// Libraries
import { readdir, readFile } from "fs/promises";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import pg from "pg";

const { Pool } = pg;
const __dirname = dirname(fileURLToPath(import.meta.url));

async function migrate() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not defined");
  }

  const pool = new Pool({ connectionString });

  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS _migrations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) UNIQUE NOT NULL,
        applied_at TIMESTAMPTZ DEFAULT NOW()
      )
    `);

    const { rows: applied } = await pool.query(
      "SELECT name FROM _migrations ORDER BY id",
    );
    const appliedNames = new Set(applied.map((r) => r.name));

    const migrationsDir = join(__dirname, "migrations");
    const files = await readdir(migrationsDir);
    const sqlFiles = files.filter((f) => f.endsWith(".sql")).sort();

    console.log(`Found ${sqlFiles.length} migration(s)`);

    for (const file of sqlFiles) {
      if (appliedNames.has(file)) {
        console.log(`[SKIP] ${file}`);
        continue;
      }

      const sql = await readFile(join(migrationsDir, file), "utf-8");

      await pool.query("BEGIN");
      try {
        await pool.query(sql);
        await pool.query("INSERT INTO _migrations (name) VALUES ($1)", [file]);
        await pool.query("COMMIT");
        console.log(`[DONE] ${file}`);
      } catch (err) {
        await pool.query("ROLLBACK");
        console.error(`[FAILED] ${file}`);
        throw err;
      }
    }

    console.log("");
    console.log("All migrations complete");
  } finally {
    await pool.end();
  }
}

migrate().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
