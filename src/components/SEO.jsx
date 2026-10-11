import { useEffect } from "react";
import { SITE_NAME, DEFAULT_OG_IMAGE } from "../lib/site";
import { canonicalFor } from "../lib/seoHelpers";

function upsert(selector, create, apply) {
  let el = document.head.querySelector(selector);
  if (!el) {
    el = create();
    document.head.appendChild(el);
  }
  apply(el);
}

const meta = (key, content, prop = false) =>
  content &&
  upsert(
    `meta[${prop ? "property" : "name"}="${key}"]`,
    () => {
      const el = document.createElement("meta");
      el.setAttribute(prop ? "property" : "name", key);
      return el;
    },
    (el) => el.setAttribute("content", content),
  );

/**
 * Per-page head management: title, description, canonical, Open Graph, Twitter and JSON-LD.
 * `jsonLd` can be one object or an array. Crawlers that don't run JS get the same tags from the
 * prerendered files created by scripts/generate-seo.mjs.
 */
export default function SEO({
  title,
  description,
  path = "/",
  ogType = "website",
  image,
  robots = "index, follow",
  jsonLd,
  publishedTime,
}) {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} | Digital Growth Agency`;
  const url = canonicalFor(path);
  const ogImage = image || DEFAULT_OG_IMAGE;
  const ld = jsonLd ? JSON.stringify(jsonLd) : "";

  useEffect(() => {
    document.title = fullTitle;
    meta("description", description);
    meta("robots", robots);
    upsert(
      'link[rel="canonical"]',
      () => Object.assign(document.createElement("link"), { rel: "canonical" }),
      (el) => el.setAttribute("href", url),
    );
    meta("og:title", fullTitle, true);
    meta("og:description", description, true);
    meta("og:url", url, true);
    meta("og:type", ogType, true);
    meta("og:site_name", SITE_NAME, true);
    meta("og:image", ogImage, true);
    meta("twitter:card", "summary_large_image");
    meta("twitter:title", fullTitle);
    meta("twitter:description", description);
    meta("twitter:image", ogImage);
    if (publishedTime) meta("article:published_time", publishedTime, true);
  }, [fullTitle, description, url, ogType, ogImage, robots, publishedTime]);

  useEffect(() => {
    const id = "ld-page";
    document.getElementById(id)?.remove();
    if (!ld) return;
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = id;
    script.textContent = ld;
    document.head.appendChild(script);
    return () => script.remove();
  }, [ld]);

  return null;
}
