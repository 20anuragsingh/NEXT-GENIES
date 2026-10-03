import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import SEO from "../components/SEO";

function PrivacyPolicy() {
  return (
    <>
      <SEO
        title="Privacy Policy"
        description="Read the NextGenies Privacy Policy to learn how we collect, protect, and handle your contact information with complete transparency."
        canonicalPath="/privacy-policy"
      />
      <Navbar />

      <main className="legal-page">
        <header className="legal-header">
          <div className="legal-kicker">Trust & Transparency</div>
          <h1 className="legal-title">Privacy Policy</h1>
          <p className="legal-updated">Last Updated: September 2026</p>
        </header>

        <div className="legal-content">
          <section className="legal-section">
            <h2>1. Introduction</h2>
            <p>
              NextGenies (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;) operates as a digital growth and creative agency providing website development, content creation, branding, and digital marketing services. We are dedicated to respecting your privacy and safeguarding any personal information you share with us through our website.
            </p>
            <p>
              This Privacy Policy explains what information we collect, how we use it, how it is stored and protected, and your rights regarding your personal information when visiting nextgenies.com.
            </p>
          </section>

          <section className="legal-section">
            <h2>2. Information We Collect</h2>
            <h3>Information You Voluntarily Provide</h3>
            <p>
              When you submit an inquiry through our contact form, request a discovery call, or reach out to us via email or WhatsApp, we collect the information you provide, including:
            </p>
            <ul>
              <li><strong>Full Name:</strong> To address you and personalize communications.</li>
              <li><strong>Email Address:</strong> To respond to your project inquiries and send proposals.</li>
              <li><strong>Phone Number:</strong> To connect directly regarding your requirements or project updates.</li>
              <li><strong>Service of Interest:</strong> To route your inquiry to the relevant team.</li>
              <li><strong>Project Message:</strong> Any brand details, goals, or notes you submit.</li>
            </ul>

            <h3>Information Automatically Collected</h3>
            <p>
              Like most websites, when you navigate our site, standard technical information may be automatically logged by our web hosting infrastructure, such as your IP address, browser type, operating system, and access timestamps. This technical information is used exclusively for website security, diagnostic troubleshooting, and server performance monitoring.
            </p>
            <p>
              <strong>We do not collect sensitive personal data</strong>, payment card details, or government identification on this website. Agency services are invoiced directly via formal client agreements.
            </p>
          </section>

          <section className="legal-section">
            <h2>3. How We Use Your Information</h2>
            <p>We use the personal information collected solely for legitimate business purposes:</p>
            <ul>
              <li>To evaluate and respond to your inquiries, project requests, and consultation calls.</li>
              <li>To prepare service scopes, timeline estimates, and customized digital proposals.</li>
              <li>To communicate with you regarding active or upcoming projects.</li>
              <li>To maintain website security, prevent spam submissions, and diagnose technical issues.</li>
            </ul>
            <p>
              <strong>We do not sell, rent, or trade your personal information</strong> to third parties for advertising or commercial marketing purposes.
            </p>
          </section>

          <section className="legal-section">
            <h2>4. Third-Party Services & Data Sharing</h2>
            <p>
              We only share information with trusted third-party service providers who assist us in operating our website and delivering client communication:
            </p>
            <ul>
              <li><strong>Hosting & Database Infrastructure:</strong> Secure hosting servers for website operation and inquiry storage.</li>
              <li><strong>Email Delivery (SMTP):</strong> Secure transactional email systems to notify our team of incoming project inquiries and send you receipt confirmations.</li>
              <li><strong>Communication Platforms:</strong> WhatsApp (Meta) when you choose to initiate a chat with us directly through our website WhatsApp links.</li>
            </ul>
            <p>
              All providers are obligated to maintain the confidentiality and security of your information in compliance with relevant data privacy laws.
            </p>
          </section>

          <section className="legal-section">
            <h2>5. Cookies & Tracking Technologies</h2>
            <p>
              Our website uses only essential functional cookies necessary for core site navigation, responsive display, and security. We do not use third-party behavioral advertising cookies or cross-site tracking pixels.
            </p>
            <p>
              For more details on how cookies are handled, please review our <Link to="/cookie-policy">Cookie Policy</Link>.
            </p>
          </section>

          <section className="legal-section">
            <h2>6. Data Security & Storage</h2>
            <p>
              We implement industry-standard technical, administrative, and physical security measures to safeguard your information against unauthorized access, loss, misuse, or alteration. All form data transmission is protected using SSL/TLS encryption.
            </p>
            <p>
              We retain personal information only for as long as necessary to fulfill the communication, project delivery, or legal requirements for which it was collected.
            </p>
          </section>

          <section className="legal-section">
            <h2>7. Your Privacy Rights</h2>
            <p>
              Depending on your jurisdiction, you have the right to request access to the personal data we hold about you, request corrections to inaccurate information, or request deletion of your contact records from our inquiry database.
            </p>
            <p>
              To exercise any of these rights, please reach out to us at <a href="mailto:nextgenies.team@gmail.com">nextgenies.team@gmail.com</a>. We will respond promptly within standard business timelines.
            </p>
          </section>

          <section className="legal-section">
            <h2>8. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time to reflect changes in our legal obligations, operational practices, or service offerings. Any revisions will be posted on this page with an updated &ldquo;Last Updated&rdquo; date.
            </p>
          </section>

          <section className="legal-section">
            <h2>9. Contact Us</h2>
            <p>
              If you have any questions, concerns, or requests regarding this Privacy Policy or our data handling practices, please contact:
            </p>
            <ul>
              <li><strong>Agency Name:</strong> NextGenies</li>
              <li><strong>Contact Email:</strong> <a href="mailto:nextgenies.team@gmail.com">nextgenies.team@gmail.com</a></li>
              <li><strong>Phone / WhatsApp:</strong> +91 99108 80760</li>
              <li><strong>Location:</strong> India (Remote-First, Serving Brands Globally)</li>
            </ul>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}

export default PrivacyPolicy;
