import { lazy, Suspense, useEffect, useRef } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ErrorBoundary from "./components/ErrorBoundary";
import Home from "./pages/Home";
import { trackPageView } from "./lib/analytics";

const Services = lazy(() => import("./pages/Services"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const Blogs = lazy(() => import("./pages/Blogs"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const Admin = lazy(() => import("./pages/Admin"));
const NotFound = lazy(() => import("./pages/NotFound"));
const PrivacyPolicy = lazy(() => import("./pages/legal/PrivacyPolicy"));
const TermsAndConditions = lazy(() => import("./pages/legal/TermsAndConditions"));
const CookiePolicy = lazy(() => import("./pages/legal/CookiePolicy"));
const Disclaimer = lazy(() => import("./pages/legal/Disclaimer"));

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function AnalyticsPageViews() {
  const location = useLocation();
  const previousPath = useRef(null);

  useEffect(() => {
    const path = `${location.pathname}${location.search}${location.hash}`;
    if (location.pathname.startsWith("/admin") || previousPath.current === path) return;
    previousPath.current = path;
    const frame = window.requestAnimationFrame(() => trackPageView(path));
    return () => window.cancelAnimationFrame(frame);
  }, [location.pathname, location.search, location.hash]);

  return null;
}

function PageFallback() {
  return (
    <div className="page-loading" role="status" aria-label="Loading page">
      <span className="spinner" />
    </div>
  );
}

export default function App() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");

  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <ScrollToTop />
      <AnalyticsPageViews />
      {!isAdmin && <Navbar />}
      <div id="main" tabIndex={-1} className="page-wrap">
        <ErrorBoundary>
          <Suspense fallback={<PageFallback />}>
            {/* keyed wrapper replays the page-enter animation on every route change */}
            <div key={location.pathname.split("/").slice(0, 2).join("/")} className="page-enter">
              <Routes location={location}>
                <Route path="/" element={<Home />} />
                <Route path="/services" element={<Services />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/blogs" element={<Blogs />} />
                <Route path="/blogs/:slug" element={<BlogPost />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
                <Route path="/cookie-policy" element={<CookiePolicy />} />
                <Route path="/disclaimer" element={<Disclaimer />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          </Suspense>
        </ErrorBoundary>
      </div>
      {!isAdmin && <Footer />}
    </>
  );
}
