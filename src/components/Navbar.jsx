import { useEffect, useState } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import { useTheme } from "../hooks/useTheme";

const LINKS = [
  { to: "/", label: "Home", end: true },
  { to: "/services", label: "Services" },
  { to: "/about", label: "About" },
  { to: "/blogs", label: "Blogs" },
  { to: "/contact", label: "Contact" },
];

function Logo() {
  return (
    <span className="brand-mark" aria-hidden="true">
      <img src="/ng-logo-transparent.png" alt="" width="30" height="30" />
    </span>
  );
}

export default function Navbar() {
  const { pathname } = useLocation();
  const [openAt, setOpenAt] = useState(null);
  const open = openAt === pathname; // closes automatically when the route changes
  const setOpen = (v) => setOpenAt((cur) => ((typeof v === "function" ? v(cur === pathname) : v) ? pathname : null));
  const [scrolled, setScrolled] = useState(false);
  const { isDark, toggle } = useTheme();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setOpenAt(null);
    document.addEventListener("keydown", onKey);
    document.body.classList.add("no-scroll");
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.classList.remove("no-scroll");
    };
  }, [open]);

  return (
    <header className={`nav-shell${scrolled ? " is-scrolled" : ""}${open ? " is-open" : ""}`}>
      <nav className="nav glass" aria-label="Primary">
        <Link to="/" className="nav-brand" aria-label="NextGenies home">
          <Logo />
          <span>NextGenies</span>
        </Link>

        <ul className="nav-links" id="primary-nav">
          {LINKS.map((l) => (
            <li key={l.to}>
              <NavLink to={l.to} end={l.end} className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}>
                {l.label}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="nav-actions">
          <button
            type="button"
            className="icon-btn neu-btn"
            onClick={toggle}
            aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
            title={`Switch to ${isDark ? "light" : "dark"} mode`}
          >
            {isDark ? (
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
              </svg>
            )}
          </button>
          <Link to="/contact" className="btn btn-primary nav-cta">
            Get started <span aria-hidden="true">→</span>
          </Link>
          <button
            type="button"
            className="icon-btn neu-btn nav-toggle"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            <span className="burger" aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
          </button>
        </div>
      </nav>

      <div className="mobile-nav glass" id="mobile-nav" hidden={!open}>
        {LINKS.map((l, i) => (
          <NavLink
            key={l.to}
            to={l.to}
            end={l.end}
            className={({ isActive }) => `mobile-link${isActive ? " active" : ""}`}
            style={{ "--i": i }}
          >
            {l.label}
          </NavLink>
        ))}
        <Link to="/contact" className="btn btn-primary mobile-cta">
          Start a project →
        </Link>
      </div>
      {open && <button className="nav-scrim" aria-label="Close menu" onClick={() => setOpen(false)} />}
    </header>
  );
}
