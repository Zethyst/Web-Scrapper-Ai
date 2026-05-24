import dotenv from "dotenv";
import { readFileSync } from "fs";
import { join } from "path";
import postgres from "postgres";

// Load environment variables
dotenv.config({ path: ".env.local" });
dotenv.config();

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    console.error(
      `❌ ${name} environment variable is not set. Please configure it in your .env file.`
    );
    process.exit(1);
  }
  return value;
}

const databaseUrl = requireEnv("DATABASE_URL");

// Parse DATABASE_URL to handle SSL requirements
let sslConfig: boolean | object = false;

if (databaseUrl.includes("sslmode=require") || databaseUrl.includes("ssl=true")) {
  sslConfig = { rejectUnauthorized: false };
} else if (databaseUrl.includes("render.com")) {
  sslConfig = { rejectUnauthorized: false };
}

async function runMigration() {
  const sql = postgres(databaseUrl, {
    ssl: sslConfig,
    max: 1,
  });

  try {
    const existing = await sql`
      SELECT 1 FROM information_schema.tables
      WHERE table_schema = 'public' AND table_name = 'tasks'
      LIMIT 1
    `;

    if (existing.length > 0) {
      console.log("✅ Table 'tasks' already exists. Nothing to migrate.");
      return;
    }

    console.log("🔄 Reading migration file...");
    const migrationFile = readFileSync(
      join(process.cwd(), "drizzle", "0000_thankful_dracula.sql"),
      "utf-8"
    );

    console.log("🚀 Applying migration to database...");

    const statements = migrationFile
      .split(";")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    for (const statement of statements) {
      if (statement.trim()) {
        await sql.unsafe(statement);
        console.log(`✅ Executed: ${statement.substring(0, 50)}...`);
      }
    }

    console.log("✅ Migration completed successfully!");
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

runMigration();
