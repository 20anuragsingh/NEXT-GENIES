import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import SEO from "../components/SEO";

function Home() {
  return (
    <>
      <SEO
        title="Digital Growth Agency — Content, Websites & Scaling"
        description="NextGenies is a digital growth agency helping ambitious brands scale with high-impact content creation, conversion-focused websites, branding, and socials."
        canonicalPath="/"
      />
      <Navbar />

      <main className="home-page">
        <section className="hero">
          <div className="hero-content">
            <div className="hero-badge">
              <span className="hero-dot" />
              Digital Growth Agency
            </div>

            <h1>
              We Turn Brands Into
              <span> Digital Powerhouses</span>
            </h1>

            <p>
              Content, Websites, Full Digital Growth &mdash; Built to Scale Your
              Business.
            </p>

            <div className="hero-btns">
              <Link className="btn-primary" to="/contact">
                Get Started
              </Link>

              <a className="btn-secondary" href="https://wa.me/919910880760" target="_blank" rel="noopener noreferrer">
                <svg className="wa-icon" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12.04 2.03A9.92 9.92 0 0 0 3.5 17.02L2.1 22l5.08-1.34a9.94 9.94 0 1 0 4.86-18.63Zm.01 1.79a8.15 8.15 0 0 1 6.9 12.48 8.1 8.1 0 0 1-10.96 2.55l-.36-.22-3.02.8.81-2.94-.24-.38A8.15 8.15 0 0 1 12.05 3.82Zm-3.49 4.1c-.18 0-.47.07-.72.34-.25.27-.94.92-.94 2.24 0 1.32.97 2.6 1.1 2.78.13.18 1.87 2.99 4.63 4.07 2.3.91 2.77.73 3.27.68.5-.05 1.62-.66 1.85-1.3.23-.64.23-1.18.16-1.3-.07-.11-.25-.18-.52-.31-.27-.13-1.62-.8-1.87-.89-.25-.09-.43-.13-.61.13-.18.27-.7.89-.86 1.07-.16.18-.32.2-.59.07-.27-.13-1.15-.42-2.19-1.35-.81-.72-1.36-1.61-1.52-1.88-.16-.27-.02-.41.12-.54.12-.12.27-.32.41-.48.13-.16.18-.27.27-.45.09-.18.04-.34-.02-.48-.07-.13-.61-1.47-.84-2.01-.22-.52-.44-.45-.61-.46h-.52Z" />
                </svg>
                WhatsApp Us
              </a>
            </div>
            <p className="home-cta-links">
              <Link className="home-link" to="/about">Our Story</Link>
              <Link className="home-link" to="/services">Our Services</Link>
              <Link className="home-link" to="/contact">Get In Touch</Link>
            </p>
            <div className="scroll-hint">
              <span className="scroll-line" />
              Scroll to explore
            </div>
          </div>

          <div className="hero-visual" aria-hidden="true">
            <div className="orbit orbit-one" />
            <div className="orbit orbit-two" />
            <div className="rocket-glow" />
            <div className="hero-core">
              <svg viewBox="0 0 24 24" focusable="false">
                <path d="M13.5 2.5 5.4 13h5.4l-.5 8.5L18.6 11h-5.5l.4-8.5Z" />
              </svg>
            </div>
          </div>
        </section>

        <section className="trust" aria-label="Agency highlights">
          <div className="trust-item">
            <div className="trust-icon">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="m5 12 4 4L19 6" />
              </svg>
            </div>
            <div>
              <div className="trust-label">Fast Execution</div>
              <div className="trust-sub">Delivered on time, every time</div>
            </div>
          </div>

          <div className="trust-item">
            <div className="trust-icon">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="12" cy="12" r="7" />
                <circle cx="12" cy="12" r="2" />
              </svg>
            </div>
            <div>
              <div className="trust-label">Result-Oriented</div>
              <div className="trust-sub">Metrics that matter</div>
            </div>
          </div>

          <div className="trust-item">
            <div className="trust-icon">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M4 16h4l3-8 3 12 2-6h4" />
              </svg>
            </div>
            <div>
              <div className="trust-label">Creative Strategy</div>
              <div className="trust-sub">Ideas built to convert</div>
            </div>
          </div>

          <div className="trust-item">
            <div className="trust-icon">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <rect x="5" y="7" width="14" height="10" rx="2" />
              </svg>
            </div>
            <div>
              <div className="trust-label">Modern Designs</div>
              <div className="trust-sub">Cutting-edge aesthetics</div>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="section-label">Why Us</div>
          <h2 className="section-title">
            Not Just Services. <span>Real Growth.</span>
          </h2>
          <p className="section-sub">
            We don't just create deliverables. We build digital systems that
            compound over time and drive measurable results.
          </p>

          <div className="cards-grid">
            <article className="glass-card">
              <div className="card-icon">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <rect x="7" y="4" width="10" height="16" rx="2" />
                  <path d="M10 8h4M10 12h4M10 16h3" />
                </svg>
              </div>
              <h3 className="card-title">Content That Converts</h3>
              <p className="card-desc">
                Strategic storytelling designed around modern attention spans.
                Every post, reel, and caption is engineered for engagement and
                action.
              </p>
              <span className="card-tag">High Engagement</span>
            </article>

            <article className="glass-card">
              <div className="card-icon">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <rect x="4" y="5" width="16" height="11" rx="2" />
                  <path d="M8 20h8M12 16v4" />
                </svg>
              </div>
              <h3 className="card-title">Websites That Sell</h3>
              <p className="card-desc">
                Performance-first websites built to convert visitors into
                customers. Minimal, fast, and optimized for every device and
                search engine.
              </p>
              <span className="card-tag">Conversion Focused</span>
            </article>

            <article className="glass-card">
              <div className="card-icon">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M6 7h4l2 3h6v9H6Z" />
                  <path d="M9 7V5h3" />
                </svg>
              </div>
              <h3 className="card-title">Complete Digital Handling</h3>
              <p className="card-desc">
                From strategy to execution, we manage your entire digital
                presence so you can focus on running your business, not your
                socials.
              </p>
              <span className="card-tag">Full Service</span>
            </article>
          </div>
        </section>

        <div className="section-divider" />

        <section className="section">
          <div className="section-label">What We Do</div>
          <h2 className="section-title">
            Our <span>Core Services</span>
          </h2>
          <p className="section-sub">
            A suite of digital services built for modern brands that want to
            grow fast and stand out.
          </p>

          <div className="services-grid">
            <article className="svc-card">
              <div className="svc-num">01</div>
              <div className="svc-content">
                <h3 className="svc-title">Content Creation</h3>
                <p className="svc-desc">
                  Reels, carousels, captions, and campaigns that capture
                  attention and drive results across all platforms.
                </p>
                <Link to="/services" className="svc-link">Learn More &rarr;</Link>
              </div>
            </article>

            <article className="svc-card">
              <div className="svc-num">02</div>
              <div className="svc-content">
                <h3 className="svc-title">Website Development</h3>
                <p className="svc-desc">
                  Custom, high-performance websites designed to convert. From
                  landing pages to full product sites.
                </p>
                <Link to="/services" className="svc-link">Learn More &rarr;</Link>
              </div>
            </article>

            <article className="svc-card">
              <div className="svc-num">03</div>
              <div className="svc-content">
                <h3 className="svc-title">Social Media Management</h3>
                <p className="svc-desc">
                  We run your social presence from end to end: strategy,
                  posting, engagement, and growth analytics.
                </p>
                <Link to="/services" className="svc-link">Learn More &rarr;</Link>
              </div>
            </article>

            <article className="svc-card">
              <div className="svc-num">04</div>
              <div className="svc-content">
                <h3 className="svc-title">Branding</h3>
                <p className="svc-desc">
                  Logo, identity, visual language - everything you need to build
                  a brand that people recognize and trust.
                </p>
                <Link to="/services" className="svc-link">Learn More &rarr;</Link>
              </div>
            </article>
          </div>
        </section>

        <div className="section-divider" />

        <section className="section">
          <div className="section-label">Concept Work</div>
          <h2 className="section-title">
            What We Can <span>Build For You</span>
          </h2>
          <p className="section-sub">
            Sample projects showcasing what a NextGenies-powered digital
            presence looks like.
          </p>

          <div className="mockup-area">
            <div className="mockup-frame">
              <div className="mockup-top">
                <span className="mockup-dot" style={{ background: "#ef4444" }} />
                <span className="mockup-dot" style={{ background: "#f59e0b" }} />
                <span className="mockup-dot" style={{ background: "#22c55e" }} />
              </div>
              <div className="mockup-screen">
                <div className="mockup-line blue w80" />
                <div className="mockup-line w60" />
                <div className="mockup-line w80" />
                <div className="mockup-line w40" />
                <div className="mockup-actions">
                  <span />
                  <span />
                </div>
              </div>
              <div className="mockup-label">Website Mockup</div>
            </div>

            <div className="mockup-frame">
              <div className="mockup-top">
                <span className="mockup-pill" />
              </div>
              <div className="mockup-screen mockup-grid-screen">
                <div />
                <div />
                <div />
                <div />
              </div>
              <div className="mockup-label">Social Media Feed</div>
            </div>

            <div className="mockup-frame">
              <div className="mockup-top mockup-top-center">Reel Thumbnail</div>
              <div className="mockup-screen mockup-reel-screen">
                <div className="mockup-phone">
                  <span />
                  <span />
                </div>
              </div>
              <div className="mockup-label">Reel Thumbnail</div>
            </div>
          </div>

          <p className="mockup-note">
            All visuals are sample/concept work for illustration purposes.
          </p>
        </section>

        <div className="section-divider" />

        <section className="section">
          <div className="section-label">Our Edge</div>
          <h2 className="section-title">
            Why <span>NextGenies?</span>
          </h2>
          <p className="section-sub">
            We're not another agency running templates. We think differently
            about digital growth.
          </p>

          <div className="why-grid">
            <article className="why-item">
              <span className="why-bullet" />
              <div>
                <div className="why-text">
                  We focus on results, not just aesthetics
                </div>
                <div className="why-sub">
                  Every design decision is backed by performance, data, and
                  user psychology.
                </div>
              </div>
            </article>

            <article className="why-item">
              <span className="why-bullet" />
              <div>
                <div className="why-text">
                  We understand modern attention spans
                </div>
                <div className="why-sub">
                  Content built for modern audiences - fast, punchy, and
                  algorithmically sharp.
                </div>
              </div>
            </article>

            <article className="why-item">
              <span className="why-bullet" />
              <div>
                <div className="why-text">
                  We build systems, not just content
                </div>
                <div className="why-sub">
                  Your digital presence is a machine. We engineer it to run,
                  scale, and compound.
                </div>
              </div>
            </article>

            <article className="why-item">
              <span className="why-bullet" />
              <div>
                <div className="why-text">
                  We speak founder, not agency jargon
                </div>
                <div className="why-sub">
                  Clear communication, honest timelines, and no fluff in our
                  reporting.
                </div>
              </div>
            </article>
          </div>
        </section>

        <section className="cta-section">
          <div className="section-label">Let's Build Together</div>
          <h2>Ready to Scale Your Brand?</h2>
          <p>
            Stop leaving growth on the table. Let's talk about what NextGenies
            can do for your business.
          </p>
          <div className="cta-btns">
            <Link className="btn-primary" to="/contact">
              Book a Call
            </Link>
            <Link className="btn-secondary" to="/contact">
              Get Started &rarr;
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

export default Home;
