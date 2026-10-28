import { Link } from "react-router-dom";
import SEO from "../components/SEO";
import { breadcrumbLd } from "../lib/seoHelpers";
import Icon from "../components/Icon";
import Reveal from "../components/Reveal";
import GrowthPackages from "../components/GrowthPackages";
import { useReducedMotion, useSectionProgress } from "../hooks/useReveal";
import { metaFor } from "../seo/routes";

const SERVICES = [
  {
    number: "01",
    label: "Content Creation",
    icon: "video",
    title: "Content that captures & converts",
    description:
      "We produce strategic, platform-native content that stops the scroll and drives real engagement. From long-form brand narratives to 15-second reels, every piece has a purpose.",
    features: [
      "Instagram & YouTube reels production",
      "Carousels & infographics",
      "Scriptwriting & copywriting",
      "Content calendar & scheduling",
      "Brand voice development",
    ],
  },
  {
    number: "02",
    label: "Website Development",
    icon: "code",
    title: "Websites built for business",
    description:
      "Your website should do more than look good. We design fast, focused digital experiences that make your brand memorable and turn visitors into customers.",
    features: [
      "Custom website design & development",
      "Landing pages that convert",
      "Mobile-first responsive design",
      "SEO & performance optimisation",
      "Ongoing website support",
    ],
  },
  {
    number: "03",
    label: "Social Media Management",
    icon: "share",
    title: "A social presence that performs",
    description:
      "We manage the moving parts of your social presence so it stays consistent, intentional, and built to grow a community around your brand.",
    features: [
      "Platform strategy & content planning",
      "Posting, scheduling & community management",
      "Engagement & audience growth",
      "Monthly performance reporting",
      "Campaign management",
    ],
  },
  {
    number: "04",
    label: "Branding",
    icon: "shield",
    title: "Brands people remember",
    description:
      "We shape the visual and verbal building blocks that make your business instantly recognisable, trusted, and ready to stand out in a crowded market.",
    features: [
      "Logo & visual identity design",
      "Brand strategy & positioning",
      "Colour, typography & style systems",
      "Brand guidelines",
      "Launch-ready brand assets",
    ],
  },
];

const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const smooth = (x) => x * x * (3 - 2 * x);
// Makes each card "rest" for a moment before the next one arrives.
const ease = (raw) => {
  const base = Math.floor(raw);
  const frac = raw - base;
  return base + smooth(clamp((frac - 0.18) / 0.64, 0, 1));
};

function Features({ items }) {
  return (
    <ul className="svc-features">
      {items.map((f) => (
        <li key={f}>
          <svg viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="m3.25 8.25 2.7 2.7 5-5.7" />
          </svg>
          {f}
        </li>
      ))}
    </ul>
  );
}

function ScrollStack() {
  const [ref, progress] = useSectionProgress();
  const n = SERVICES.length;
  const pos = ease(progress * (n - 1));
  const active = clamp(Math.round(pos), 0, n - 1);

  return (
    <section ref={ref} className="stack" style={{ "--n": n }} aria-label="Our services">
      <div className="stack-sticky">
        <div className="container stack-grid">
          <div className="stack-side">
            <span className="eyebrow">What we do</span>
            <h1 className="h1 stack-title">
              Services built <span className="accent-text">for growth</span>
            </h1>
            <p className="lead stack-lead">Scroll to explore what we can build for you.</p>
            <ol className="stack-index" aria-hidden="true">
              {SERVICES.map((s, i) => (
                <li key={s.label} className={i === active ? "on" : i < active ? "done" : ""}>
                  <span>{s.number}</span>
                  {s.label}
                </li>
              ))}
            </ol>
            <div className="stack-bar" aria-hidden="true"><i style={{ transform: `scaleX(${progress})` }} /></div>
          </div>

          <div className="stack-cards">
            {SERVICES.map((s, i) => {
              const t = i - pos;
              const y = t > 0 ? Math.min(t, 1) * 112 : t * 7; // % below / px-ish above
              const scale = t > 0 ? 1 : 1 + t * 0.055;
              const opacity = t > 0 ? 1 : clamp(1 + t * 0.55, 0, 1);
              return (
                <article
                  key={s.number}
                  className={`svc-big neu-raised${i === active ? " is-active" : ""}`}
                  style={{
                    zIndex: i + 1,
                    transform: `translate3d(0, ${t > 0 ? y + "%" : y * 3 + "px"}, 0) scale(${scale})`,
                    opacity,
                    pointerEvents: i === active ? "auto" : "none",
                  }}
                  aria-hidden={i !== active}
                >
                  <div className="svc-big-top">
                    <span className="svc-big-n">{s.number}</span>
                    <span className="pill">{s.label}</span>
                    <span className="icon-chip neu-inset svc-big-icon"><Icon type={s.icon} size={24} /></span>
                  </div>
                  <h2 className="h2 svc-big-title">{s.title}</h2>
                  <p className="muted">{s.description}</p>
                  <Features items={s.features} />
                  <Link to="/contact" className="btn btn-primary svc-big-cta" tabIndex={i === active ? 0 : -1}>
                    Get started →
                  </Link>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function StaticList() {
  return (
    <main className="container page-top">
      <header className="about-head">
        <span className="eyebrow">What we do</span>
        <h1 className="h1">Services built <span className="accent-text">for growth</span></h1>
      </header>
      <div className="grid-2">
        {SERVICES.map((s) => (
          <article key={s.number} className="svc-big neu-raised static">
            <div className="svc-big-top">
              <span className="svc-big-n">{s.number}</span>
              <span className="pill">{s.label}</span>
            </div>
            <h2 className="h3">{s.title}</h2>
            <p className="muted">{s.description}</p>
            <Features items={s.features} />
          </article>
        ))}
      </div>
    </main>
  );
}

export default function Services() {
  const meta = metaFor("/services");
  const reduced = useReducedMotion();
  return (
    <>
      <SEO
        title={meta.title}
        description={meta.description}
        path="/services"
        jsonLd={[
          breadcrumbLd([{ name: "Home", path: "/" }, { name: "Services", path: "/services" }]),
          {
            "@context": "https://schema.org",
            "@type": "ItemList",
            itemListElement: SERVICES.map((s, i) => ({
              "@type": "ListItem",
              position: i + 1,
              item: { "@type": "Service", name: s.label, description: s.description, provider: { "@type": "Organization", name: "NextGenies" } },
            })),
          },
        ]}
      />
      {reduced ? <StaticList /> : <main><ScrollStack /></main>}

      <GrowthPackages />

      <section className="container section">
        <Reveal className="cta-card neu-raised">
          <h2 className="h2">Ready to scale your brand?</h2>
          <p className="lead">Tell us what you're building and we'll shape the right plan.</p>
          <Link className="btn btn-primary btn-lg" to="/contact">Start a project →</Link>
        </Reveal>
      </section>
    </>
  );
}
