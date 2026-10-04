import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import BrandMark from "./BrandMark";

function Navbar() {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
      if (window.scrollY > 20 && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [location.pathname, isMenuOpen]);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className={`nav-wrapper${isScrolled ? " is-scrolled" : ""}`}>
      <nav
        className={`nav${isScrolled ? " nav-scrolled" : ""}${isMenuOpen ? " menu-open" : ""}`}
        aria-label="Primary Navigation"
      >
      <Link className="nav-logo" to="/" onClick={closeMenu} aria-label="NextGenies home">
        <BrandMark />
        <span className="nav-brand-name">NextGenies</span>
      </Link>

      <div className="nav-links" id="primary-navigation">
        <Link
          className={location.pathname === "/" ? "active" : ""}
          to="/"
          onClick={closeMenu}
          aria-current={location.pathname === "/" ? "page" : undefined}
        >
          Home
        </Link>

        <Link
          className={location.pathname === "/services" ? "active" : ""}
          to="/services"
          onClick={closeMenu}
          aria-current={location.pathname === "/services" ? "page" : undefined}
        >
          Services
        </Link>

        <Link
          className={location.pathname === "/about" ? "active" : ""}
          to="/about"
          onClick={closeMenu}
          aria-current={location.pathname === "/about" ? "page" : undefined}
        >
          About
        </Link>

        <Link
          className={location.pathname === "/contact" ? "active" : ""}
          to="/contact"
          onClick={closeMenu}
          aria-current={location.pathname === "/contact" ? "page" : undefined}
        >
          Contact
        </Link>
      </div>

      <Link className="nav-cta" to="/contact" onClick={closeMenu}>
        Get Started
        <span aria-hidden="true">&rarr;</span>
      </Link>

      <button
        className="nav-menu-toggle"
        type="button"
        aria-expanded={isMenuOpen}
        aria-controls="primary-navigation"
        aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
        onClick={() => setIsMenuOpen((isOpen) => !isOpen)}
      >
        <span />
        <span />
      </button>
      </nav>
    </header>
  );
}

export default Navbar;
