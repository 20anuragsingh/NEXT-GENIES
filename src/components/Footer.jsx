import { Link } from "react-router-dom";
import { CONTACT } from "../lib/site";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-card neu-raised">
        <div className="footer-grid">
          <div className="footer-about">
            <div className="footer-logo">
              <img src="/ng-logo-transparent.png" alt="" width="28" height="28" />
              NextGenies
            </div>
            <p>We turn brands into digital powerhouses. Content, websites, and full digital growth, built to scale.</p>
          </div>

          <nav aria-label="Pages">
            <h2 className="footer-title">Pages</h2>
            <Link to="/">Home</Link>
            <Link to="/services">Services</Link>
            <Link to="/about">About</Link>
            <Link to="/blogs">Blogs</Link>
            <Link to="/contact">Contact</Link>
          </nav>

          <nav aria-label="Legal">
            <h2 className="footer-title">Legal</h2>
            <Link to="/privacy-policy">Privacy Policy</Link>
            <Link to="/terms-and-conditions">Terms &amp; Conditions</Link>
            <Link to="/cookie-policy">Cookie Policy</Link>
            <Link to="/disclaimer">Disclaimer</Link>
          </nav>

          <div>
            <h2 className="footer-title">Contact</h2>
            <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
            <a href={`tel:${CONTACT.phone.replace(/\s/g, "")}`}>{CONTACT.phone}</a>
            <span>India - Remote-first</span>
            <span>Mon - Sat, 10AM - 8PM IST</span>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} NextGenies. All rights reserved.</span>
          <span className="pill">Digital Growth Agency</span>
        </div>
      </div>
    </footer>
  );
}
