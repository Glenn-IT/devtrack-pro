const mysql = require("mysql2");
require("dotenv").config();

const pool = mysql.createPool({
  host: process.env.MYSQLHOST || process.env.DB_HOST,
  port: process.env.MYSQLPORT || 3306,
  user: process.env.MYSQLUSER || process.env.DB_USER,
  password: process.env.MYSQLPASSWORD || process.env.DB_PASSWORD,
  database: process.env.MYSQLDATABASE || process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Test connection on startup
pool.getConnection((err, connection) => {
  if (err) {
    console.error("❌ Database connection failed:", err.message, err.code, err.errno);
    console.error("   Host:", process.env.MYSQLHOST || process.env.DB_HOST);
    console.error("   Port:", process.env.MYSQLPORT || 3306);
    console.error("   User:", process.env.MYSQLUSER || process.env.DB_USER);
    console.error("   Database:", process.env.MYSQLDATABASE || process.env.DB_NAME);
  } else {
    console.log("✅ Connected to MySQL database successfully");
    connection.release();
  }
});

module.exports = pool.promise();
