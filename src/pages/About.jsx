import { Link } from "react-router-dom";
import SEO from "../components/SEO";
import { breadcrumbLd } from "../lib/seoHelpers";
import Reveal from "../components/Reveal";
import { metaFor } from "../seo/routes";

const VALUES = [
  { title: "Radical transparency", text: "Real numbers, honest timelines and clear deliverables. Always." },
  { title: "Speed with intent", text: "We move fast, but every decision is backed by strategy, not guesswork." },
  { title: "Client-first", text: "Your business goals are the brief. We don't build for awards, we build for growth." },
];

export default function About() {
  const meta = metaFor("/about");
  return (
    <>
      <SEO
        title={meta.title}
        description={meta.description}
        path="/about"
        jsonLd={breadcrumbLd([{ name: "Home", path: "/" }, { name: "About", path: "/about" }])}
      />
      <main className="container page-top">
        <Reveal as="header" className="about-head">
          <span className="eyebrow">Our story</span>
          <h1 className="h1">
            Built by builders,
            <br />
            for <span className="accent-text">bold brands</span>.
          </h1>
        </Reveal>

        <Reveal className="about-story neu-raised card-pad">
          <p>
            NextGenies started from a simple frustration: too many businesses were paying premium prices for mediocre
            digital results. We'd seen brands spend lakhs on agencies that delivered decks, not results.
          </p>
          <p>
            So we built something different. A lean, fast, results-first agency that thinks like a founder, not a
            vendor. We combine creative instinct with performance data to build digital presences that actually drive
            growth.
          </p>
        </Reveal>

        <div className="grid-2 about-mv">
          <Reveal className="glass card-pad">
            <h2 className="h3">Our mission</h2>
            <p className="muted">
              To democratize high-performance digital marketing, giving every ambitious brand access to the strategy and
              execution once reserved for big-budget companies.
            </p>
          </Reveal>
          <Reveal delay={90} className="glass card-pad">
            <h2 className="h3">Our vision</h2>
            <p className="muted">
              A world where every creator, founder and business owner has a digital presence that works as hard as they
              do. The agency people describe as "they actually deliver."
            </p>
          </Reveal>
        </div>

        <Reveal className="section-head" style={{ marginTop: "72px" }}>
          <span className="eyebrow">What we stand for</span>
          <h2 className="h2">Core values</h2>
        </Reveal>
        <div className="grid-3">
          {VALUES.map((v, i) => (
            <Reveal key={v.title} delay={i * 80} className="neu-raised card-pad">
              <span className="value-n">0{i + 1}</span>
              <h3 className="h4">{v.title}</h3>
              <p className="muted">{v.text}</p>
            </Reveal>
          ))}
        </div>

        <Reveal className="cta-card neu-raised" style={{ marginTop: "72px" }}>
          <h2 className="h2">Want to work together?</h2>
          <p className="lead">We're selective about who we work with, because we're invested in your growth.</p>
          <Link className="btn btn-primary btn-lg" to="/contact">Start a project →</Link>
        </Reveal>
      </main>
    </>
  );
}
