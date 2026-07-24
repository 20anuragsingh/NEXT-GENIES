import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function About() {
  const stats = [
    ["50+", "Clients Served"],
    ["3x", "Avg. Growth Delivered"],
    ["100%", "Remote-First Team"],
    ["2024", "Founded"],
  ];

  return (
    <>
      <Navbar />

      <main className="about-page">
        <section className="about-hero">
          <div className="about-story-wrap">
            <div className="about-kicker">Our Story</div>
            <h1 className="about-title">
              Built by Builders,<br />
              For <span>Bold Brands</span>
            </h1>

            <div className="about-story">
              <p>
                NextGenies started from a simple frustration: too many
                businesses were getting charged premium prices for mediocre
                digital results. We&apos;d seen brands spend lakhs on agencies
                that delivered decks, not results.
              </p>
              <p>
                So we built something different. A lean, fast, results-first
                digital agency that thinks like a founder &mdash; not a vendor.
                We combine creative instinct with performance data to build
                digital presences that actually drive growth.
              </p>
              <p>
                We started small, worked with founders who needed real ROI,
                and grew by making our clients grow. Every service we offer is
                something we&apos;ve refined by doing &mdash; not theorizing.
              </p>
            </div>
          </div>

          <div className="about-stats" aria-label="NextGenies at a glance">
            {stats.map(([value, label]) => (
              <div className="stat-card" key={label}>
                <div className="stat-num">{value}</div>
                <div className="stat-label">{label}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="mission-grid">
          <article className="mission-card">
            <h2 className="mission-title">Our Mission</h2>
            <p className="mission-text">
              To democratize high-performance digital marketing &mdash; giving
              every ambitious brand access to the kind of strategy and
              execution that was once only available to big-budget companies.
              We build digital systems that scale.
            </p>
          </article>

          <article className="mission-card">
            <h2 className="mission-title">Our Vision</h2>
            <p className="mission-text">
              A world where every creator, founder, and business owner has a
              digital presence that works as hard as they do. We want to be the
              agency that comes to mind when someone says, &ldquo;they actually
              deliver.&rdquo;
            </p>
          </article>
        </section>

        <section className="about-values">
          <div className="about-values-heading">
            <div className="about-kicker">What Drives Us</div>
            <h2>Our Core Values</h2>
          </div>

          <div className="about-values-grid">
            <article className="about-value-card">
              <h3>Radical Transparency</h3>
              <p>We share real numbers, honest timelines, and clear deliverables &mdash; always.</p>
            </article>
            <article className="about-value-card">
              <h3>Speed with Intent</h3>
              <p>We move fast, but every decision is backed by strategy, not guesswork.</p>
            </article>
            <article className="about-value-card">
              <h3>Client-First</h3>
              <p>Your business goals are the brief. We don&apos;t build for awards &mdash; we build for growth.</p>
            </article>
          </div>
        </section>

        <section className="about-work-cta">
          <h2>Want to Work Together?</h2>
          <p>We&apos;re selective about who we work with &mdash; because we&apos;re invested in your growth.</p>
          <a className="btn-primary" href="/contact">Let&apos;s Talk</a>
        </section>
      </main>

      <Footer />
    </>
  );
}

export default About;
