import { Link } from "react-router-dom";
import SEO from "../components/SEO";

export default function NotFound() {
  return (
    <>
      <SEO title="404 — Page not found" description="The page you are looking for does not exist or has been moved." path="/404" robots="noindex, follow" />
      <main className="container page-top center-text nf">
        <div className="nf-num" aria-hidden="true">404</div>
        <h1 className="h2">Lost in digital space?</h1>
        <p className="lead">This page doesn't exist, was removed, or its URL changed.</p>
        <div className="btn-row center">
          <Link className="btn btn-primary" to="/">Return home</Link>
          <Link className="btn btn-neu" to="/services">Explore services</Link>
        </div>
      </main>
    </>
  );
}
