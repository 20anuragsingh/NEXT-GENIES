import { SITE_URL } from "./site";

/** Canonical URLs use a trailing slash for non-root routes to match how static hosts serve the prerendered pages. */
export const canonicalFor = (path = "/") => (path === "/" || path === "" ? `${SITE_URL}/` : `${SITE_URL}${path.replace(/\/$/, "")}/`);

export const breadcrumbLd = (items) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: item.name,
    item: canonicalFor(item.path),
  })),
});
