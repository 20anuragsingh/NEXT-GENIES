#!/usr/bin/env node
/**
 * Post-build SEO step (runs automatically after `vite build`).
 *
 *  1. Prerenders per-route HTML (title, description, canonical, Open Graph, Twitter, JSON-LD and a plain-text
 *     fallback) into dist/<route>/index.html — so crawlers and link-preview bots that don't run JavaScript still
 *     see the correct metadata. The React app takes over as soon as the JS loads.
 *  2. Fetches published blogs from the existing API (GET /api/blogs, GET /api/blogs/:slug) and prerenders each one.
 *  3. Writes a build-time fallback sitemap.xml (static routes + every published blog) and robots.txt into dist/.
 *
 * Production deployments serve dynamic sitemap.xml and robots.txt from the backend, so publishing
 * through the admin page does not require a frontend rebuild. The generated files remain a fallback
 * for static hosting and local previews.
 * Env: VITE_SITE_URL, SEO_API_URL (falls back to VITE_API_URL, then the site URL).
 * It never fails the build: if the API is unreachable you still get the static routes.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { ROUTE_META } from "../src/seo/routes.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");

// minimal .env loader (so `npm run seo` picks up .env without extra deps)
for (const file of [".env", ".env.production", ".env.local"]) {
  const p = path.join(root, file);
  if (!fs.existsSync(p)) continue;
  for (const line of fs.readFileSync(p, "utf8").split(/\r?\n/)) {
    const m = /^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/.exec(line);
    if (m && !(m[1] in process.env)) process.env[m[1]] = m[2].replace(/^['"]|['"]$/g, "");
  }
}

const SITE = (process.env.VITE_SITE_URL || process.env.SITE_URL || "https://nextgenies.com").replace(/\/$/, "");
const API = (process.env.SEO_API_URL || process.env.VITE_API_URL || SITE).replace(/\/$/, "");
const SITE_NAME = "NextGenies";
const OG_IMAGE = `${SITE}/og-image.png`;

if (!fs.existsSync(path.join(dist, "index.html"))) {
  console.error("[seo] dist/index.html not found — run `vite build` first.");
  process.exit(0);
}
const template = fs.readFileSync(path.join(dist, "index.html"), "utf8");

const esc = (s = "") => String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const ldScript = (obj) => `<script type="application/ld+json" id="ld-page">${JSON.stringify(obj).replace(/</g, "\\u003c")}</script>`;
const canonical = (p) => (p === "/" ? `${SITE}/` : `${SITE}${p}/`);
const fullTitle = (t) => (t ? `${t} | ${SITE_NAME}` : `${SITE_NAME} | Digital Growth Agency`);
const abs = (p) => (!p ? "" : /^https?:\/\//i.test(p) ? p : `${API}${p}`);

function head({ title, description, path: p, type = "website", image = OG_IMAGE, robots = "index, follow", canonicalUrl, ld }) {
  const t = fullTitle(title);
  const url = canonicalUrl || canonical(p);
  return [
    `<title>${esc(t)}</title>`,
    `<meta name="description" content="${esc(description)}" />`,
    `<link rel="canonical" href="${url}" />`,
    `<meta name="robots" content="${robots}" />`,
    `<meta property="og:type" content="${type}" />`,
    `<meta property="og:site_name" content="${SITE_NAME}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:title" content="${esc(t)}" />`,
    `<meta property="og:description" content="${esc(description)}" />`,
    `<meta property="og:image" content="${esc(image)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${esc(t)}" />`,
    `<meta name="twitter:description" content="${esc(description)}" />`,
    `<meta name="twitter:image" content="${esc(image)}" />`,
    ld ? ldScript(ld) : "",
  ].join("\n    ");
}

const NAV = `<nav><a href="/">Home</a> <a href="/services/">Services</a> <a href="/about/">About</a> <a href="/blogs/">Blogs</a> <a href="/contact/">Contact</a></nav>`;
const fallback = (inner) => `<main style="max-width:760px;margin:0 auto;padding:96px 20px;font-family:system-ui,sans-serif">${NAV}${inner}</main>`;

function render({ headHtml, bodyHtml }) {
  let html = template.replace("<seo-placeholder></seo-placeholder>", `<!-- seo -->\n    ${headHtml}\n    <!-- /seo -->`);
  html = html.replace("<!--app-fallback-->", bodyHtml);
  return html;
}

function write(routePath, html) {
  const target = routePath === "/" ? path.join(dist, "index.html") : path.join(dist, routePath.replace(/^\//, ""), "index.html");
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, html);
  const written = fs.readFileSync(target, "utf8");
  if (!written.includes(`href="${canonical(routePath)}"`)) {
    throw new Error(`[seo] ${routePath} did not receive its route-specific canonical URL.`);
  }
}

async function getJson(url) {
  const ctl = new AbortController();
  const timer = setTimeout(() => ctl.abort(), 10000);
  try {
    const res = await fetch(url, { signal: ctl.signal, headers: { accept: "application/json" } });
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
    return await res.json();
  } finally {
    clearTimeout(timer);
  }
}

const crumbs = (items) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it[0], item: canonical(it[1]) })),
});

// ───────── static routes ─────────
for (const r of ROUTE_META) {
  const ld =
    r.path === "/"
      ? [
          { "@context": "https://schema.org", "@type": "Organization", name: SITE_NAME, url: SITE, logo: `${SITE}/ng-logo-transparent.png`, description: r.description },
          { "@context": "https://schema.org", "@type": "WebSite", name: SITE_NAME, url: SITE },
        ]
      : crumbs([["Home", "/"], [r.heading, r.path]]);
  write(
    r.path,
    render({
      headHtml: head({ title: r.title, description: r.description, path: r.path, ld }),
      bodyHtml: fallback(`<h1>${esc(r.heading)}</h1><p>${esc(r.description)}</p>`),
    }),
  );
}
console.log(`[seo] prerendered ${ROUTE_META.length} static routes`);

// ───────── blogs ─────────
let blogs = [];
try {
  const list = await getJson(`${API}/api/blogs`);
  const slugs = (Array.isArray(list) ? list : []).filter((b) => /^[a-z0-9-]+$/.test(b.slug || ""));
  const queue = [...slugs];
  const details = [];
  await Promise.all(
    Array.from({ length: 4 }, async () => {
      while (queue.length) {
        const b = queue.shift();
        try {
          details.push({ ...b, ...(await getJson(`${API}/api/blogs/${b.slug}`)) });
        } catch {
          details.push(b);
        }
      }
    }),
  );
  blogs = details;
  for (const b of blogs) {
    const p = `/blogs/${b.slug}`;
    const date = b.publishedAt || b.createdAt;
    const image = b.imageUrl ? abs(b.imageUrl) : OG_IMAGE;
    const title = b.metaTitle || b.title;
    const description = b.metaDescription || b.description;
    const pageCanonical = b.canonicalUrl || canonical(p);
    const ld = [
      crumbs([["Home", "/"], ["Blogs", "/blogs"], [b.title, p]]),
      {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: b.title,
        description,
        image: [image],
        datePublished: date,
        author: { "@type": "Person", name: b.author },
        publisher: { "@type": "Organization", name: SITE_NAME, logo: { "@type": "ImageObject", url: `${SITE}/ng-logo-transparent.png` } },
        mainEntityOfPage: pageCanonical,
      },
      ...(Array.isArray(b.faq) && b.faq.length ? [{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: b.faq.map((item) => ({ "@type": "Question", name: item.question, acceptedAnswer: { "@type": "Answer", text: item.answer } })),
      }] : []),
    ];
    const paragraphs = String(b.content || "")
      .split(/\n{2,}/)
      .map((t) => `<p>${esc(t.replace(/^#+\s*/gm, "").trim())}</p>`)
      .join("");
    write(
      p,
      render({
        headHtml: head({ title, description, path: p, type: "article", image, robots: b.robotsMeta || "index, follow", canonicalUrl: pageCanonical, ld }),
        bodyHtml: fallback(`<article><h1>${esc(b.title)}</h1><p>${esc(b.description)}</p>${paragraphs}</article>`),
      }),
    );
  }
  console.log(`[seo] prerendered ${blogs.length} blog posts from ${API}`);
} catch (error) {
  console.warn(`[seo] could not load blogs from ${API} (${error.message}). Sitemap will contain static routes only.`);
}

// ───────── sitemap.xml ─────────
const today = new Date().toISOString().slice(0, 10);
const day = (v) => {
  const d = v ? new Date(String(v).includes("T") || String(v).includes("Z") ? v : String(v).replace(" ", "T") + "Z") : null;
  return d && !Number.isNaN(d.getTime()) ? d.toISOString().slice(0, 10) : today;
};
const newest = blogs.map((b) => day(b.publishedAt || b.createdAt)).sort().pop();
const urls = [
  ...ROUTE_META.map((r) => ({
    loc: canonical(r.path),
    lastmod: r.path === "/blogs" && newest ? newest : today,
    changefreq: r.changefreq,
    priority: r.priority,
  })),
  ...blogs.map((b) => ({ loc: canonical(`/blogs/${b.slug}`), lastmod: day(b.updatedAt || b.publishedAt || b.createdAt), changefreq: "monthly", priority: 0.7 })),
];
fs.writeFileSync(
  path.join(dist, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    urls
      .map((u) => `  <url>\n    <loc>${esc(u.loc)}</loc>\n    <lastmod>${u.lastmod}</lastmod>\n    <changefreq>${u.changefreq}</changefreq>\n    <priority>${Number(u.priority).toFixed(1)}</priority>\n  </url>`)
      .join("\n") +
    `\n</urlset>\n`,
);
console.log(`[seo] sitemap.xml written with ${urls.length} URLs`);

// ───────── robots.txt ─────────
fs.writeFileSync(
  path.join(dist, "robots.txt"),
  `# NextGenies — crawl rules
User-agent: *
Allow: /
# Blog cover images are served by the API and should stay indexable
Allow: /api/blogs/*/image
Disallow: /api/
Disallow: /admin
Disallow: /admin/

Sitemap: ${SITE}/sitemap.xml
`,
);
console.log("[seo] robots.txt written");
