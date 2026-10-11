import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import mysql from "mysql2/promise";
import { DatabaseSync } from "node:sqlite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let activeDriver = "sqlite"; // "mysql" | "sqlite"
let mysqlPool = null;
let sqliteDb = null;

/**
 * Initialize Database Connection
 * Tries MySQL if environment variables are provided.
 * Gracefully falls back to local SQLite (node:sqlite) if MySQL is not available.
 */
export async function initDatabase() {
  const dbHost = process.env.DB_HOST?.trim();
  const dbName = process.env.DB_NAME?.trim();
  const dbUser = process.env.DB_USER?.trim();
  const dbPassword = process.env.DB_PASSWORD || "";
  const dbPort = Number(process.env.DB_PORT || 3306);

  // Check if MySQL credentials are fully provided
  if (dbHost && dbName && dbUser) {
    try {
      console.log(`🔌 Attempting MySQL connection to ${dbHost}:${dbPort}/${dbName}...`);
      const pool = mysql.createPool({
        host: dbHost,
        port: dbPort,
        user: dbUser,
        password: dbPassword,
        database: dbName,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
        connectTimeout: 4000,
      });

      // Verify connection with timeout
      const connection = await Promise.race([
        pool.getConnection(),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error("MySQL connection timed out (4s)")), 4000)
        ),
      ]);

      connection.release();
      mysqlPool = pool;
      activeDriver = "mysql";
      console.log(`✅ MySQL Connected successfully [${dbName}@${dbHost}]`);

      await setupMysqlSchema(mysqlPool, dbName);
      return { driver: "mysql" };
    } catch (err) {
      console.warn(`⚠️ MySQL Connection failed: ${err.message}`);
      console.warn("🔄 Switching automatically to local SQLite database...");
    }
  } else {
    console.log("ℹ️ No MySQL credentials found in .env — using local SQLite database.");
  }

  // Setup local SQLite database
  const dataDir = path.resolve(__dirname, "data");
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  const dbFilePath = path.join(dataDir, "nextgenies.db");
  sqliteDb = new DatabaseSync(dbFilePath);
  activeDriver = "sqlite";
  console.log(`✅ SQLite Database active at: ${dbFilePath}`);

  setupSqliteSchema(sqliteDb);
  return { driver: "sqlite" };
}

/**
 * Create tables & migrate missing columns in MySQL
 */
async function setupMysqlSchema(pool, databaseName) {
  // Contacts table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS contacts (
      id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
      full_name VARCHAR(100) NOT NULL,
      email VARCHAR(255) NOT NULL,
      phone VARCHAR(30) NOT NULL DEFAULT '',
      company VARCHAR(150) DEFAULT NULL,
      service VARCHAR(100) NOT NULL,
      need_option VARCHAR(150) DEFAULT NULL,
      scope_preference VARCHAR(200) DEFAULT NULL,
      timeline VARCHAR(100) DEFAULT NULL,
      message TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY(id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `);

  // Migrate any columns added over time to contacts
  try {
    const [cols] = await pool.query(
      "SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'contacts'",
      [databaseName]
    );
    const existing = new Set(cols.map((c) => c.COLUMN_NAME.toLowerCase()));
    if (!existing.has("phone")) {
      await pool.query("ALTER TABLE contacts ADD COLUMN phone VARCHAR(30) NOT NULL DEFAULT ''");
    }
    if (!existing.has("company")) {
      await pool.query("ALTER TABLE contacts ADD COLUMN company VARCHAR(150) DEFAULT NULL");
    }
    if (!existing.has("need_option")) {
      await pool.query("ALTER TABLE contacts ADD COLUMN need_option VARCHAR(150) DEFAULT NULL");
    }
    if (!existing.has("scope_preference")) {
      await pool.query("ALTER TABLE contacts ADD COLUMN scope_preference VARCHAR(200) DEFAULT NULL");
    }
    if (!existing.has("timeline")) {
      await pool.query("ALTER TABLE contacts ADD COLUMN timeline VARCHAR(100) DEFAULT NULL");
    }
  } catch (err) {
    console.warn("MySQL column check notice:", err.message);
  }

  // Blogs table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS blogs (
      id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
      title VARCHAR(180) NOT NULL,
      slug VARCHAR(180) NOT NULL UNIQUE,
      description VARCHAR(320) NOT NULL,
      content LONGTEXT NOT NULL,
      image_url VARCHAR(500) DEFAULT NULL,
      image_data MEDIUMBLOB DEFAULT NULL,
      image_mime_type VARCHAR(100) DEFAULT NULL,
      author VARCHAR(100) NOT NULL DEFAULT 'NextGenies',
      is_published BOOLEAN NOT NULL DEFAULT FALSE,
      published_at TIMESTAMP NULL DEFAULT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY(id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `);

  try {
    const [blogCols] = await pool.query(
      "SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'blogs'",
      [databaseName]
    );
    const blogExisting = new Set(blogCols.map((c) => c.COLUMN_NAME.toLowerCase()));
    if (!blogExisting.has("image_data")) {
      await pool.query("ALTER TABLE blogs ADD COLUMN image_data MEDIUMBLOB DEFAULT NULL");
    }
    if (!blogExisting.has("image_mime_type")) {
      await pool.query("ALTER TABLE blogs ADD COLUMN image_mime_type VARCHAR(100) DEFAULT NULL");
    }
  } catch (err) {
    console.warn("MySQL blog column check notice:", err.message);
  }
}

/**
 * Create tables in SQLite
 */
function setupSqliteSchema(sqlite) {
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS contacts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      full_name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL DEFAULT '',
      company TEXT DEFAULT '',
      service TEXT NOT NULL,
      need_option TEXT DEFAULT '',
      scope_preference TEXT DEFAULT '',
      timeline TEXT DEFAULT '',
      message TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS blogs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      description TEXT NOT NULL,
      content TEXT NOT NULL,
      image_url TEXT DEFAULT NULL,
      image_data BLOB DEFAULT NULL,
      image_mime_type TEXT DEFAULT NULL,
      author TEXT NOT NULL DEFAULT 'NextGenies',
      is_published INTEGER NOT NULL DEFAULT 0,
      published_at DATETIME DEFAULT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
}

/**
 * Unified database interface matching mysql2 style:
 * returns [rows, fields] or [result, fields]
 */
export const db = {
  get driver() {
    return activeDriver;
  },

  async query(sql, params = []) {
    if (activeDriver === "mysql") {
      return await mysqlPool.query(sql, params);
    }

    const trimmed = sql.trim();
    const isSelect = /^SELECT\b/i.test(trimmed);

    if (isSelect) {
      const stmt = sqliteDb.prepare(sql);
      const rows = stmt.all(...params);
      // Map prototype rows to plain objects
      const cleanRows = rows.map((r) => ({ ...r }));
      return [cleanRows];
    } else {
      const stmt = sqliteDb.prepare(sql);
      const res = stmt.run(...params);
      return [{ insertId: Number(res.lastInsertRowid), affectedRows: res.changes }];
    }
  },

  async execute(sql, params = []) {
    if (activeDriver === "mysql") {
      return await mysqlPool.execute(sql, params);
    }

    const stmt = sqliteDb.prepare(sql);
    const res = stmt.run(...params);
    return [{ insertId: Number(res.lastInsertRowid), affectedRows: res.changes }];
  },

  async healthCheck() {
    if (activeDriver === "mysql") {
      await mysqlPool.query("SELECT 1");
      return { status: "ok", driver: "mysql" };
    } else {
      sqliteDb.prepare("SELECT 1").get();
      return { status: "ok", driver: "sqlite" };
    }
  },
};
