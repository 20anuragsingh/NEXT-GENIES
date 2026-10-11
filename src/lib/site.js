// Central place for site-wide constants.
export const SITE_NAME = "NextGenies";
export const SITE_URL = (import.meta.env.VITE_SITE_URL || "https://nextgenies.com").replace(/\/$/, "");
export const API_URL = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");
export const CONTACT = {
  email: "nextgenies.team@gmail.com",
  phone: "+91 99108 80760",
  whatsapp: "https://wa.me/919910880760",
};
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.png`;

/** Absolute URL for an image path returned by the API (/api/blogs/:id/image or /uploads/..). */
export function mediaUrl(path) {
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;
  return `${API_URL}${path}`;
}

/** Absolute (crawler-friendly) URL for an API media path. */
export function absoluteMedia(path) {
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;
  return `${API_URL || SITE_URL}${path}`;
}

export function formatDate(value) {
  if (!value) return "";
  const d = new Date(String(value).includes("T") || String(value).includes("Z") ? value : String(value).replace(" ", "T") + "Z");
  return Number.isNaN(d.getTime()) ? "" : d.toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" });
}
