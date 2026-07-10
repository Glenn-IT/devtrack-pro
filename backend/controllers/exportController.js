const db = require("../config/db");

// Escapes a single value for use in a SQL INSERT statement
const escapeValue = (value) => {
  if (value === null || value === undefined) return "NULL";
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  if (value instanceof Date) return `'${value.toISOString().slice(0, 19).replace("T", " ")}'`;
  if (Buffer.isBuffer(value)) return `X'${value.toString("hex")}'`;
  return `'${String(value).replace(/\\/g, "\\\\").replace(/'/g, "\\'")}'`;
};

const exportDatabase = async (req, res) => {
  try {
    const [tables] = await db.query("SHOW TABLES");
    const tableNames = tables.map((row) => Object.values(row)[0]);

    let sql = `-- DevTrack Pro database export\n-- Generated: ${new Date().toISOString()}\n\n`;
    sql += "SET FOREIGN_KEY_CHECKS=0;\n\n";

    for (const table of tableNames) {
      const [[createRow]] = await db.query(`SHOW CREATE TABLE \`${table}\``);
      const createStatement = createRow["Create Table"];

      sql += `-- ----------------------------\n-- Table structure for \`${table}\`\n-- ----------------------------\n`;
      sql += `DROP TABLE IF EXISTS \`${table}\`;\n${createStatement};\n\n`;

      const [rows] = await db.query(`SELECT * FROM \`${table}\``);
      if (rows.length > 0) {
        const columns = Object.keys(rows[0]);
        const columnList = columns.map((c) => `\`${c}\``).join(", ");

        sql += `-- ----------------------------\n-- Records for \`${table}\`\n-- ----------------------------\n`;
        for (const row of rows) {
          const values = columns.map((c) => escapeValue(row[c])).join(", ");
          sql += `INSERT INTO \`${table}\` (${columnList}) VALUES (${values});\n`;
        }
        sql += "\n";
      }
    }

    sql += "SET FOREIGN_KEY_CHECKS=1;\n";

    const filename = `devtrack-pro-backup-${new Date().toISOString().slice(0, 10)}.sql`;
    res.setHeader("Content-Type", "application/sql");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.send(sql);
  } catch (err) {
    console.error("Database export failed:", err.message);
    res.status(500).json({ error: "Failed to export database", details: err.message });
  }
};

module.exports = { exportDatabase };
