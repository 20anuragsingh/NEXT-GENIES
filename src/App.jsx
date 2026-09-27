import { useEffect, lazy, Suspense } from "react";
import Breadcrumbs from "./components/Breadcrumbs";
import { Routes, Route, useLocation } from "react-router-dom";

import Home from "./pages/Home";
import ErrorBoundary from "./components/ErrorBoundary";

const Services = lazy(() => import("./pages/Services"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const TermsAndConditions = lazy(() => import("./pages/TermsAndConditions"));
const CookiePolicy = lazy(() => import("./pages/CookiePolicy"));
const Disclaimer = lazy(() => import("./pages/Disclaimer"));
const NotFound = lazy(() => import("./pages/NotFound"));

function App() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);

    const selector = [
      ".trust",
      ".section",
      ".cta-section",
      ".services-header",
      ".service-detail-card",
      ".services-cta",
      ".about-hero",
      ".mission-card",
      ".about-values-heading",
      ".about-value-card",
      ".about-work-cta",
      ".contact-form-card",
      ".contact-info > *",
      ".legal-section",
    ].join(",");

    const hasIntersectionObserver = "IntersectionObserver" in window;
    let observer = null;

    if (hasIntersectionObserver) {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          });
        },
        { threshold: 0.12, rootMargin: "0px 0px -7% 0px" },
      );
    }

    const applyScrollReveal = () => {
      const elements = [...document.querySelectorAll(selector)];
      elements.forEach((element, index) => {
        if (!element.classList.contains("scroll-reveal")) {
          element.classList.add("scroll-reveal");
          element.style.setProperty("--reveal-delay", `${(index % 4) * 70}ms`);
        }

        if (!hasIntersectionObserver) {
          element.classList.add("is-visible");
        } else if (!element.classList.contains("is-visible") && observer) {
          observer.observe(element);
        }
      });
    };

    applyScrollReveal();

    const mutationObserver = new MutationObserver(() => {
      applyScrollReveal();
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      mutationObserver.disconnect();
      if (observer) {
        observer.disconnect();
      }
    };
  }, [location.pathname]);

  return (
    <ErrorBoundary>
      <Suspense fallback={<div style={{ minHeight: "60vh" }} />}>
        <Breadcrumbs />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
          <Route path="/cookie-policy" element={<CookiePolicy />} />
          <Route path="/disclaimer" element={<Disclaimer />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}

export default App;
