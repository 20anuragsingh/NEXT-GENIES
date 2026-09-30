import dotenv from "dotenv";
import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import mysql from "mysql2/promise";
import nodemailer from "nodemailer";
import multer from "multer";
import jwt from "jsonwebtoken";
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
  "ADMIN_USERNAME",
  "ADMIN_PASSWORD",
  "ADMIN_JWT_SECRET",
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
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
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

const adminLoginRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { message: "Too many login attempts. Please try again later." },
});

const uploadsPath = path.resolve(__dirname, "..", "public", "uploads");
fs.mkdirSync(uploadsPath, { recursive: true });

const blogUpload = multer({
  storage: multer.diskStorage({
    destination: uploadsPath,
    filename: (_req, file, callback) => {
      const extension = path.extname(file.originalname).toLowerCase();
      callback(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${extension}`);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, callback) => {
    callback(null, ["image/jpeg", "image/png", "image/webp", "image/gif"].includes(file.mimetype));
  },
});

function authenticateAdmin(req, res, next) {
  const token = req.headers.authorization?.replace(/^Bearer\s+/i, "");

  if (!token) {
    return res.status(401).json({ message: "Admin authentication required." });
  }

  try {
    jwt.verify(token, process.env.ADMIN_JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ message: "Your admin session has expired." });
  }
}

function readBlogField(value, maxLength) {
  const field = typeof value === "string" ? value.trim() : "";
  return field.length <= maxLength ? field : "";
}

function slugify(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function removeBlogImage(imageUrl) {
  if (!imageUrl?.startsWith("/uploads/")) return;
  const imagePath = path.resolve(uploadsPath, path.basename(imageUrl));
  if (imagePath.startsWith(uploadsPath)) fs.unlink(imagePath, () => {});
}

app.post("/api/admin/login", adminLoginRateLimit, (req, res) => {
  const username = typeof req.body?.username === "string" ? req.body.username.trim() : "";
  const password = typeof req.body?.password === "string" ? req.body.password : "";

  if (username !== process.env.ADMIN_USERNAME || password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ message: "Invalid admin credentials." });
  }

  const token = jwt.sign({ role: "admin", username }, process.env.ADMIN_JWT_SECRET, { expiresIn: "8h" });
  res.json({ token });
});

app.get("/api/blogs", async (_req, res, next) => {
  try {
    const [blogs] = await pool.query(
      "SELECT id, title, slug, description, image_url AS imageUrl, author, published_at AS publishedAt, created_at AS createdAt FROM blogs WHERE is_published = 1 ORDER BY published_at DESC, id DESC"
    );
    res.json(blogs);
  } catch (error) {
    next(error);
  }
});

app.get("/api/blogs/:slug", async (req, res, next) => {
  try {
    const [blogs] = await pool.query(
      "SELECT id, title, slug, description, content, image_url AS imageUrl, author, published_at AS publishedAt, created_at AS createdAt FROM blogs WHERE slug = ? AND is_published = 1 LIMIT 1",
      [req.params.slug]
    );

    if (!blogs.length) return res.status(404).json({ message: "Blog not found." });
    res.json(blogs[0]);
  } catch (error) {
    next(error);
  }
});

app.get("/api/admin/blogs", authenticateAdmin, async (_req, res, next) => {
  try {
    const [blogs] = await pool.query(
      "SELECT id, title, slug, description, content, image_url AS imageUrl, author, is_published AS isPublished, published_at AS publishedAt, created_at AS createdAt FROM blogs ORDER BY created_at DESC"
    );
    res.json(blogs);
  } catch (error) {
    next(error);
  }
});

app.post("/api/admin/blogs", authenticateAdmin, blogUpload.single("image"), async (req, res, next) => {
  try {
    const title = readBlogField(req.body?.title, 180);
    const description = readBlogField(req.body?.description, 320);
    const content = readBlogField(req.body?.content, 50000);
    const author = readBlogField(req.body?.author, 100) || "NextGenies";
    const slug = slugify(readBlogField(req.body?.slug, 180) || title);
    const isPublished = req.body?.isPublished === "true" || req.body?.isPublished === "1";

    if (!title || !description || !content || !slug) {
      if (req.file) fs.unlink(req.file.path, () => {});
      return res.status(400).json({ message: "Title, description, content, and a valid slug are required." });
    }

    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
    const [result] = await pool.execute(
      `INSERT INTO blogs (title, slug, description, content, image_url, author, is_published, published_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, slug, description, content, imageUrl, author, isPublished, isPublished ? new Date() : null]
    );
    res.status(201).json({ id: result.insertId, message: "Blog published successfully." });
  } catch (error) {
    if (req.file) fs.unlink(req.file.path, () => {});
    if (error.code === "ER_DUP_ENTRY") return res.status(409).json({ message: "A blog with that slug already exists." });
    next(error);
  }
});

app.delete("/api/admin/blogs/:id", authenticateAdmin, async (req, res, next) => {
  try {
    const [rows] = await pool.query("SELECT image_url AS imageUrl FROM blogs WHERE id = ?", [req.params.id]);
    await pool.execute("DELETE FROM blogs WHERE id = ?", [req.params.id]);
    removeBlogImage(rows[0]?.imageUrl);
    res.json({ message: "Blog deleted." });
  } catch (error) {
    next(error);
  }
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
app.use("/uploads", express.static(uploadsPath));
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

    await pool.query(`
      CREATE TABLE IF NOT EXISTS blogs (
        id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
        title VARCHAR(180) NOT NULL,
        slug VARCHAR(180) NOT NULL UNIQUE,
        description VARCHAR(320) NOT NULL,
        content LONGTEXT NOT NULL,
        image_url VARCHAR(500) DEFAULT NULL,
        author VARCHAR(100) NOT NULL DEFAULT 'NextGenies',
        is_published BOOLEAN NOT NULL DEFAULT FALSE,
        published_at TIMESTAMP NULL DEFAULT NULL,
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
