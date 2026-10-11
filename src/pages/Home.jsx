import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import SEO from "../components/SEO";
import Reveal from "../components/Reveal";
import Icon from "../components/Icon";
import { useCountUp, useReducedMotion, useReveal } from "../hooks/useReveal";
import { CONTACT, SITE_URL } from "../lib/site";
import { trackEvent } from "../lib/analytics";
import { metaFor } from "../seo/routes";
import genieArt from "../assets/main.png";
import TechStack from "../components/TechStack";
import AgencyComparison from "../components/AgencyComparison";

const WORDS = ["Content", "Websites", "Brands", "Growth"];

const ORBIT = [
  { label: "Content", icon: "video" },
  { label: "Websites", icon: "code" },
  { label: "Social", icon: "share" },
  { label: "Branding", icon: "sparkles" },
];

const WHY = [
  { icon: "zap", title: "Fast execution", text: "Lean sprints and clear timelines. Delivered when we say it will be." },
  { icon: "target", title: "Result-oriented", text: "Every deliverable is tied to a metric that matters to your business." },
  { icon: "compass", title: "Creative strategy", text: "Ideas built to convert, backed by data instead of guesswork." },
  { icon: "layers", title: "Modern design", text: "Clean, fast and memorable. Aesthetics that earn trust." },
];

const SERVICES = [
  { n: "01", title: "Content Creation", text: "Reels, carousels and copy that stop the scroll and drive action.", icon: "video" },
  { n: "02", title: "Website Development", text: "Fast, conversion-focused sites that turn visitors into customers.", icon: "code" },
  { n: "03", title: "Social Media", text: "Consistent, intentional presence that builds a real community.", icon: "share" },
  { n: "04", title: "Branding", text: "Identity systems that make your business instantly recognisable.", icon: "shield" },
];

const STEPS = [
  { n: "1", title: "Discover", text: "We learn your goals, audience and constraints." },
  { n: "2", title: "Design", text: "Strategy and concepts you can react to early." },
  { n: "3", title: "Build", text: "Focused sprints with transparent progress." },
  { n: "4", title: "Scale", text: "We measure, learn and compound the results." },
];

const CASE_STUDIES = [
  {
    client: "Aura Lifestyle",
    category: "Content & Social",
    headline: "+340% reach & viral short-form audience growth",
    metric: "1.4M+",
    metricLabel: "Reel impressions in 60 days",
    tags: ["Content Creation", "Reels", "Strategy"],
  },
  {
    client: "Kore Fintech",
    category: "Web Development",
    headline: "Landing page conversion increased from 1.8% to 4.6%",
    metric: "2.5×",
    metricLabel: "Lead-to-signup conversion",
    tags: ["Web Design", "React", "More enquiries"],
  },
  {
    client: "Nova Botanics",
    category: "Branding & Launch",
    headline: "Full visual identity and DTC storefront launch",
    metric: "₹18L+",
    metricLabel: "First-month launch revenue",
    tags: ["Brand Identity", "Design System"],
  },
];

const FAQS = [
  {
    q: "How fast do sprints start once we sign on?",
    a: "We kick off with a strategy discovery within 48 hours. Most sprints deliver initial design concepts and content roadmaps within week one, moving straight to production without delay.",
  },
  {
    q: "How does pricing and project scoping work?",
    a: "We operate on clear, flat-fee sprint pricing and dedicated monthly growth retainers. You receive an itemized scope beforehand with guaranteed deliverables—no hidden fees or surprise billings.",
  },
  {
    q: "Can you handle both creative design and engineering?",
    a: "Yes. From branding and motion reel production to custom web development in React, we handle the complete creative and engineering lifecycle in-house.",
  },
  {
    q: "What if we need ongoing iterations and revisions?",
    a: "Every project includes dedicated review rounds. Our growth retainer clients enjoy continuous optimization, performance monitoring, and rapid creative turnarounds.",
  },
];

function Stat({ value, suffix = "", label }) {
  const [ref, visible] = useReveal({ threshold: 0.4 });
  const n = useCountUp(value, visible);
  return (
    <div ref={ref} className="stat neu-inset">
      <div className="stat-num">
        {n}
        {suffix}
      </div>
      <div className="stat-label">{label}</div>
    </div>
  );
}

function HeroVisual() {
  const ref = useRef(null);
  const reduced = useReducedMotion();

  const onMove = (e) => {
    if (reduced || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    ref.current.style.setProperty("--rx", `${(-y * 10).toFixed(2)}deg`);
    ref.current.style.setProperty("--ry", `${(x * 12).toFixed(2)}deg`);
  };
  const onLeave = () => {
    ref.current?.style.setProperty("--rx", "0deg");
    ref.current?.style.setProperty("--ry", "0deg");
  };

  return (
    <div className="hero-visual" ref={ref} onPointerMove={onMove} onPointerLeave={onLeave} aria-hidden="true">
      <div className="orbit-stage">
        <div className="genie-glow" />
        <div className="genie-art-wrap">
          <img className="genie-art" src={genieArt} alt="" />
        </div>
        <span className="float-chip glass chip-reach">+128% reach <small>↗</small></span>
        <span className="float-chip glass chip-leads">2× leads <small>↗</small></span>
        {ORBIT.map((o, idx) => (
          <div className="sat-arm" style={{ "--k": idx }} key={o.label}>
            <div className="sat glass">
              <Icon type={o.icon} size={16} />
              <span>{o.label}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function RotatingWord() {
  const reduced = useReducedMotion();
  const [i, setI] = useState(0);
  useEffect(() => {
    if (reduced) return;
    const id = setInterval(() => setI((v) => (v + 1) % WORDS.length), 2200);
    return () => clearInterval(id);
  }, [reduced]);
  return (
    <span className="rotator" aria-live="off">
      <span key={i} className="rotator-word">{WORDS[i]}</span>
    </span>
  );
}

function CaseStudies() {
  return (
    <section className="container section" aria-label="Proven outcomes and case studies">
      <Reveal className="section-head">
        <span className="eyebrow">Proven outcomes</span>
        <h2 className="h2">Work that speaks in numbers</h2>
      </Reveal>
      <div className="grid-3 cases-grid">
        {CASE_STUDIES.map((c, i) => (
          <Reveal key={c.client} delay={i * 90} className="case-card neu-raised hover-lift">
            <div className="case-top">
              <span className="pill">{c.category}</span>
              <span className="case-client">{c.client}</span>
            </div>
            <div className="case-stat">
              <span className="case-metric accent-text">{c.metric}</span>
              <span className="case-label">{c.metricLabel}</span>
            </div>
            <h3 className="h4 case-title">{c.headline}</h3>
            <div className="case-tags">
              {c.tags.map((t) => (
                <span key={t} className="tag">{t}</span>
              ))}
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function FAQ() {
  const [open, setOpen] = useState(null);
  return (
    <section className="container section" aria-label="Frequently asked questions">
      <Reveal className="section-head">
        <span className="eyebrow">Got questions?</span>
        <h2 className="h2">Frequently asked questions</h2>
      </Reveal>
      <div className="faq-list">
        {FAQS.map((item, idx) => {
          const isOpen = open === idx;
          return (
            <Reveal as="div" key={item.q} delay={idx * 60} className={`faq-item neu-raised${isOpen ? " open" : ""}`}>
              <button
                type="button"
                className="faq-q"
                onClick={() => setOpen(isOpen ? null : idx)}
                aria-expanded={isOpen}
              >
                <span>{item.q}</span>
                <span className="faq-icon" aria-hidden="true">{isOpen ? "−" : "+"}</span>
              </button>
              {isOpen && (
                <div className="faq-a">
                  <p>{item.a}</p>
                </div>
              )}
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}

export default function Home() {
  const meta = metaFor("/");
  return (
    <>
      <SEO
        title={meta.title}
        description={meta.description}
        path="/"
        jsonLd={[
          {
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "NextGenies",
            url: SITE_URL,
            logo: `${SITE_URL}/ng-logo-192.png`,
            email: CONTACT.email,
            telephone: CONTACT.phone,
            description: meta.description,
          },
          { "@context": "https://schema.org", "@type": "WebSite", name: "NextGenies", url: SITE_URL },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: FAQS.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: {
                "@type": "Answer",
                text: f.a,
              },
            })),
          },
        ]}
      />

      <main>
        <section className="hero">
          <div className="hero-bg" aria-hidden="true">
            <span className="blob b1" />
            <span className="blob b2" />
            <span className="blob b3" />
            <span className="grid-dots" />
          </div>

          <div className="container hero-grid">
            <div className="hero-copy">
              <div className="pill hero-pill">
                <span className="live-dot" /> Built for businesses in India
              </div>
              <h1 className="hero-title">
                <span className="line l1">We help Indian businesses</span>
                <span className="line l2">
                  grow online with <RotatingWord />
                </span>
                <span className="line l3">work that brings customers.</span>
              </h1>
              <p className="lead hero-lead">
                Content, websites, branding and digital campaigns made for your market, your budget and your next stage of growth.
              </p>
              <div className="btn-row hero-cta">
                <Link className="btn btn-primary btn-lg" to="/contact" onClick={() => trackEvent("contact_cta_click", { location: "home_hero" })}>
                  Start a project <span aria-hidden="true">→</span>
                </Link>
                <a className="btn btn-neu btn-lg" href={CONTACT.whatsapp} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent("whatsapp_click", { location: "home_hero" })}>
                  WhatsApp us
                </a>
              </div>
              <p className="hero-assurance">Free discovery call · Clear scope · No confusing agency talk</p>
              <div className="scroll-hint" aria-hidden="true">
                <span className="mouse"><i /></span> Scroll to explore
              </div>
            </div>

            <HeroVisual />
          </div>
        </section>

        <section className="container stats" aria-label="Agency highlights">
          <Stat value={4} suffix="+" label="Core services" />
          <Stat value={100} suffix="%" label="Remote-first" />
          <Stat value={24} suffix="h" label="Response time" />
          <Stat value={1} suffix=" team" label="Strategy to launch" />
        </section>

        <section className="container section">
          <Reveal className="section-head">
            <span className="eyebrow">Why us</span>
            <h2 className="h2">Not just services. Real growth.</h2>
          </Reveal>
          <div className="grid-4">
            {WHY.map((w, i) => (
              <Reveal key={w.title} delay={i * 80} className="neu-raised card-pad hover-lift">
                <span className="icon-chip neu-inset"><Icon type={w.icon} /></span>
                <h3 className="h4">{w.title}</h3>
                <p className="muted">{w.text}</p>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="marquee" aria-hidden="true">
          <div className="marquee-track">
            {[...Array(2)].map((_, k) => (
              <div className="marquee-set" key={k}>
                {["Content", "Websites", "Branding", "Social", "SEO", "Automation", "Strategy", "Growth"].map((w) => (
                  <span key={w + k}>{w}<i /></span>
                ))}
              </div>
            ))}
          </div>
        </section>

        <section className="container section">
          <Reveal className="section-head">
            <span className="eyebrow">What we do</span>
            <h2 className="h2">Core services</h2>
          </Reveal>
          <div className="grid-2">
            {SERVICES.map((s, i) => (
              <Reveal key={s.n} delay={(i % 2) * 90}>
                <Link to="/services" className="svc-card neu-raised hover-lift">
                  <span className="svc-n">{s.n}</span>
                  <span className="icon-chip neu-inset"><Icon type={s.icon} /></span>
                  <div>
                    <h3 className="h4">{s.title}</h3>
                    <p className="muted">{s.text}</p>
                  </div>
                  <span className="svc-arrow" aria-hidden="true">→</span>
                </Link>
              </Reveal>
            ))}
          </div>
        </section>

        <CaseStudies />

        <AgencyComparison />

        <TechStack />

        <section className="container section">
          <Reveal className="section-head">
            <span className="eyebrow">How we work</span>
            <h2 className="h2">Simple process. Clear outcomes.</h2>
          </Reveal>
          <ol className="steps">
            {STEPS.map((s, i) => (
              <Reveal as="li" key={s.n} delay={i * 90} className="step glass">
                <span className="step-n">{s.n}</span>
                <h3 className="h4">{s.title}</h3>
                <p className="muted">{s.text}</p>
              </Reveal>
            ))}
          </ol>
        </section>

        <FAQ />

        <section className="container section">
          <Reveal className="cta-card neu-raised">
            <span className="eyebrow">Let's build together</span>
            <h2 className="h2">Ready to scale your brand?</h2>
            <p className="lead">Tell us what you're building and we'll shape the right plan.</p>
            <div className="btn-row center">
              <Link className="btn btn-primary btn-lg" to="/contact" onClick={() => trackEvent("contact_cta_click", { location: "home_footer_cta" })}>Get started →</Link>
              <Link className="btn btn-neu btn-lg" to="/services">Explore services</Link>
            </div>
          </Reveal>
        </section>
      </main>
    </>
  );
}
