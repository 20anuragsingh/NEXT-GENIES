import "dotenv/config";
import cors from "cors";
import express from "express";
import mysql from "mysql2/promise";

const app = express();
const port = process.env.PORT || 5000;
const requiredDatabaseVariables = ["DB_HOST", "DB_NAME", "DB_USER", "DB_PASSWORD"];

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 3306),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

const allowedOrigins = (process.env.CLIENT_URL || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim());

app.use(cors({ origin: allowedOrigins }));
app.use(express.json({ limit: "10kb" }));

app.get("/api/health", (_request, response) => {
  response.json({
    status: "ok",
    database: "connected",
  });
});

app.post("/api/contacts", async (request, response, next) => {
  try {
    const fullName = request.body?.fullName?.trim();
    const email = request.body?.email?.trim().toLowerCase();
    const service = request.body?.service?.trim();
    const message = request.body?.message?.trim();

    if (!fullName || !email || !service || !message) {
      return response.status(400).json({ message: "All fields are required." });
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return response.status(400).json({ message: "Enter a valid email address." });
    }

    if (fullName.length > 100 || email.length > 255 || service.length > 100 || message.length > 2000) {
      return response.status(400).json({ message: "One or more fields are too long." });
    }

    const [result] = await pool.execute(
      "INSERT INTO contacts (full_name, email, service, message) VALUES (?, ?, ?, ?)",
      [fullName, email, service, message]
    );

    response.status(201).json({
      message: "Message received",
      contact: { id: result.insertId, fullName, email, service, message },
    });
  } catch (error) {
    next(error);
  }
});

app.use((error, _request, response, _next) => {
  console.error(error);
  response.status(500).json({ message: "Something went wrong" });
});

async function startServer() {
  const missingVariables = requiredDatabaseVariables.filter((variable) => !process.env[variable]);
  if (missingVariables.length) {
    throw new Error(`${missingVariables.join(", ")} ${missingVariables.length === 1 ? "is" : "are"} missing. Add ${missingVariables.length === 1 ? "it" : "them"} to your .env file.`);
  }

  await pool.query(`
    CREATE TABLE IF NOT EXISTS contacts (
      id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
      full_name VARCHAR(100) NOT NULL,
      email VARCHAR(255) NOT NULL,
      service VARCHAR(100) NOT NULL,
      message TEXT NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `);
  console.log("Connected to MySQL");

  app.listen(port, () => {
    console.log(`API server running at http://localhost:${port}`);
  });
}

startServer().catch((error) => {
  console.error("Could not start server:", error.message);
  process.exit(1);
});
