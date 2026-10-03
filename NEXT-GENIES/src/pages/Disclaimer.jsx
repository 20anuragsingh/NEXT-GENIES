import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import SEO from "../components/SEO";

function Disclaimer() {
  return (
    <>
      <SEO
        title="Disclaimer"
        description="Important information regarding NextGenies digital marketing results, past performance metrics, concept work illustrations, and external links."
        canonicalPath="/disclaimer"
      />
      <Navbar />

      <main className="legal-page">
        <header className="legal-header">
          <div className="legal-kicker">Important Notice</div>
          <h1 className="legal-title">Disclaimer</h1>
          <p className="legal-updated">Last Updated: September 2026</p>
        </header>

        <div className="legal-content">
          <section className="legal-section">
            <h2>1. General Information</h2>
            <p>
              The information provided by NextGenies on nextgenies.com is for general informational and agency marketing purposes only. While we endeavor to keep all information up to date and correct, we make no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, or availability with respect to the website or the information, services, or related graphics contained on the website.
            </p>
          </section>

          <section className="legal-section">
            <h2>2. Digital Marketing &amp; Business Growth Results</h2>
            <p>
              References to past results, growth statistics (such as &ldquo;3x Avg. Growth Delivered&rdquo; or &ldquo;50+ Clients Served&rdquo;), testimonials, or case demonstrations reflect specific past engagements and historical performance.
            </p>
            <p>
              Digital marketing performance, content virality, organic search rankings, and advertising ROI depend on multiple external factors outside our control, including client budget, market competitiveness, algorithm updates by third-party platforms (such as Google, Instagram, Meta, and YouTube), and client responsiveness.
            </p>
            <p>
              <strong>NextGenies does not guarantee specific revenue, sales volume, or guaranteed follower counts.</strong> Every business is unique, and results compound over time through strategic execution and market factors.
            </p>
          </section>

          <section className="legal-section">
            <h2>3. Concept Work &amp; Visual Illustrations</h2>
            <p>
              Screenshots, mockup frames, UI mockups, and reel thumbnails labeled as &ldquo;Concept Work&rdquo; or &ldquo;Sample Work&rdquo; on this website are designed for creative illustration purposes to demonstrate the design standards, technical capabilities, and aesthetic direction delivered by our team.
            </p>
          </section>

          <section className="legal-section">
            <h2>4. Third-Party Links &amp; Platforms</h2>
            <p>
              Our website contains links to external platforms, including Instagram, Facebook, YouTube, and WhatsApp. NextGenies has no control over the nature, content, privacy policies, or availability of those sites. The inclusion of any links does not necessarily imply a recommendation or endorse the views expressed within them.
            </p>
          </section>

          <section className="legal-section">
            <h2>5. Contact Us</h2>
            <p>
              If you require any more information or have any questions about our site&rsquo;s disclaimer, please feel free to contact us:
            </p>
            <ul>
              <li><strong>Email:</strong> <a href="mailto:nextgenies.team@gmail.com">nextgenies.team@gmail.com</a></li>
              <li><strong>Phone:</strong> +91 99108 80760</li>
              <li><strong>Contact Page:</strong> <Link to="/contact">Get in Touch</Link></li>
            </ul>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}

export default Disclaimer;
