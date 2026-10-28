import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import mysql from "mysql2/promise";
import { DatabaseSync } from "node:sqlite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, ".env") });

const required = ["DB_HOST", "DB_NAME", "DB_USER", "DB_PASSWORD"];
const missing = required.filter((name) => !process.env[name]);
if (missing.length) throw new Error(`Missing database environment variables: ${missing.join(", ")}`);

const sqlitePath = path.join(__dirname, "data", "nextgenies.db");
if (!fs.existsSync(sqlitePath)) throw new Error(`SQLite database not found: ${sqlitePath}`);

const sqlite = new DatabaseSync(sqlitePath);
const mysqlConnection = await mysql.createConnection({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

try {
  const contacts = sqlite.prepare("SELECT * FROM contacts ORDER BY id").all();
  const blogs = sqlite.prepare("SELECT * FROM blogs ORDER BY id").all();

  for (const row of contacts) {
    await mysqlConnection.execute(
      `INSERT IGNORE INTO contacts
       (id, full_name, email, phone, company, service, need_option, scope_preference, timeline, message, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [row.id, row.full_name, row.email, row.phone, row.company, row.service, row.need_option,
        row.scope_preference, row.timeline, row.message, row.created_at],
    );
  }

  for (const row of blogs) {
    await mysqlConnection.execute(
      `INSERT IGNORE INTO blogs
       (id, title, slug, description, content, image_url, image_data, image_mime_type, author,
        is_published, published_at, alt_text, categories, tags, meta_title, meta_description,
        focus_keywords, additional_keywords, robots_meta, canonical_url, faq_schema, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [row.id, row.title, row.slug, row.description, row.content, row.image_url, row.image_data,
        row.image_mime_type, row.author, row.is_published, row.published_at, row.alt_text,
        row.categories, row.tags, row.meta_title, row.meta_description, row.focus_keywords,
        row.additional_keywords, row.robots_meta, row.canonical_url, row.faq_schema, row.created_at],
    );
  }

  console.log(`Migrated ${contacts.length} contacts and ${blogs.length} blogs.`);
} finally {
  sqlite.close();
  await mysqlConnection.end();
}
