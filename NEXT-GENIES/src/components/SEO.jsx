import { useEffect } from "react";

const SITE_NAME = "NextGenies";
const BASE_URL = "https://nextgenies.com";
const DEFAULT_IMAGE = `${BASE_URL}/favicon.svg`;

function SEO({
  title,
  description,
  canonicalPath = "",
  ogType = "website",
  robots = "index, follow",
}) {
  useEffect(() => {
    const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} | Digital Growth Agency`;
    document.title = fullTitle;

    const setMeta = (name, content, isProperty = false) => {
      if (!content) return;
      const attr = isProperty ? "property" : "name";
      let element = document.querySelector(`meta[${attr}="${name}"]`);
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attr, name);
        document.head.appendChild(element);
      }
      element.setAttribute("content", content);
    };

    const setLink = (rel, href) => {
      if (!href) return;
      let element = document.querySelector(`link[rel="${rel}"]`);
      if (!element) {
        element = document.createElement("link");
        element.setAttribute("rel", rel);
        document.head.appendChild(element);
      }
      element.setAttribute("href", href);
    };

    const canonicalUrl = `${BASE_URL}${canonicalPath}`;

    // Standard Meta
    setMeta("description", description);
    setMeta("robots", robots);
    setLink("canonical", canonicalUrl);

    // Open Graph
    setMeta("og:title", fullTitle, true);
    setMeta("og:description", description, true);
    setMeta("og:url", canonicalUrl, true);
    setMeta("og:type", ogType, true);
    setMeta("og:site_name", SITE_NAME, true);
    setMeta("og:image", DEFAULT_IMAGE, true);

    // Twitter Card
    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:title", fullTitle);
    setMeta("twitter:description", description);
    setMeta("twitter:image", DEFAULT_IMAGE);
  }, [title, description, canonicalPath, ogType, robots]);

  return null;
}

export default SEO;
