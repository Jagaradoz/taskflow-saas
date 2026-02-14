import "dotenv/config";

// Third-party
import { readdir, readFile } from "fs/promises";
import pg from "pg";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const { Pool } = pg;
const __dirname = dirname(fileURLToPath(import.meta.url));

async function seed() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not defined");
  }

  const pool = new Pool({ connectionString });

  try {
    const seedsDir = join(__dirname, "seeds");
    const files = await readdir(seedsDir);
    const sqlFiles = files.filter((f) => f.endsWith(".sql")).sort();

    console.log(`Found ${sqlFiles.length} seed(s)`);

    for (const file of sqlFiles) {
      const sql = await readFile(join(seedsDir, file), "utf-8");

      await pool.query("BEGIN");
      try {
        await pool.query(sql);
        await pool.query("COMMIT");
        console.log(`[DONE] ${file}`);
      } catch (err) {
        await pool.query("ROLLBACK");
        console.error(`[FAILED] ${file}`);
        throw err;
      }
    }

    console.log("");
    console.log("All seeds complete");
  } finally {
    await pool.end();
  }
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
