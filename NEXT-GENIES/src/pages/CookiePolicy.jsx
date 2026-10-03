import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import SEO from "../components/SEO";

function CookiePolicy() {
  return (
    <>
      <SEO
        title="Cookie Policy"
        description="Understand how NextGenies uses essential functional cookies and how you can manage or disable cookie preferences in your browser."
        canonicalPath="/cookie-policy"
      />
      <Navbar />

      <main className="legal-page">
        <header className="legal-header">
          <div className="legal-kicker">Cookie Information</div>
          <h1 className="legal-title">Cookie Policy</h1>
          <p className="legal-updated">Last Updated: September 2026</p>
        </header>

        <div className="legal-content">
          <section className="legal-section">
            <h2>1. What Are Cookies?</h2>
            <p>
              Cookies are small text files placed on your computer, tablet, or mobile device by websites that you visit. They are widely used to make websites function properly, enhance user browsing experience, and provide aggregated reporting information to website operators.
            </p>
          </section>

          <section className="legal-section">
            <h2>2. How NextGenies Uses Cookies</h2>
            <p>
              NextGenies is committed to privacy-first web practices. We do not use third-party behavioral advertising cookies, data broker trackers, or invasive cross-site tracking technologies.
            </p>
            <p>Cookies and local storage mechanisms on our website are used for:</p>
            <ul>
              <li><strong>Strictly Necessary Functions:</strong> Ensuring network routing, form submission security, and preventing cross-site request forgery.</li>
              <li><strong>Functional Preferences:</strong> Remembering user interface settings or responsive state during your browsing session.</li>
              <li><strong>Performance &amp; Reliability:</strong> Standard server logs that monitor page load times and identify technical server errors.</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>3. Types of Cookies We May Use</h2>
            <h3>Essential / Necessary Cookies</h3>
            <p>
              These cookies are vital for the proper operation of our website. Without them, core functions such as submitting the contact form or navigating between pages securely may be degraded. Because these cookies are strictly necessary to deliver the website, they cannot be disabled in our systems.
            </p>

            <h3>Performance &amp; Analytics Cookies</h3>
            <p>
              If enabled, these allow us to understand aggregated visitor trends (such as which service pages receive interest) so we can optimize website speed and content relevance. These statistics are strictly aggregated and anonymized; they do not identify individual users.
            </p>
          </section>

          <section className="legal-section">
            <h2>4. Managing and Disabling Cookies</h2>
            <p>
              You have the right to accept or decline cookies. Most web browsers automatically accept cookies by default, but you can usually modify your browser settings to decline cookies or alert you when a cookie is being placed on your device.
            </p>
            <p>You can manage cookie settings in common browsers using the following links:</p>
            <ul>
              <li><strong>Google Chrome:</strong> Settings &gt; Privacy and Security &gt; Cookies and other site data</li>
              <li><strong>Mozilla Firefox:</strong> Settings &gt; Privacy &amp; Security &gt; Cookies and Site Data</li>
              <li><strong>Apple Safari:</strong> Preferences &gt; Privacy &gt; Block all cookies</li>
              <li><strong>Microsoft Edge:</strong> Settings &gt; Cookies and site permissions &gt; Manage and delete cookies</li>
            </ul>
            <p>
              Please note that disabling certain cookies may impact your user experience or prevent certain features of our site from functioning as intended.
            </p>
          </section>

          <section className="legal-section">
            <h2>5. Contact Us</h2>
            <p>
              If you have any questions about our use of cookies or this Cookie Policy, please contact our team:
            </p>
            <ul>
              <li><strong>Email:</strong> <a href="mailto:nextgenies.team@gmail.com">nextgenies.team@gmail.com</a></li>
              <li><strong>Website:</strong> <Link to="/">nextgenies.com</Link></li>
            </ul>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}

export default CookiePolicy;
