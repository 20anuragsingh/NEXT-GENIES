import Reveal from "./Reveal";

const COMPARISONS = [
  {
    category: "Getting started",
    traditional: "Many meetings, long approvals and weeks before you see useful work.",
    nextgenies: "A clear plan in 48 hours, with useful first work in the first week.",
  },
  {
    category: "Who does the work",
    traditional: "You meet one person, then your work moves between different teams.",
    nextgenies: "You work directly with the people planning, designing and building your project.",
  },
  {
    category: "What we measure",
    traditional: "Reports full of likes and views, without showing what helped your business.",
    nextgenies: "Enquiries, sales, website actions and the cost of bringing in a customer.",
  },
  {
    category: "Websites & technology",
    traditional: "The same templates and tools for every business, even when they are a poor fit.",
    nextgenies: "The right setup for your needs, using React, modern websites, Google tools and clean tracking.",
  },
  {
    category: "Pricing & scope",
    traditional: "Unclear retainers, surprise costs and extra charges when the plan changes.",
    nextgenies: "Simple scope, clear deliverables and pricing you can understand before we start.",
  },
];

export default function AgencyComparison() {
  return (
    <section className="container section" aria-label="Why NextGenies beats traditional agencies">
      <Reveal className="section-head">
        <span className="eyebrow">Why businesses choose us</span>
        <h2 className="h2">Traditional agency or NextGenies?</h2>
        <p className="lead">
          We are not just a marketing agency. We bring strategy, creative work and technology together so your work gets seen and acted on.
        </p>
      </Reveal>

      <div className="vs-table-shell neu-raised">
        <div className="vs-header">
          <div className="vs-col vs-cat-head">Focus Area</div>
          <div className="vs-col vs-bad-head">Traditional agency</div>
          <div className="vs-col vs-good-head">The NextGenies way</div>
        </div>

        <div className="vs-body">
          {COMPARISONS.map((c, i) => (
            <Reveal key={c.category} delay={i * 45} className="vs-row">
              <div className="vs-col vs-cat">
                <strong>{c.category}</strong>
              </div>
              <div className="vs-col vs-bad">
                <span className="vs-icon-bad" aria-hidden="true">✕</span>
                <p>{c.traditional}</p>
              </div>
              <div className="vs-col vs-good">
                <span className="vs-icon-good" aria-hidden="true">✓</span>
                <p>{c.nextgenies}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
