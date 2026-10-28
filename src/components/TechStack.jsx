import Reveal from "./Reveal";

const PLATFORMS = [
  {
    name: "Instagram, Facebook & Reels",
    category: "Social media",
    desc: "Posts, reels and ads that feel natural on the platforms your customers already use.",
    badge: "Core platform",
  },
  {
    name: "Google Ads & YouTube",
    category: "Search and video",
    desc: "Show up when people are searching for what you sell, then bring them back when they are ready.",
    badge: "Core platform",
  },
  {
    name: "React & modern websites",
    category: "Web development",
    desc: "Fast, mobile-friendly websites and landing pages that make it easy for people to trust and contact you.",
    badge: "Our strength",
  },
  {
    name: "Google Analytics & Tag Manager",
    category: "Tracking",
    desc: "Simple reports that show where people come from, what they do and what brings enquiries.",
    badge: "Our strength",
  },
  {
    name: "Figma & brand design",
    category: "Design and branding",
    desc: "Clear designs for your brand, website and social media so customers recognise you everywhere.",
    badge: "Our strength",
  },
  {
    name: "Email & WhatsApp follow-ups",
    category: "Customer follow-up",
    desc: "Helpful reminders and follow-ups that keep your business in touch with interested customers.",
    badge: "Growth support",
  },
];

export default function TechStack() {
  return (
    <section className="container section" aria-label="Platforms and technologies we use">
      <Reveal className="section-head">
        <span className="eyebrow">What we work with</span>
        <h2 className="h2">Platforms & technologies we master</h2>
        <p className="lead">
          We focus on the tools that work for Indian businesses first, and support brands outside India too. No long list of tools just to sound impressive.
        </p>
      </Reveal>

      <div className="grid-3 stack-ecosystem-grid">
        {PLATFORMS.map((p, idx) => (
          <Reveal key={p.name} delay={idx * 60} className="eco-card neu-raised hover-lift">
            <div className="eco-top">
              <span className="pill">{p.category}</span>
              <span className="eco-badge">{p.badge}</span>
            </div>
            <h3 className="h4 eco-title">{p.name}</h3>
            <p className="muted eco-desc">{p.desc}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
