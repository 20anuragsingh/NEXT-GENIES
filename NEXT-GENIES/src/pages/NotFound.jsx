import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import SEO from "../components/SEO";

function NotFound() {
  return (
    <>
      <SEO
        title="404 — Page Not Found"
        description="The page you are looking for does not exist or has been moved."
        canonicalPath="/404"
      />
      <Navbar />

      <main className="legal-page" style={{ minHeight: "65vh", display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <header className="legal-header" style={{ textAlign: "center", marginBottom: "32px" }}>
          <div className="legal-kicker">Error 404</div>
          <h1 className="legal-title">Lost in Digital Space?</h1>
          <p className="legal-updated" style={{ fontSize: "15px", maxWidth: "520px", margin: "12px auto 28px" }}>
            The page you are looking for doesn&apos;t exist, was removed, or had its URL changed.
          </p>
          <div style={{ display: "flex", gap: "14px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link className="btn-primary" to="/">
              Return Home
            </Link>
            <Link className="btn-secondary" to="/services">
              Explore Services &rarr;
            </Link>
          </div>
        </header>
      </main>

      <Footer />
    </>
  );
}

export default NotFound;
