import dotenv from "dotenv";
import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import mysql from "mysql2/promise";
import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, ".env") });
const app = express();
const port = process.env.PORT || 5000;
const isProduction = process.env.NODE_ENV === "production";

const requiredDatabaseVariables = [
  "DB_HOST",
  "DB_NAME",
  "DB_USER",
  "DB_PASSWORD",
];
console.log("DB_HOST =", process.env.DB_HOST);
console.log("DB_NAME =", process.env.DB_NAME);
console.log("DB_USER =", process.env.DB_USER);
console.log("DB_PASSWORD =", process.env.DB_PASSWORD ? "[CONFIGURED]" : "[MISSING]");

// MySQL Pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// CORS
const allowedOrigins = (process.env.FRONTEND_ORIGINS ||
  "https://nextgenies.com,https://www.nextgenies.com,http://localhost:5173,http://localhost:4173,http://localhost:3000,http://127.0.0.1:5173,http://127.0.0.1:4173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const emailFrom = process.env.EMAIL_FROM || process.env.SMTP_USER;
const emailRecipients = [
  process.env.EMAIL_TO,
  process.env.EMAIL_TO2,
  process.env.EMAIL_TO3,
].filter(Boolean);

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: (process.env.SMTP_PORT || "587") === "465",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

async function sendContactEmails({ fullName, email, phone, service, message }) {
  if (
    !process.env.SMTP_HOST ||
    !process.env.SMTP_USER ||
    !process.env.SMTP_PASS ||
    !emailRecipients.length
  ) {
    throw new Error(
      "Email configuration is missing. Please configure SMTP_HOST, SMTP_USER, SMTP_PASS, and EMAIL_TO."
    );
  }

  const escapeHtml = (value) =>
    String(value).replace(
      /[&<>"']/g,
      (character) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[character],
    );

  const safeName = escapeHtml(fullName);
  const safeEmail = escapeHtml(email);
  const safePhone = escapeHtml(phone);
  const safeService = escapeHtml(service);
  const safeMessage = escapeHtml(message).replace(/\r?\n/g, "<br />");

  const userSubject = `Thanks for reaching out, ${fullName}!`;
  const userHtml = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1f2937;">
      <h2 style="color: #111827;">Hi ${safeName},</h2>
      <p>Thanks for reaching out to NextGenies.</p>
      <p>We have received your message and will connect with you shortly.</p>
      <p>Here is a quick summary of your request:</p>
      <ul>
        <li><strong>Email:</strong> ${safeEmail}</li>
        <li><strong>Phone:</strong> ${safePhone}</li>
        <li><strong>Service:</strong> ${safeService}</li>
      </ul>
      <p>We’ll get back to you soon.</p>
      <p>Best regards,<br />NextGenies Team</p>
    </div>
  `;

  const adminHtml = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1f2937;">
      <h2 style="color: #111827;">New contact form submission</h2>
      <p><strong>Name:</strong> ${safeName}</p>
      <p><strong>Email:</strong> ${safeEmail}</p>
      <p><strong>Phone:</strong> ${safePhone}</p>
      <p><strong>Service:</strong> ${safeService}</p>
      <p><strong>Message:</strong></p>
      <p>${safeMessage}</p>
    </div>
  `;

  await transporter.sendMail({
    from: emailFrom,
    to: email,
    replyTo: emailFrom,
    subject: userSubject,
    html: userHtml,
  });

  await transporter.sendMail({
    from: emailFrom,
    to: emailRecipients,
    replyTo: `"${safeName}" <${email}>`,
    subject: `New inquiry from ${fullName}`,
    html: adminHtml,
  });
}

app.use(helmet());

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      callback(null, false);
    },
    methods: ["GET", "POST", "OPTIONS"],
    credentials: false,
  })
);

app.use(express.json({ limit: "10kb" }));

const contactRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { message: "Too many contact requests. Please try again later." },
});

// Health Check
app.get("/api/health", async (_req, res) => {
  try {
    await pool.query("SELECT 1");

    res.json({
      status: "ok",
      database: "connected",
    });
  } catch {
    res.status(500).json({
      status: "error",
      database: "disconnected",
      message: "Database health check failed.",
    });
  }
});

// Contact Form
app.post("/api/contacts", contactRateLimit, async (req, res, next) => {
  try {
    const readField = (value) => (typeof value === "string" ? value.trim() : "");
    const fullName = readField(req.body?.fullName);
    const email = readField(req.body?.email).toLowerCase();
    const phone = readField(req.body?.phone);
    const service = readField(req.body?.service);
    const message = readField(req.body?.message);

    if (
      !fullName ||
      !email ||
      !phone ||
      !service ||
      !message ||
      fullName.length > 100 ||
      email.length > 255 ||
      phone.length > 30 ||
      service.length > 100 ||
      message.length > 5000 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
      /[\r\n]/.test(`${fullName}${email}${phone}${service}`)
    ) {
      return res.status(400).json({
        message: "Please provide valid contact details and a message.",
      });
    }

    const [result] = await pool.execute(
      `INSERT INTO contacts 
      (full_name, email, phone, service, message)
      VALUES (?, ?, ?, ?, ?)`,
      [fullName, email, phone, service, message]
    );

    let emailSent = true;
    try {
      await sendContactEmails({ fullName, email, phone, service, message });
    } catch (emailError) {
      emailSent = false;
      console.error("Failed to send contact notification email:", emailError.message);
    }

    res.status(201).json({
      message: "Message received",
      id: result.insertId,
      emailSent,
    });
  } catch (error) {
    next(error);
  }
});

// 404 handler for unknown API endpoints
app.all("/api/{*splat}", (_req, res) => {
  res.status(404).json({
    status: "error",
    message: "API endpoint not found.",
  });
});

// Serve static SPA files if dist directory exists
const distPath = path.resolve(__dirname, "..", "dist");
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));

  // SPA fallback for non-API routes (Express 5 compatible)
  app.get("/{*splat}", (req, res, next) => {
    if (req.path.startsWith("/api")) {
      return next();
    }
    res.sendFile("index.html", { root: distPath });
  });
}

// Error Handler
app.use((error, _req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }

  console.error("SERVER ERROR:", error);

  res.status(500).json({
    message: isProduction ? "Something went wrong." : error.message || "Something went wrong",
  });
});

async function startServer() {
  const missing = requiredDatabaseVariables.filter(
    (key) => !process.env[key]
  );

  if (missing.length) {
    throw new Error(`Missing env variables: ${missing.join(", ")}`);
  }

  try {
    await pool.query("SELECT 1");
    console.log("✅ MySQL Connected");

    await pool.query(`
      CREATE TABLE IF NOT EXISTS contacts (
        id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
        full_name VARCHAR(100) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(30) NOT NULL,
        service VARCHAR(100) NOT NULL,
        message TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY(id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);

    try {
      const [columns] = await pool.query(
        "SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'contacts' AND COLUMN_NAME = 'phone'",
        [process.env.DB_NAME]
      );
      if (columns.length === 0) {
        await pool.query(
          "ALTER TABLE contacts ADD COLUMN phone VARCHAR(30) NOT NULL DEFAULT ''"
        );
      }
    } catch (migrationErr) {
      console.warn("Column migration notice:", migrationErr.message);
    }

    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      try {
        await transporter.verify();
        console.log("✅ SMTP Connected");
      } catch (smtpError) {
        console.error("❌ SMTP ERROR");
        console.error(smtpError);
      }
    } else {
      console.log("⚠️ SMTP is not configured. Contact emails will not be sent.");
    }

    app.listen(port, () => {
      console.log(`🚀 Server running on port ${port}`);
    });
  } catch (err) {
    console.error("❌ DATABASE ERROR");
    console.error(err);
    process.exit(1);
  }
}

startServer();
