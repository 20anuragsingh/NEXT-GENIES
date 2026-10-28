import dotenv from "dotenv";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import nodemailer from "nodemailer";
import multer from "multer";
import sharp from "sharp";
import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { initDatabase, db } from "./db.js";
import { ROUTE_META } from "./routes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, ".env") });
const app = express();
const isProduction = process.env.NODE_ENV === "production";
if (isProduction) app.set("trust proxy", 1);
const port = isProduction ? 3000 : Number(process.env.PORT || 5000);

// CORS: Allow all domains
const normalizeOrigin = (origin) => origin.trim().replace(/^['\"]|['\"]$/g, "").replace(/\/$/, "");
const frontendOrigins = (process.env.FRONTEND_ORIGINS || process.env.FRONTEND_ORIGIN || "*")
  .split(",")
  .map(normalizeOrigin)
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
  connectionTimeout: 5000,
  greetingTimeout: 5000,
  socketTimeout: 8000,
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

app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" },
  }),
);

// Allow API requests from all domains (CORS)
app.use((req, res, next) => {
  const requestOrigin = req.headers.origin;
  if (requestOrigin) {
    res.header("Access-Control-Allow-Origin", requestOrigin);
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Vary", "Origin");
  } else {
    res.header("Access-Control-Allow-Origin", "*");
  }
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-Requested-With, Accept, Origin"
  );
  if (req.path.startsWith("/api/")) res.set("Cache-Control", "no-store");
  if (req.method === "OPTIONS") {
    res.set("Cache-Control", "no-store");
    return res.status(204).end();
  }
  next();
});

app.options("/{*splat}", (req, res) => {
  const requestOrigin = req.headers.origin;
  if (requestOrigin) {
    res.header("Access-Control-Allow-Origin", requestOrigin);
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Vary", "Origin");
  } else {
    res.header("Access-Control-Allow-Origin", "*");
  }
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-Requested-With, Accept, Origin"
  );
  res.set("Cache-Control", "no-store");
  res.status(204).end();
});

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

const adminUsername = process.env.ADMIN_USERNAME || (isProduction ? "" : "admin");
const adminPassword = process.env.ADMIN_PASSWORD || (isProduction ? "" : "admin123");
const adminJwtSecret = process.env.ADMIN_JWT_SECRET || (isProduction ? "" : "nextgenies_jwt_secret_dev_key_2026");

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

function readJsonList(value, maxItems = 30) {
  const values = Array.isArray(value) ? value : String(value || "").split(",");
  return [...new Set(values.map((item) => String(item).trim()).filter(Boolean))].slice(0, maxItems);
}

function readFaq(value) {
  let items = value;
  if (typeof value === "string") {
    try { items = JSON.parse(value); } catch { items = []; }
  }
  if (!Array.isArray(items)) return [];
  return items
    .filter((item) => item && typeof item.question === "string" && typeof item.answer === "string")
    .map((item) => ({ question: item.question.trim().slice(0, 300), answer: item.answer.trim().slice(0, 2000) }))
    .filter((item) => item.question && item.answer)
    .slice(0, 20);
}

const blogFields = `id, title, slug, description, content,
  COALESCE(image_url, CASE WHEN image_data IS NOT NULL THEN CONCAT('/api/blogs/', id, '/image') ELSE NULL END) AS imageUrl,
  image_url AS storedImageUrl, image_data AS imageData, author, is_published AS isPublished,
  published_at AS publishedAt, created_at AS createdAt, alt_text AS altText,
  categories, tags, meta_title AS metaTitle, meta_description AS metaDescription,
  focus_keywords AS focusKeywords, additional_keywords AS additionalKeywords,
  robots_meta AS robotsMeta, canonical_url AS canonicalUrl, faq_schema AS faqSchema`;

function blogResponse(blog) {
  if (!blog) return blog;
  const parse = (value, fallback) => {
    try { return value ? JSON.parse(value) : fallback; } catch { return fallback; }
  };
  return {
    ...blog,
    categories: parse(blog.categories, []),
    tags: parse(blog.tags, []),
    faq: parse(blog.faqSchema, []),
    faqSchema: undefined,
    imageData: undefined,
    storedImageUrl: undefined,
  };
}

function blogInput(body) {
  const title = readBlogField(body?.title, 180);
  const description = readBlogField(body?.description || body?.excerpt, 320);
  const content = readBlogField(body?.content, 50000);
  const slug = slugify(readBlogField(body?.slug, 180) || title);
  const metaTitle = readBlogField(body?.metaTitle, 180);
  const metaDescription = readBlogField(body?.metaDescription, 320);
  const robotsMeta = readBlogField(body?.robotsMeta, 100) || "index, follow";
  const canonicalUrl = readBlogField(body?.canonicalUrl, 500);
  if (!title || !description || !content || !slug || !/^(index|noindex),\s*(follow|nofollow)$/.test(robotsMeta)) {
    throw Object.assign(new Error("Title, excerpt, content, and valid SEO fields are required."), { status: 400 });
  }
  if (canonicalUrl && !/^https?:\/\/[^\s]+$/i.test(canonicalUrl)) {
    throw Object.assign(new Error("Canonical URL must be an absolute HTTP(S) URL."), { status: 400 });
  }
  return {
    title, description, content, slug, author: readBlogField(body?.author, 100) || "NextGenies",
    altText: readBlogField(body?.altText, 180),
    categories: JSON.stringify(readJsonList(body?.categories)),
    tags: JSON.stringify(readJsonList(body?.tags)),
    metaTitle: metaTitle || title,
    metaDescription: metaDescription || description,
    focusKeywords: readBlogField(body?.focusKeywords, 500),
    additionalKeywords: readBlogField(body?.additionalKeywords, 500),
    robotsMeta, canonicalUrl, faqSchema: JSON.stringify(readFaq(body?.faq)),
    isPublished: body?.isPublished === "true" || body?.isPublished === "1" || body?.isPublished === true,
  };
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

/**
 * Adjust blog cover image to 16:9 ratio (1200x675) so it displays fully
 * without being cropped by `.cover` (object-fit: cover) on the frontend.
 * - If already ~16:9, resizes directly to 1200x675.
 * - If non-16:9 (portrait, square, 4:3, etc.), fits the entire image inside
 *   1200x675 and creates a matching blurred backdrop from the image so
 *   the entire original is visible and looks professional.
 */
async function adjustBlogImage(buffer) {
  const metadata = await sharp(buffer).metadata();
  const TARGET_WIDTH = 1200;
  const TARGET_HEIGHT = 675; // Standard 16:9
  const targetRatio = TARGET_WIDTH / TARGET_HEIGHT;
  const width = metadata.width || TARGET_WIDTH;
  const height = metadata.height || TARGET_HEIGHT;
  const currentRatio = width / height;

  // If already close to 16:9 (within 5% margin), resize directly
  if (Math.abs(currentRatio - targetRatio) < 0.05) {
    return await sharp(buffer)
      .resize(TARGET_WIDTH, TARGET_HEIGHT, { fit: "cover" })
      .jpeg({ quality: 90, mozjpeg: true })
      .toBuffer();
  }

  // Preserve full original image inside 1200x675 canvas
  const foreground = await sharp(buffer)
    .resize(TARGET_WIDTH, TARGET_HEIGHT, { fit: "inside" })
    .toBuffer();

  let background;
  if (metadata.hasAlpha) {
    background = await sharp({
      create: {
        width: TARGET_WIDTH,
        height: TARGET_HEIGHT,
        channels: 4,
        background: { r: 15, g: 23, b: 42, alpha: 1 },
      },
    })
      .png()
      .toBuffer();
  } else {
    background = await sharp(buffer)
      .resize(TARGET_WIDTH, TARGET_HEIGHT, { fit: "cover" })
      .blur(30)
      .modulate({ brightness: 0.75 })
      .toBuffer();
  }

  return await sharp(background)
    .composite([{ input: foreground, gravity: "center" }])
    .jpeg({ quality: 90, mozjpeg: true })
    .toBuffer();
}

// ============================================================================
// HEALTH CHECK
// ============================================================================
app.get("/api/ping", (_req, res) => res.json({ status: "ok", message: "pong", time: new Date().toISOString() }));

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
      message: isProduction ? "Database unavailable." : error.message,
    });
  }
});

// ============================================================================
// CONTACT FORM SUBMISSION (CONNECT TO DATABASE)
// ============================================================================
app.post("/api/contacts", contactRateLimit, async (req, res, next) => {
  console.log("\n=======================================================");
  console.log("📥 [Backend /api/contacts] Step 1: Received new contact submission");
  console.log("🌐 Origin:", req.headers.origin || "same-origin", "| Method: POST | IP:", req.ip);
  console.log("📋 Request received (fields):", Object.keys(req.body || {}));
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

    console.log("🔍 [Backend /api/contacts] Step 2: Validating input fields...");
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
      !/^[^s@]+@[^s@]+.[^s@]+$/.test(email)
    ) {
      console.warn("❌ [Backend /api/contacts] Step 2 Failed: Validation failed! Invalid or missing fields.");
      return res.status(400).json({
        message: "Please provide a valid full name, email, service, and message.",
      });
    }
    console.log("✅ [Backend /api/contacts] Step 2 Passed: All input fields are valid.");

    // Insert into database (MySQL or SQLite)
    console.log(`💾 [Backend /api/contacts] Step 3: Saving to database [${db.driver}]...`);
    const [result] = await db.execute(
      `INSERT INTO contacts 
      (full_name, email, phone, company, service, need_option, scope_preference, timeline, message)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [fullName, email, phone, company, service, needOption, scopePreference, timeline, message]
    );
    console.log(`✅ [Backend /api/contacts] Step 3 Passed: Successfully saved in database! Record ID: #${result.insertId}`);

    // Send notifications asynchronously without blocking the user response
    let emailSent = false;
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS && emailRecipients.length) {
      console.log("📧 [Backend /api/contacts] Step 4: Dispatching background notification email...");
      sendContactEmails({ fullName, email, phone, service, message })
        .then(() => console.log(`📧 [Backend /api/contacts] Notification email sent for inquiry #${result.insertId}`))
        .catch((emailError) => console.warn("⚠️ [Backend /api/contacts] SMTP email notification failed:", emailError.message));
      emailSent = true;
    } else {
      console.log("ℹ️ [Backend /api/contacts] Step 4: SMTP notification skipped (not configured).");
    }

    console.log("📤 [Backend /api/contacts] Step 5: Returning HTTP 201 Created response to client.");
    console.log("=======================================================\n");

    res.status(201).json({
      message: "Message received and saved to database successfully!",
      id: result.insertId,
      database: db.driver,
      emailSent,
    });
  } catch (error) {
    console.error("🚨 [Backend /api/contacts] Fatal error:", error);
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
      "SELECT id, title, slug, description, COALESCE(image_url, CASE WHEN image_data IS NOT NULL THEN CONCAT('/api/blogs/', id, '/image') ELSE NULL END) AS imageUrl, author, categories, tags, published_at AS publishedAt, created_at AS createdAt FROM blogs WHERE is_published = 1 ORDER BY published_at DESC, id DESC"
    );
    res.json(blogs.map(blogResponse));
  } catch (error) {
    next(error);
  }
});

app.get("/api/blogs/:id/image", async (req, res, next) => {
  try {
    const [blogs] = await db.query(
      "SELECT image_data AS imageData, image_mime_type AS imageMimeType, image_url AS imageUrl FROM blogs WHERE id = ? LIMIT 1",
      [req.params.id]
    );

    const blog = blogs[0];
    if (!blog) return res.status(404).json({ message: "Image not found." });
    if (!blog.imageData) return res.redirect(blog.imageUrl || "/images/blog-placeholder.svg");

    res.set("Content-Type", blog.imageMimeType || "image/jpeg");
    res.set("Cache-Control", "public, max-age=31536000, immutable");
    res.send(blog.imageData);
  } catch (error) {
    next(error);
  }
});

app.get("/api/blogs/:slug", async (req, res, next) => {
  try {
    const [blogs] = await db.query(
      `SELECT ${blogFields} FROM blogs WHERE slug = ? AND is_published = 1 LIMIT 1`,
      [req.params.slug]
    );

    if (!blogs.length) return res.status(404).json({ message: "Blog not found." });
    res.json(blogResponse(blogs[0]));
  } catch (error) {
    next(error);
  }
});

app.get("/api/admin/blogs", authenticateAdmin, async (_req, res, next) => {
  try {
    const [blogs] = await db.query(
      `SELECT ${blogFields} FROM blogs ORDER BY created_at DESC`
    );
    res.json(blogs.map(blogResponse));
  } catch (error) {
    next(error);
  }
});

app.post("/api/admin/blogs", authenticateAdmin, blogUpload.single("image"), async (req, res, next) => {
  try {
    const input = blogInput(req.body);

    let imageData = null;
    let imageMimeType = null;
    let imageUrl = null;

    if (req.file?.buffer) {
      const processedBuffer = await adjustBlogImage(req.file.buffer);
      imageData = processedBuffer;
      imageMimeType = "image/jpeg";

      const fileName = `blog-${input.slug}-${Date.now()}.jpg`;
      const filePath = path.join(uploadsPath, fileName);
      await fs.promises.writeFile(filePath, processedBuffer);
      imageUrl = `/uploads/${fileName}`;
    }

    const [result] = await db.execute(
      `INSERT INTO blogs (title, slug, description, content, image_url, image_data, image_mime_type, author, is_published, published_at,
       alt_text, categories, tags, meta_title, meta_description, focus_keywords, additional_keywords, robots_meta, canonical_url, faq_schema)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [input.title, input.slug, input.description, input.content, imageUrl, imageData, imageMimeType, input.author,
        input.isPublished ? 1 : 0, input.isPublished ? new Date().toISOString() : null, input.altText, input.categories,
        input.tags, input.metaTitle, input.metaDescription, input.focusKeywords, input.additionalKeywords, input.robotsMeta,
        input.canonicalUrl, input.faqSchema]
    );
    res.status(201).json({ id: result.insertId, message: input.isPublished ? "Blog published successfully." : "Draft saved successfully." });
  } catch (error) {
    if (error.status) return res.status(error.status).json({ message: error.message });
    if (error.code === "ER_DUP_ENTRY" || String(error.message).includes("UNIQUE")) {
      return res.status(409).json({ message: "A blog with that slug already exists." });
    }
    next(error);
  }
});

app.put("/api/admin/blogs/:id", authenticateAdmin, blogUpload.single("image"), async (req, res, next) => {
  try {
    const input = blogInput(req.body);
    const [existingRows] = await db.query("SELECT image_url AS imageUrl, image_data AS imageData, image_mime_type AS imageMimeType FROM blogs WHERE id = ?", [req.params.id]);
    const existing = existingRows[0];
    if (!existing) return res.status(404).json({ message: "Blog not found." });
    let imageUrl = existing.imageUrl;
    let imageData = existing.imageData;
    let imageMimeType = existing.imageMimeType;
    if (req.file?.buffer) {
      const processedBuffer = await adjustBlogImage(req.file.buffer);
      imageData = processedBuffer;
      imageMimeType = "image/jpeg";
      const fileName = `blog-${input.slug}-${Date.now()}.jpg`;
      await fs.promises.writeFile(path.join(uploadsPath, fileName), processedBuffer);
      imageUrl = `/uploads/${fileName}`;
      removeBlogImage(existing.imageUrl);
    }
    await db.execute(
      `UPDATE blogs SET title=?, slug=?, description=?, content=?, image_url=?, image_data=?, image_mime_type=?, author=?,
       is_published=?, published_at=?, alt_text=?, categories=?, tags=?, meta_title=?, meta_description=?, focus_keywords=?,
       additional_keywords=?, robots_meta=?, canonical_url=?, faq_schema=? WHERE id=?`,
      [input.title, input.slug, input.description, input.content, imageUrl, imageData, imageMimeType, input.author,
        input.isPublished ? 1 : 0, input.isPublished ? new Date().toISOString() : null, input.altText, input.categories,
        input.tags, input.metaTitle, input.metaDescription, input.focusKeywords, input.additionalKeywords, input.robotsMeta,
        input.canonicalUrl, input.faqSchema, req.params.id],
    );
    res.json({ message: input.isPublished ? "Blog updated and published." : "Draft updated." });
  } catch (error) {
    if (error.status) return res.status(error.status).json({ message: error.message });
    if (error.code === "ER_DUP_ENTRY" || String(error.message).includes("UNIQUE")) return res.status(409).json({ message: "A blog with that slug already exists." });
    next(error);
  }
});

for (const [action, published] of [["publish", 1], ["unpublish", 0]]) {
  app.post(`/api/admin/blogs/:id/${action}`, authenticateAdmin, async (req, res, next) => {
    try {
      const [result] = await db.execute("UPDATE blogs SET is_published = ?, published_at = ? WHERE id = ?", [published, published ? new Date().toISOString() : null, req.params.id]);
      if (!result.affectedRows) return res.status(404).json({ message: "Blog not found." });
      res.json({ message: published ? "Blog published." : "Blog unpublished." });
    } catch (error) { next(error); }
  });
}

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

// Dynamic SEO documents stay current when an admin publishes, edits, unpublishes, or deletes a blog.
const publicSiteUrl = (process.env.VITE_SITE_URL || process.env.SITE_URL || "https://nextgenies.com").replace(/\/$/, "");
const xmlEscape = (value) => String(value)
  .replace(/&/g, "&amp;")
  .replace(/</g, "&lt;")
  .replace(/>/g, "&gt;")
  .replace(/"/g, "&quot;")
  .replace(/'/g, "&apos;");
const sitemapUrl = (route) => route === "/" ? `${publicSiteUrl}/` : `${publicSiteUrl}${route}/`;
const sitemapDate = (value) => {
  const text = String(value || "");
  const date = value ? new Date(typeof value === "number" ? value : text.includes("T") || text.includes("Z") ? value : `${text.replace(" ", "T")}Z`) : null;
  return date && !Number.isNaN(date.getTime()) ? date.toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10);
};

app.get("/sitemap.xml", async (_req, res, next) => {
  try {
    const [blogs] = await db.query(
      "SELECT slug, published_at AS publishedAt, created_at AS createdAt FROM blogs WHERE is_published = 1 ORDER BY published_at DESC, id DESC"
    );
    const newestBlogDate = blogs.reduce(
      (latest, blog) => Math.max(latest, new Date(blog.publishedAt || blog.createdAt || 0).getTime()),
      0,
    );
    const urls = [
      ...ROUTE_META.map((route) => ({
        loc: sitemapUrl(route.path),
        lastmod: route.path === "/blogs" && newestBlogDate ? sitemapDate(newestBlogDate) : sitemapDate(),
        changefreq: route.changefreq,
        priority: route.priority,
      })),
      ...blogs.map((blog) => ({
        loc: sitemapUrl(`/blogs/${blog.slug}`),
        lastmod: sitemapDate(blog.publishedAt || blog.createdAt),
        changefreq: "monthly",
        priority: 0.7,
      })),
    ];
    const body = urls
      .map((url) => `  <url>\n    <loc>${xmlEscape(url.loc)}</loc>\n    <lastmod>${url.lastmod}</lastmod>\n    <changefreq>${url.changefreq}</changefreq>\n    <priority>${Number(url.priority).toFixed(1)}</priority>\n  </url>`)
      .join("\n");
    res
      .type("application/xml")
      .set("Cache-Control", "public, max-age=300, stale-while-revalidate=600")
      .send(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`);
  } catch (error) {
    next(error);
  }
});

app.get("/robots.txt", (_req, res) => {
  res
    .type("text/plain")
    .set("Cache-Control", "public, max-age=3600, stale-while-revalidate=86400")
    .send(`# NextGenies — crawl rules
User-agent: *
Allow: /
Allow: /api/blogs/*/image
Disallow: /api/
Disallow: /admin
Disallow: /admin/

Sitemap: ${publicSiteUrl}/sitemap.xml
`);
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
    if (isProduction) {
      if (!adminUsername || !adminPassword || !adminJwtSecret) {
        throw new Error("ADMIN_USERNAME, ADMIN_PASSWORD, and ADMIN_JWT_SECRET are required in production.");
      }
      if (adminJwtSecret.length < 32 || adminJwtSecret === "replace-with-a-long-random-secret") {
        throw new Error("ADMIN_JWT_SECRET must be a unique random value of at least 32 characters in production.");
      }
    }
    const { driver } = await initDatabase();

    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      transporter.verify().then(() => {
        console.log("✅ SMTP Connected");
      }).catch((smtpError) => {
        console.warn("⚠️ SMTP notice:", smtpError.message);
      });
    } else {
      console.log("ℹ️ SMTP is not configured. Form submissions will be saved in the database only.");
    }

    app.listen(port, "0.0.0.0", () => {
      console.log(`🚀 NextGenies API running on http://localhost:${port} [Database: ${driver}]`);
    });
  } catch (err) {
    console.error("❌ DATABASE / SERVER STARTUP ERROR:", err);
    process.exit(1);
  }
}

startServer();
