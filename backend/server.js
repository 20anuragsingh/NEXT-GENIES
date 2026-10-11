import dotenv from "dotenv";
import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import nodemailer from "nodemailer";
import multer from "multer";
import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { initDatabase, db } from "./db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, ".env") });
const app = express();
const port = process.env.PORT || 5000;
const isProduction = process.env.NODE_ENV === "production";

// CORS
const allowedOrigins = (
  process.env.FRONTEND_ORIGINS ||
  "https://nextgenies.com,https://www.nextgenies.com,http://localhost:5173,http://localhost:4173,http://localhost:3000,http://127.0.0.1:5173,http://127.0.0.1:4173"
)
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
  host: process.env.SMTP_HOST || "localhost",
  port: Number(process.env.SMTP_PORT || 587),
  secure: (process.env.SMTP_PORT || "587") === "465",
  auth: {
    user: process.env.SMTP_USER || "",
    pass: process.env.SMTP_PASS || "",
  },
});

async function sendContactEmails({ fullName, email, phone, service, message }) {
  if (
    !process.env.SMTP_HOST ||
    !process.env.SMTP_USER ||
    !process.env.SMTP_PASS ||
    !emailRecipients.length
  ) {
    return; // Silently skip if email is not configured
  }

  const escapeHtml = (value) =>
    String(value || "").replace(
      /[&<>"']/g,
      (char) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[char]
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
      <h2 style="color: #111827;">New Project Inquiry</h2>
      <p><strong>Name:</strong> ${safeName}</p>
      <p><strong>Email:</strong> ${safeEmail}</p>
      <p><strong>Phone:</strong> ${safePhone}</p>
      <p><strong>Service:</strong> ${safeService}</p>
      <p><strong>Message / Scope:</strong></p>
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

app.use(helmet({ contentSecurityPolicy: false }));

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

app.use(express.json({ limit: "50kb" }));

const contactRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 25,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { message: "Too many contact requests. Please wait a few minutes and try again." },
});

const adminLoginRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { message: "Too many login attempts. Please try again later." },
});

const uploadsPath = path.resolve(__dirname, "..", "public", "uploads");
fs.mkdirSync(uploadsPath, { recursive: true });

const blogUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, callback) => {
    callback(null, ["image/jpeg", "image/png", "image/webp", "image/gif"].includes(file.mimetype));
  },
});

const adminUsername = process.env.ADMIN_USERNAME || "admin";
const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
const adminJwtSecret = process.env.ADMIN_JWT_SECRET || "nextgenies_jwt_secret_dev_key_2026";

function authenticateAdmin(req, res, next) {
  const token = req.headers.authorization?.replace(/^Bearer\s+/i, "");

  if (!token) {
    return res.status(401).json({ message: "Admin authentication required." });
  }

  try {
    jwt.verify(token, adminJwtSecret);
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

// ============================================================================
// HEALTH CHECK
// ============================================================================
app.get("/api/health", async (_req, res) => {
  try {
    const health = await db.healthCheck();
    res.json({
      status: "ok",
      database: health.driver,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
});

// ============================================================================
// CONTACT FORM SUBMISSION (CONNECT TO DATABASE)
// ============================================================================
app.post("/api/contacts", contactRateLimit, async (req, res, next) => {
  try {
    const readField = (value) => (typeof value === "string" ? value.trim() : "");

    const fullName = readField(req.body?.fullName);
    const email = readField(req.body?.email).toLowerCase();
    const phone = readField(req.body?.phone) || "Not provided";
    const company = readField(req.body?.company) || "";
    const service = readField(req.body?.service);
    const needOption = readField(req.body?.needOption) || "";
    const scopePreference = readField(req.body?.scopePreference) || "";
    const timeline = readField(req.body?.timeline) || "";
    const message = readField(req.body?.message);

    // Validation
    if (
      !fullName ||
      !email ||
      !service ||
      !message ||
      fullName.length > 100 ||
      email.length > 255 ||
      phone.length > 50 ||
      company.length > 150 ||
      service.length > 100 ||
      message.length > 15000 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
      return res.status(400).json({
        message: "Please provide a valid full name, email, service, and message.",
      });
    }

    // Insert into database (MySQL or SQLite)
    const [result] = await db.execute(
      `INSERT INTO contacts 
      (full_name, email, phone, company, service, need_option, scope_preference, timeline, message)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [fullName, email, phone, company, service, needOption, scopePreference, timeline, message]
    );

    // Send notifications if SMTP configured
    let emailSent = false;
    try {
      await sendContactEmails({ fullName, email, phone, service, message });
      emailSent = true;
    } catch (emailError) {
      console.warn("Notice: SMTP email notification skipped or failed:", emailError.message);
    }

    console.log(`📥 Contact lead #${result.insertId} saved to database [${db.driver}]: ${fullName} (${email})`);

    res.status(201).json({
      message: "Message received and saved to database successfully!",
      id: result.insertId,
      database: db.driver,
      emailSent,
    });
  } catch (error) {
    next(error);
  }
});

// ============================================================================
// ADMIN CONTACTS MANAGEMENT (View all received leads)
// ============================================================================
app.get("/api/admin/contacts", authenticateAdmin, async (_req, res, next) => {
  try {
    const [contacts] = await db.query(
      `SELECT id, 
              full_name AS fullName, 
              email, 
              phone, 
              company, 
              service, 
              need_option AS needOption, 
              scope_preference AS scopePreference, 
              timeline, 
              message, 
              created_at AS createdAt 
       FROM contacts 
       ORDER BY id DESC`
    );
    res.json(contacts);
  } catch (error) {
    next(error);
  }
});

app.delete("/api/admin/contacts/:id", authenticateAdmin, async (req, res, next) => {
  try {
    await db.execute("DELETE FROM contacts WHERE id = ?", [req.params.id]);
    res.json({ message: "Inquiry deleted successfully." });
  } catch (error) {
    next(error);
  }
});

// ============================================================================
// ADMIN AUTHENTICATION
// ============================================================================
app.post("/api/admin/login", adminLoginRateLimit, (req, res) => {
  const username = typeof req.body?.username === "string" ? req.body.username.trim() : "";
  const password = typeof req.body?.password === "string" ? req.body.password : "";

  if (username !== adminUsername || password !== adminPassword) {
    return res.status(401).json({ message: "Invalid admin credentials." });
  }

  const token = jwt.sign({ role: "admin", username }, adminJwtSecret, { expiresIn: "8h" });
  res.json({ token });
});

// ============================================================================
// BLOGS API
// ============================================================================
app.get("/api/blogs", async (_req, res, next) => {
  try {
    const [blogs] = await db.query(
      "SELECT id, title, slug, description, CASE WHEN image_data IS NOT NULL THEN CONCAT('/api/blogs/', id, '/image') ELSE image_url END AS imageUrl, author, published_at AS publishedAt, created_at AS createdAt FROM blogs WHERE is_published = 1 ORDER BY published_at DESC, id DESC"
    );
    res.json(blogs);
  } catch (error) {
    next(error);
  }
});

app.get("/api/blogs/:id/image", async (req, res, next) => {
  try {
    const [blogs] = await db.query(
      "SELECT image_data AS imageData, image_mime_type AS imageMimeType, image_url AS imageUrl FROM blogs WHERE id = ? AND is_published = 1 LIMIT 1",
      [req.params.id]
    );

    const blog = blogs[0];
    if (!blog) return res.status(404).json({ message: "Image not found." });
    if (!blog.imageData) return res.redirect(blog.imageUrl || "/images/blog-placeholder.svg");

    res.set("Content-Type", blog.imageMimeType || "application/octet-stream");
    res.set("Cache-Control", "public, max-age=31536000, immutable");
    res.send(blog.imageData);
  } catch (error) {
    next(error);
  }
});

app.get("/api/blogs/:slug", async (req, res, next) => {
  try {
    const [blogs] = await db.query(
      "SELECT id, title, slug, description, content, CASE WHEN image_data IS NOT NULL THEN CONCAT('/api/blogs/', id, '/image') ELSE image_url END AS imageUrl, author, published_at AS publishedAt, created_at AS createdAt FROM blogs WHERE slug = ? AND is_published = 1 LIMIT 1",
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
    const [blogs] = await db.query(
      "SELECT id, title, slug, description, content, CASE WHEN image_data IS NOT NULL THEN CONCAT('/api/blogs/', id, '/image') ELSE image_url END AS imageUrl, author, is_published AS isPublished, published_at AS publishedAt, created_at AS createdAt FROM blogs ORDER BY created_at DESC"
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
    const isPublished = req.body?.isPublished === "true" || req.body?.isPublished === "1" || req.body?.isPublished === true;

    if (!title || !description || !content || !slug) {
      return res.status(400).json({ message: "Title, description, content, and a valid slug are required." });
    }

    const imageData = req.file?.buffer || null;
    const imageMimeType = req.file?.mimetype || null;
    const [result] = await db.execute(
      `INSERT INTO blogs (title, slug, description, content, image_url, image_data, image_mime_type, author, is_published, published_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, slug, description, content, null, imageData, imageMimeType, author, isPublished ? 1 : 0, isPublished ? new Date().toISOString() : null]
    );
    res.status(201).json({ id: result.insertId, message: "Blog published successfully." });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY" || String(error.message).includes("UNIQUE")) {
      return res.status(409).json({ message: "A blog with that slug already exists." });
    }
    next(error);
  }
});

app.delete("/api/admin/blogs/:id", authenticateAdmin, async (req, res, next) => {
  try {
    const [rows] = await db.query("SELECT image_url AS imageUrl FROM blogs WHERE id = ?", [req.params.id]);
    await db.execute("DELETE FROM blogs WHERE id = ?", [req.params.id]);
    removeBlogImage(rows[0]?.imageUrl);
    res.json({ message: "Blog deleted." });
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
  try {
    const { driver } = await initDatabase();

    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      try {
        await transporter.verify();
        console.log("✅ SMTP Connected");
      } catch (smtpError) {
        console.warn("⚠️ SMTP notice:", smtpError.message);
      }
    } else {
      console.log("ℹ️ SMTP is not configured. Form submissions will be saved in the database only.");
    }

    app.listen(port, () => {
      console.log(`🚀 NextGenies API running on http://localhost:${port} [Database: ${driver}]`);
    });
  } catch (err) {
    console.error("❌ DATABASE / SERVER STARTUP ERROR:", err);
    process.exit(1);
  }
}

startServer();
