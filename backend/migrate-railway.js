// One-off helper to run schema migrations against the live Railway MySQL DB.
// Usage: node migrate-railway.js path/to/migration.sql
// Reads connection details from .env.railway (gitignored, never commit it).
//
// Note: Railway's MySQL rejects "ADD COLUMN IF NOT EXISTS" (syntax error).
// Write plain ALTER TABLE / CREATE TABLE statements, and check SHOW COLUMNS
// first if you're not sure something's already been applied.

require("dotenv").config({ path: ".env.railway" });
const fs = require("fs");
const mysql = require("mysql2/promise");

const file = process.argv[2];
if (!file) {
  console.error("Usage: node migrate-railway.js path/to/migration.sql");
  process.exit(1);
}

(async () => {
  const sql = fs.readFileSync(file, "utf8");
  const conn = await mysql.createConnection({
    host: process.env.RAILWAY_DB_HOST,
    port: process.env.RAILWAY_DB_PORT,
    user: process.env.RAILWAY_DB_USER,
    password: process.env.RAILWAY_DB_PASSWORD,
    database: process.env.RAILWAY_DB_NAME,
    multipleStatements: true,
  });

  console.log(`Connected to Railway DB. Running ${file}...`);
  await conn.query(sql);
  console.log("Done.");
  await conn.end();
})().catch((err) => {
  console.error("Migration failed:", err.message);
  process.exit(1);
});
