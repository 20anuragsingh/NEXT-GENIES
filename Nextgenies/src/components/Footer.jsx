function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div>
          <div className="footer-logo">NextGenies</div>
          <p className="footer-tagline">
            We turn brands into digital powerhouses. Content, websites, and
            full digital growth - built to scale.
          </p>

          <div className="footer-socials">
            <a className="social-btn" href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7Zm5 4a4 4 0 1 1 0 8 4 4 0 0 1 0-8Zm0 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm5.2-3.3a1.1 1.1 0 1 1 0 2.2 1.1 1.1 0 0 1 0-2.2Z" />
              </svg>
            </a>

            <a className="social-btn" href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M14 8h3V4h-3c-3.3 0-5 2-5 5v3H6v4h3v6h4v-6h3l1-4h-4V9c0-.7.3-1 1-1Z" />
              </svg>
            </a>

            <a className="social-btn" href="https://youtube.com" target="_blank" rel="noreferrer" aria-label="YouTube">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M21.6 7.2a3 3 0 0 0-2.1-2.1C17.6 4.6 12 4.6 12 4.6s-5.6 0-7.5.5a3 3 0 0 0-2.1 2.1A31 31 0 0 0 2 12a31 31 0 0 0 .4 4.8 3 3 0 0 0 2.1 2.1c1.9.5 7.5.5 7.5.5s5.6 0 7.5-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 22 12a31 31 0 0 0-.4-4.8ZM10 15.4V8.6l6 3.4-6 3.4Z" />
              </svg>
            </a>
          </div>
        </div>

        <div>
          <div className="footer-col-title">Pages</div>
          <div className="footer-links">
            <a href="/">Home</a>
            <a href="/services">Services</a>
            <a href="/about">About</a>
            <a href="/contact">Contact</a>
          </div>
        </div>

        <div>
          <div className="footer-col-title">Services</div>
          <div className="footer-links">
            <a href="/services">Content Creation</a>
            <a href="/services">Website Development</a>
            <a href="/services">Social Media Mgmt</a>
            <a href="/services">Branding</a>
          </div>
        </div>

        <div>
          <div className="footer-col-title">Contact</div>
          <div className="footer-contact-item">hello@nextgenies.co</div>
          <div className="footer-contact-item">+91 98XXX XXXXX</div>
          <div className="footer-contact-item">India - Remote-First</div>
          <div className="footer-contact-item">Mon - Sat , 9AM - 6PM</div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-copy">
          &copy; 2025 NextGenies. All rights reserved.
        </div>

        <div className="footer-badge">
          Digital Growth Agency
        </div>
      </div>
    </footer>
  );
}

export default Footer;
