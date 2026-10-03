import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import SEO from "../components/SEO";

function TermsAndConditions() {
  return (
    <>
      <SEO
        title="Terms & Conditions"
        description="Review the terms of service and client engagement standards governing digital marketing, content, website design, and branding at NextGenies."
        canonicalPath="/terms-and-conditions"
      />
      <Navbar />

      <main className="legal-page">
        <header className="legal-header">
          <div className="legal-kicker">Terms of Service</div>
          <h1 className="legal-title">Terms &amp; Conditions</h1>
          <p className="legal-updated">Last Updated: September 2026</p>
        </header>

        <div className="legal-content">
          <section className="legal-section">
            <h2>1. Agreement to Terms</h2>
            <p>
              These Terms &amp; Conditions (&ldquo;Terms&rdquo;) govern your access to and use of the NextGenies website located at nextgenies.com (&ldquo;Site&rdquo;) and your engagement with NextGenies (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;) for digital growth, creative, and development services.
            </p>
            <p>
              By accessing our Site or communicating with our team, you agree to be bound by these Terms and our <Link to="/privacy-policy">Privacy Policy</Link>. If you do not agree with any part of these Terms, please do not use our Site.
            </p>
          </section>

          <section className="legal-section">
            <h2>2. Scope of Services</h2>
            <p>
              NextGenies is a digital agency offering tailored creative, technical, and marketing solutions, including:
            </p>
            <ul>
              <li><strong>Content Creation:</strong> Reels, carousels, video production, copywriting, and visual assets.</li>
              <li><strong>Website Development:</strong> Custom website design, frontend engineering, landing pages, and maintenance.</li>
              <li><strong>Social Media Management:</strong> Strategy, content distribution, community engagement, and analytics.</li>
              <li><strong>Branding:</strong> Brand identity, logo design, visual systems, and brand positioning guidelines.</li>
            </ul>
            <p>
              Detailed deliverables, project milestones, payment schedules, and performance targets are specified in individualized service proposals or client agreements executed between NextGenies and each client.
            </p>
          </section>

          <section className="legal-section">
            <h2>3. Website Usage &amp; Conduct</h2>
            <p>You agree to use our Site only for lawful purposes. You agree not to:</p>
            <ul>
              <li>Submit fraudulent, inaccurate, or misleading information through our contact forms.</li>
              <li>Attempt to compromise, probe, or breach the security of our hosting infrastructure or backend APIs.</li>
              <li>Use automated scripts, scrapers, or bots to harvest content or data from our Site without explicit written authorization.</li>
              <li>Interfere with the normal operation, speed, or availability of our Site.</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>4. Intellectual Property Rights</h2>
            <h3>Our Intellectual Property</h3>
            <p>
              All materials on this Site, including website design, code, graphics, logos, text, animations, and branding elements, are the intellectual property of NextGenies or its licensors and are protected by applicable intellectual property laws.
            </p>
            <h3>Client Deliverables &amp; Assets</h3>
            <p>
              Client materials, trademarks, and source assets provided to us for project execution remain the sole property of the client. Rights to bespoke client deliverables created by NextGenies transfer to the client upon full receipt of agreed contract payments, subject to the terms of the individual client agreement.
            </p>
          </section>

          <section className="legal-section">
            <h2>5. Payments, Fees &amp; Cancellation</h2>
            <p>
              Our public website does not process ecommerce checkouts. Commercial terms, project invoices, payment milestones, and refund/cancellation conditions are governed by the bespoke service agreement signed for each client project:
            </p>
            <ul>
              <li><strong>Invoicing:</strong> Client invoices are issued as milestone-based or retainer-based payments via direct bank transfer or approved payment gateways.</li>
              <li><strong>Cancellations:</strong> Cancellation terms and notice periods are detailed in the respective service contracts. Work completed up to the date of cancellation is billable.</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>6. Performance &amp; Marketing Disclaimers</h2>
            <p>
              While NextGenies applies proven creative strategies, performance data, and modern design principles, digital marketing results, algorithm distribution, search engine rankings, and social platform reach are inherently influenced by external factors beyond our control.
            </p>
            <p>
              Past case studies, showcase numbers, or average growth metrics displayed on this Site reflect specific client engagements or concept work and do not constitute an explicit warranty of future earnings or performance. Please review our <Link to="/disclaimer">Disclaimer</Link> for additional details.
            </p>
          </section>

          <section className="legal-section">
            <h2>7. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, NextGenies, its team, and contractors shall not be liable for any indirect, consequential, punitive, or special damages arising out of or related to your use of this Site or external links.
            </p>
          </section>

          <section className="legal-section">
            <h2>8. Governing Law</h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law principles. Any dispute arising out of or related to these Terms shall be subject to the exclusive jurisdiction of the competent courts in India.
            </p>
          </section>

          <section className="legal-section">
            <h2>9. Contact Information</h2>
            <p>
              For inquiries, notices, or clarifications regarding these Terms &amp; Conditions, please contact us at:
            </p>
            <ul>
              <li><strong>Agency Name:</strong> NextGenies</li>
              <li><strong>Email:</strong> <a href="mailto:nextgenies.team@gmail.com">nextgenies.team@gmail.com</a></li>
              <li><strong>Phone:</strong> +91 99108 80760</li>
            </ul>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}

export default TermsAndConditions;
