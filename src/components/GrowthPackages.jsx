import { Link } from "react-router-dom";
import Reveal from "./Reveal";

const TIERS = [
  {
    tier: "Sprint 01",
    name: "Foundation & Launch",
    idealFor: "Ambitious businesses needing a high-converting digital storefront & identity.",
    highlight: "14-Day Delivery",
    deliverables: [
      "Custom React 19 website & mobile-first architecture",
      "Conversion-rate optimized landing page structure",
      "Full visual identity (logos, palettes, typography)",
      "Technical SEO & Open Graph social metadata setup",
      "Google Analytics 4 & conversion event tracking",
    ],
    cta: "Book Foundation Sprint →",
  },
  {
    tier: "Sprint 02",
    name: "Content & Social Engine",
    popular: true,
    idealFor: "Brands looking to stop the scroll and build a loyal, active community.",
    highlight: "Monthly Retainer",
    deliverables: [
      "20+ platform-native short-form reels & carousels",
      "Viral hook scripting and high-retention editing",
      "End-to-end publishing, scheduling & community management",
      "Bi-weekly performance & retention analytics review",
      "Dedicated creative strategist and editor",
    ],
    cta: "Launch Content Engine →",
  },
  {
    tier: "Sprint 03",
    name: "Full-Stack Growth Partner",
    idealFor: "Growing businesses that want one team for their website, content and marketing.",
    highlight: "Comprehensive Retainer",
    deliverables: [
      "Everything in Content Engine + Website support",
      "Weekly website and enquiry improvement",
      "Paid ads and creative for Meta and Google",
      "Email and WhatsApp follow-ups",
      "Direct access to the people doing the work",
    ],
    cta: "Apply For Growth Partnership →",
  },
];

export default function GrowthPackages() {
  return (
    <section className="container section" aria-label="Structured Growth Sprint Packages">
      <Reveal className="section-head">
        <span className="eyebrow">Engagement Models</span>
        <h2 className="h2">Transparent sprint models. Zero fluff.</h2>
        <p className="lead">
          Predictable milestones, dedicated timelines, and guaranteed deliverables. Choose the growth pace that matches your ambition.
        </p>
      </Reveal>

      <div className="grid-3 packages-grid">
        {TIERS.map((t, idx) => (
          <Reveal
            key={t.name}
            delay={idx * 80}
            className={`pkg-card neu-raised hover-lift${t.popular ? " pkg-popular" : ""}`}
          >
            {t.popular && <span className="pkg-badge">Most Popular</span>}
            <div className="pkg-top">
              <span className="pill">{t.tier}</span>
              <span className="pkg-highlight">{t.highlight}</span>
            </div>
            <h3 className="h3 pkg-title">{t.name}</h3>
            <p className="muted pkg-desc">{t.idealFor}</p>

            <div className="pkg-divider" />

            <ul className="pkg-list">
              {t.deliverables.map((item) => (
                <li key={item}>
                  <svg viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="m3.25 8.25 2.7 2.7 5-5.7" />
                  </svg>
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <Link to="/contact" className={`btn ${t.popular ? "btn-primary" : "btn-neu"} pkg-cta`}>
              {t.cta}
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
