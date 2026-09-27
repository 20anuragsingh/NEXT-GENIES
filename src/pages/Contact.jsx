import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import SEO from "../components/SEO";

function Contact() {
  const [status, setStatus] = useState({ type: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const apiBaseUrl = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

  async function handleSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    setIsSubmitting(true);
    setStatus({ type: "", message: "" });

    try {
      const response = await fetch(`${apiBaseUrl}/api/contacts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(formData)),
      });

      let data = {};
      try {
        data = await response.json();
      } catch {
        // Response body was not JSON
      }

      if (!response.ok) {
        throw new Error(data.message || `Request failed with status ${response.status}`);
      }

      form.reset();
      setStatus({ type: "success", message: "Thanks! We'll get back to you shortly." });
    } catch (error) {
      setStatus({ type: "error", message: error.message || "Unable to send your message. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <SEO
        title="Contact NextGenies — Let's Build Your Digital Presence"
        description="Ready to scale your brand? Send us a message or chat on WhatsApp with NextGenies for bespoke content, website development, branding, and digital growth."
        canonicalPath="/contact"
      />
      <Navbar />

      <main className="contact-page">
        <header className="contact-heading">
          <h1 className="contact-form-title">Send Us a Message</h1>
        </header>

        <section className="contact-grid">
          <form className="contact-form-card" onSubmit={handleSubmit}>
            <label className="form-label" htmlFor="fullName">
              Full Name
            </label>
            <input
              className="form-input"
              id="fullName"
              name="fullName"
              placeholder="Your name"
              type="text"
              required
            />

            <label className="form-label" htmlFor="email">
              Email Address
            </label>
            <input
              className="form-input"
              id="email"
              name="email"
              placeholder="you@gmail.com"
              type="email"
              required
            />

            <label className="form-label" htmlFor="phone">
              Phone Number
            </label>
            <input
              className="form-input"
              id="phone"
              name="phone"
              placeholder="+91 99108 80760"
              type="tel"
              required
            />

            <label className="form-label" htmlFor="service">
              What Are You Looking For?
            </label>
            <select className="form-input" id="service" name="service" defaultValue="Content Creation" required>
              <option>Content Creation</option>
              <option>Website Development</option>
              <option>Social Media Management</option>
              <option>Branding</option>
              <option>Complete Digital Growth</option>
              <option>Digital Marketing</option>
            </select>

            <label className="form-label" htmlFor="message">
              Message
            </label>
            <textarea
              className="form-input form-textarea"
              id="message"
              name="message"
              placeholder="Tell us about your brand, your goals, and your timeline..."
              required
            />

            <button className="form-submit" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Sending..." : "Send Message →"}
            </button>
            {status.message && (
              <p
                role="status"
                aria-live="polite"
                className={`form-status ${status.type === "error" ? "form-error" : "form-success"}`}
              >
                {status.message}
              </p>
            )}
          </form>

          <aside className="contact-info">
            <p className="contact-response">
              We typically respond within <strong>24 hours.</strong> For urgent
              queries, reach us directly on WhatsApp.
            </p>

            <a className="wa-cta" href="https://wa.me/919910880760" target="_blank" rel="noopener noreferrer">
              <span className="wa-circle">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12.04 2.03A9.92 9.92 0 0 0 3.5 17.02L2.1 22l5.08-1.34a9.94 9.94 0 1 0 4.86-18.63Zm.01 1.79a8.15 8.15 0 0 1 6.9 12.48 8.1 8.1 0 0 1-10.96 2.55l-.36-.22-3.02.8.81-2.94-.24-.38A8.15 8.15 0 0 1 12.05 3.82Zm-3.49 4.1c-.18 0-.47.07-.72.34-.25.27-.94.92-.94 2.24 0 1.32.97 2.6 1.1 2.78.13.18 1.87 2.99 4.63 4.07 2.3.91 2.77.73 3.27.68.5-.05 1.62-.66 1.85-1.3.23-.64.23-1.18.16-1.3-.07-.11-.25-.18-.52-.31-.27-.13-1.62-.8-1.87-.89-.25-.09-.43-.13-.61.13-.18.27-.7.89-.86 1.07-.16.18-.32.2-.59.07-.27-.13-1.15-.42-2.19-1.35-.81-.72-1.36-1.61-1.52-1.88-.16-.27-.02-.41.12-.54.12-.12.27-.32.41-.48.13-.16.18-.27.27-.45.09-.18.04-.34-.02-.48-.07-.13-.61-1.47-.84-2.01-.22-.52-.44-.45-.61-.46h-.52Z" />
                </svg>
              </span>
              <span>
                <span className="wa-label">Chat on WhatsApp</span>
                <span className="wa-sub">
                  +91 99108 80760 · Typically replies in minutes
                </span>
              </span>
            </a>

            <div className="contact-block">
              <div className="contact-block-title">Phone</div>
              <a className="contact-block-val" href="tel:+919910880760" style={{ textDecoration: "none", color: "inherit", display: "inline-block" }}>
                +91 99108 80760
              </a>
            </div>

            <div className="contact-block">
              <div className="contact-block-title">Email</div>
              <a className="contact-block-val" href="mailto:nextgenies.team@gmail.com" style={{ textDecoration: "none", color: "inherit", display: "inline-block" }}>
                nextgenies.team@gmail.com
              </a>
            </div>

            <div className="contact-block">
              <div className="contact-block-title">Location</div>
              <div className="contact-block-val">
                India — Remote-First. We work with brands globally.
              </div>
            </div>

            <div className="contact-block">
              <div className="contact-block-title">Working Hours</div>
              <div className="contact-block-val">Mon-Sat, 10am-8pm IST</div>
            </div>

            <div className="contact-block contact-help-card">
              <div className="contact-block-title">Not sure what you need?</div>
              <p className="contact-block-val">
                Book a free 20-minute discovery call. We'll understand your
                business and suggest what would actually move the needle.
              </p>
              <a className="contact-call-btn" href="https://wa.me/919910880760" target="_blank" rel="noopener noreferrer">
                Book Free Call
              </a>
            </div>
          </aside>
        </section>
      </main>

      <Footer />
    </>
  );
}

export default Contact;
