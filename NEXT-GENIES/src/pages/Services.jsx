import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import SEO from "../components/SEO";
import "../styles/services.css";

function Services() {
  const [activeService, setActiveService] = useState(0);
  const [timelineHeight, setTimelineHeight] = useState(0);

  const cardRefs = useRef([]);
  const wrapperRefs = useRef([]);
  const nodeRefs = useRef([]);

  const services = [
    {
      number: "01",
      label: "Content Creation",
      title: "Content That Captures & Converts",
      description:
        "We produce strategic, platform-native content that stops the scroll and drives real engagement. From long-form brand narratives to 15-second reels — every piece has a purpose.",
      features: [
        "Instagram & YouTube Reels Production",
        "Carousels & Infographics",
        "Scriptwriting & Copywriting",
        "Content Calendar & Scheduling",
        "Brand Voice Development",
      ],
      icon: "content",
    },
    {
      number: "02",
      label: "Website Development",
      title: "Websites Built for Business",
      description:
        "Your website should do more than look good. We design fast, focused digital experiences that make your brand memorable and turn visitors into customers.",
      features: [
        "Custom Website Design & Development",
        "Landing Pages That Convert",
        "Mobile-First Responsive Design",
        "SEO & Performance Optimisation",
        "Ongoing Website Support",
      ],
      icon: "website",
    },
    {
      number: "03",
      label: "Social Media Management",
      title: "A Social Presence That Performs",
      description:
        "We manage the moving parts of your social presence so it stays consistent, intentional, and built to grow a community around your brand.",
      features: [
        "Platform Strategy & Content Planning",
        "Posting, Scheduling & Community Management",
        "Engagement & Audience Growth",
        "Monthly Performance Reporting",
        "Campaign Management",
      ],
      icon: "social",
    },
    {
      number: "04",
      label: "Branding",
      title: "Brands People Remember",
      description:
        "We shape the visual and verbal building blocks that make your business instantly recognisable, trusted, and ready to stand out in a crowded market.",
      features: [
        "Logo & Visual Identity Design",
        "Brand Strategy & Positioning",
        "Colour, Typography & Style Systems",
        "Brand Guidelines",
        "Launch-Ready Brand Assets",
      ],
      icon: "brand",
    },
  ];

  const updateScrollState = useCallback(() => {
    const viewportFocal = window.innerHeight * 0.45;
    let closestIndex = 0;
    let minDistance = Infinity;

    cardRefs.current.forEach((el, index) => {
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const cardCenter = rect.top + rect.height / 2;
      const distance = Math.abs(cardCenter - viewportFocal);

      // Add entrance animation class when scrolled into view
      if (rect.top < window.innerHeight * 0.88) {
        el.classList.add("is-visible");
      }

      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = index;
      }
    });

    setActiveService(closestIndex);

    // Calculate vertical progress line height to the current node
    const topNode = nodeRefs.current[0];
    const currentNode = nodeRefs.current[closestIndex];
    if (topNode && currentNode) {
      const distanceToNode = currentNode.offsetTop - topNode.offsetTop;
      setTimelineHeight(distanceToNode);
    }
  }, []);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateScrollState();
          ticking = false;
        });
        ticking = true;
      }
    };

    // Initialize state after mount
    const initialTimer = window.setTimeout(() => {
      updateScrollState();
    }, 0);

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });

    return () => {
      window.clearTimeout(initialTimer);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [updateScrollState]);

  const scrollToService = (index) => {
    const targetCard = cardRefs.current[index];
    if (targetCard) {
      targetCard.scrollIntoView({ behavior: "smooth", block: "center" });
      setActiveService(index);
    }
  };

  return (
    <>
      <SEO
        title="Our Core Digital Growth Services"
        description="Explore NextGenies' full-service digital solutions: strategic content creation, custom website development, end-to-end social media management, and branding."
        canonicalPath="/services"
      />
      <Navbar />

      <main className="services-page">
        <header className="services-header">
          <div className="services-kicker">What We Do</div>
          <h1>
            Services Built to <span>Scale You</span>
          </h1>
          <p>
            Every service we offer is designed with one goal: delivering
            measurable growth for your brand in the digital world.
          </p>
        </header>

        {/* Sticky Quick-Jump Filter Bar on Scroll */}
        <div className="services-quick-nav-wrap">
          <nav className="services-quick-nav" aria-label="Services quick navigation">
            {services.map((service, index) => (
              <button
                key={service.number}
                type="button"
                className={`services-nav-btn ${activeService === index ? "is-active" : ""}`}
                onClick={() => scrollToService(index)}
                aria-label={`Jump to ${service.label}`}
              >
                <span className="btn-num">{service.number}</span>
                <span>{service.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Main Services Timeline Showcase */}
        <div className="services-container">
          <div className="services-timeline-wrap">
            {/* Animated vertical gradient progress line */}
            <div
              className="services-timeline-bar"
              style={{ height: `${timelineHeight}px` }}
              aria-hidden="true"
            />

            {services.map((service, index) => (
              <div
                key={service.number}
                ref={(el) => (wrapperRefs.current[index] = el)}
                className={`service-card-wrapper ${
                  activeService === index ? "is-active" : ""
                }`}
              >
                {/* Interactive timeline step node */}
                <button
                  type="button"
                  ref={(el) => (nodeRefs.current[index] = el)}
                  className="service-timeline-node"
                  onClick={() => scrollToService(index)}
                  aria-label={`Jump to ${service.number} ${service.label}`}
                >
                  {service.number}
                </button>

                {/* Service detail card */}
                <article
                  id={`service-${service.number}`}
                  ref={(el) => (cardRefs.current[index] = el)}
                  data-index={index}
                  className={`service-detail-card ${
                    activeService === index ? "is-active" : ""
                  }`}
                >
                  <div className="service-detail-content">
                    <div className="service-detail-label">
                      {service.number} / {service.label}
                    </div>
                    <h2>{service.title}</h2>
                    <p>{service.description}</p>

                    <ul className="service-feature-list">
                      {service.features.map((feature) => (
                        <li key={feature}>
                          <span className="service-check" aria-hidden="true">
                            <svg viewBox="0 0 16 16">
                              <path d="m3.25 8.25 2.7 2.7 5-5.7" />
                            </svg>
                          </span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="service-art" aria-hidden="true">
                    <ServiceIcon type={service.icon} />
                  </div>
                </article>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Call to Action */}
        <section className="services-cta">
          <div className="section-label">Let's Build Together</div>
          <h2>Ready to Scale Your Brand?</h2>
          <p>Tell us what you are building, and we will shape the right plan.</p>
          <Link className="btn-primary" to="/contact">
            Get Started
          </Link>
        </section>
      </main>

      <Footer />
    </>
  );
}

function ServiceIcon({ type }) {
  const icons = {
    content: (
      <>
        <rect x="30" y="22" width="40" height="52" rx="4" />
        <path d="M39 36h22M39 45h22M39 54h14" />
        <circle cx="59" cy="61" r="5" />
      </>
    ),
    website: (
      <>
        <rect x="20" y="25" width="60" height="45" rx="4" />
        <path d="M20 35h60M29 30h.1M35 30h.1M41 30h.1M31 45h18M31 53h31M31 61h24" />
      </>
    ),
    social: (
      <>
        <rect x="25" y="20" width="50" height="55" rx="8" />
        <circle cx="50" cy="38" r="8" />
        <path d="M34 62c4-9 20-9 32 0M44 26h12" />
      </>
    ),
    brand: (
      <>
        <path d="m50 18 26 15v30L50 78 24 63V33Z" />
        <path d="m50 18 0 60M24 33l26 15 26-15" />
        <circle cx="50" cy="48" r="8" />
      </>
    ),
  };

  return <svg viewBox="0 0 100 100">{icons[type]}</svg>;
}

export default Services;
