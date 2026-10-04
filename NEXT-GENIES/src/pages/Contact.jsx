import { useState, useRef } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import SEO from "../components/SEO";
import "../styles/questionnaire.css";

// Core service definitions with deep dynamic branching
const SERVICES = [
  {
    id: "web-dev",
    name: "Web Development",
    icon: "code",
    desc: "Custom modern websites, e-commerce stores & scalable web applications",
    badge: "Popular",
    question: "What type of website do you need?",
    questionDesc: "Select the format that best matches your business goals.",
    subQuestionTitle: "What is your preferred technical stack or platform?",
    options: [
      {
        id: "business-site",
        title: "Business / Corporate Website",
        desc: "Establish brand credibility, explain offerings, and convert visitors into clients.",
        icon: "building",
      },
      {
        id: "ecommerce",
        title: "E-commerce Store",
        desc: "Sell products online with custom catalog, shopping cart, and secure payment processing.",
        icon: "cart",
      },
      {
        id: "portfolio",
        title: "Portfolio / Personal Brand",
        desc: "High-impact visual showcase for founders, creative directors, and consultants.",
        icon: "user",
      },
      {
        id: "web-app",
        title: "Custom Web App / SaaS",
        desc: "Dynamic web applications with user auth, dashboards, databases, and APIs.",
        icon: "layers",
      },
      {
        id: "landing-page",
        title: "High-Converting Landing Page",
        desc: "Laser-focused single page built to maximize paid advertising and campaign signups.",
        icon: "zap",
      },
      {
        id: "redesign",
        title: "Website Redesign & Speed Optimization",
        desc: "Modernize your outdated site with ultra-fast load times and cutting-edge UI/UX.",
        icon: "refresh",
      },
    ],
    scopeOptions: [
      { id: "custom-stack", label: "Modern Custom Stack (React / Next.js / Node)", desc: "Maximum performance, custom features & SEO dominance" },
      { id: "ecommerce-platform", label: "Shopify / WooCommerce", desc: "Proven e-commerce engine with straightforward inventory management" },
      { id: "visual-cms", label: "Webflow / Framer", desc: "Dynamic interactive animations & rapid visual updates" },
      { id: "wordpress-cms", label: "WordPress / Headless CMS", desc: "Easy editorial publishing, custom blog & plugin ecosystem" },
      { id: "recommend", label: "Recommend the best fit for our budget & goals", desc: "NextGenies technical directors will evaluate and recommend" },
    ],
  },
  {
    id: "digital-marketing",
    name: "Digital Marketing",
    icon: "trending",
    desc: "Data-driven SEO, high-ROI paid ads, conversion funnels & lead gen",
    badge: "High ROI",
    question: "What is your primary marketing goal?",
    questionDesc: "Tell us what results matter most so we can structure the optimal campaign funnel.",
    subQuestionTitle: "What is your expected monthly advertising / marketing budget?",
    options: [
      {
        id: "lead-gen",
        title: "Lead Generation & B2B/B2C Sales",
        desc: "Acquire verified inbound customer inquiries, booked demos, and qualified sales calls.",
        icon: "target",
      },
      {
        id: "seo-search",
        title: "SEO & Google Search Rankings",
        desc: "Outrank competitors on Google search and generate compounding organic revenue.",
        icon: "search",
      },
      {
        id: "paid-ads",
        title: "Paid Advertising (Meta & Google Ads)",
        desc: "High-converting ad creatives, audience targeting, and multi-channel ad scaling.",
        icon: "megaphone",
      },
      {
        id: "cro",
        title: "Conversion Rate Optimization (CRO)",
        desc: "Audit user friction and double revenue conversion from your current web traffic.",
        icon: "chart",
      },
      {
        id: "full-funnel",
        title: "Full-Funnel Growth Strategy",
        desc: "End-to-end multi-channel strategy covering awareness, conversion, and retention.",
        icon: "compass",
      },
    ],
    scopeOptions: [
      { id: "budget-starter", label: "Starter / Testing ($500 – $1,500 / ₹40k – ₹1.2L)", desc: "Validate audience and test initial creative channels" },
      { id: "budget-growth", label: "Growth Stage ($1,500 – $4,000 / ₹1.2L – ₹3.5L)", desc: "Scale profitable campaigns and expand channel reach" },
      { id: "budget-scale", label: "Enterprise / Scaling ($4,000+ / ₹3.5L+)", desc: "Aggressive multi-platform dominance & dedicated ad management" },
      { id: "budget-consult", label: "Need NextGenies' budget recommendation", desc: "Advise us based on our target revenue and industry benchmarks" },
    ],
  },
  {
    id: "content-creation",
    name: "Content Creation",
    icon: "video",
    desc: "Viral short-form video reels, copywriting, design carousels & production",
    badge: "Trending",
    question: "What type of content do you need created?",
    questionDesc: "We produce strategic, platform-native content that stops the scroll and drives action.",
    subQuestionTitle: "What content volume or publishing cadence are you aiming for?",
    options: [
      {
        id: "short-form",
        title: "Short-Form Video (Reels, TikTok, Shorts)",
        desc: "Hook-driven scripting, dynamic filming, captions, sound design, and editing.",
        icon: "film",
      },
      {
        id: "social-graphics",
        title: "Social Visuals & Design Carousels",
        desc: "Thumb-stopping infographics, carousel slide decks, and branded social assets.",
        icon: "image",
      },
      {
        id: "copywriting",
        title: "Copywriting & Thought Leadership",
        desc: "High-converting landing page copy, email newsletters, long-form articles, and scripts.",
        icon: "edit",
      },
      {
        id: "podcasts",
        title: "Podcast & Long-Form Video Production",
        desc: "Full episode mastering, audio cleanup, and extracting viral micro-clips for social channels.",
        icon: "mic",
      },
      {
        id: "content-engine",
        title: "Full Turnkey Content Production Engine",
        desc: "Complete monthly pipeline: ideation, scripting, shooting, editing, and scheduling.",
        icon: "box",
      },
    ],
    scopeOptions: [
      { id: "vol-light", label: "8–12 pieces / month", desc: "Consistent 2–3 high-quality posts per week" },
      { id: "vol-regular", label: "15–20 pieces / month", desc: "Active presence with daily weekday distribution" },
      { id: "vol-heavy", label: "30+ pieces / month", desc: "Omnichannel brand saturation and viral momentum" },
      { id: "vol-batch", label: "Single Batch / Launch Campaign", desc: "One-time package for a new product or rebrand rollout" },
    ],
  },
  {
    id: "ai-solutions",
    name: "AI Solutions",
    icon: "cpu",
    desc: "Custom AI support agents, workflow automation, knowledge retrieval & LLM apps",
    badge: "NextGen",
    question: "What AI solution are you looking to build?",
    questionDesc: "Deploy cutting-edge artificial intelligence to save hours every day and multiply capability.",
    subQuestionTitle: "What is your current data & systems infrastructure?",
    options: [
      {
        id: "ai-support",
        title: "AI Customer Support Agent & Chatbot",
        desc: "24/7 intelligent agent trained on your business docs, handling client FAQs and tickets.",
        icon: "message",
      },
      {
        id: "workflow-automation",
        title: "Business Workflow & CRM Automation",
        desc: "Connect disconnected tools, automate lead routing, and eliminate repetitive tasks.",
        icon: "zap",
      },
      {
        id: "knowledge-base",
        title: "Internal AI Knowledge Assistant",
        desc: "Private AI assistant allowing your team to search documents, policies, and contracts.",
        icon: "book",
      },
      {
        id: "custom-ai-app",
        title: "Custom AI Web App / MVP Development",
        desc: "Full-stack AI tools powered by OpenAI, Claude, or Gemini APIs with custom UI.",
        icon: "sparkles",
      },
      {
        id: "lead-ai",
        title: "AI Lead Scoring & Automated Outreach",
        desc: "Identify high-value leads automatically and generate tailored outreach communications.",
        icon: "target",
      },
    ],
    scopeOptions: [
      { id: "data-docs", label: "Documents & FAQs ready", desc: "We have PDFs, spreadsheets, and knowledge articles on hand" },
      { id: "data-crm", label: "Live CRM / Database integration", desc: "We want to connect to HubSpot, Salesforce, SQL, or custom APIs" },
      { id: "data-fresh", label: "Starting completely fresh", desc: "Need assistance gathering requirements and structuring data" },
      { id: "data-consult", label: "Need technical architecture consultation", desc: "Discuss technical feasibility and optimal AI models" },
    ],
  },
  {
    id: "branding",
    name: "Branding & Identity",
    icon: "shield",
    desc: "Complete visual identity, logo design, brand book, guidelines & pitch decks",
    badge: "Core",
    question: "What is the current status of your brand?",
    questionDesc: "We shape the visual and verbal blocks that make your business instantly recognizable.",
    subQuestionTitle: "What is your highest priority deliverable?",
    options: [
      {
        id: "brand-scratch",
        title: "Starting from Scratch (New Venture)",
        desc: "Comprehensive identity creation: brand name, logo, typography, colors & voice.",
        icon: "sparkles",
      },
      {
        id: "brand-refresh",
        title: "Brand Refresh & Modernization",
        desc: "Elevate an existing business into a modern, cohesive, and high-ticket identity.",
        icon: "refresh",
      },
      {
        id: "brand-guidelines",
        title: "Design System & Brand Guidelines",
        desc: "Standardize rules, typography, iconography, and layouts for seamless consistency.",
        icon: "layers",
      },
      {
        id: "brand-collateral",
        title: "Marketing & Pitch Deck Collateral",
        desc: "Investor pitch decks, sales presentations, business stationery, and social banners.",
        icon: "box",
      },
    ],
    scopeOptions: [
      { id: "deliv-suite", label: "Complete Brand Identity Suite", desc: "Logo variations, color palette, typography system & full brand book" },
      { id: "deliv-digital", label: "Digital & Social Media Kit", desc: "Profile templates, banners, story assets, and presentation layouts" },
      { id: "deliv-pitch", label: "Investor Pitch Deck & Sales Kit", desc: "High-converting slides designed to close deals and secure funding" },
      { id: "deliv-physical", label: "Packaging & Physical Merchandise", desc: "Product packaging, labels, business cards, and print materials" },
    ],
  },
  {
    id: "social-media",
    name: "Social Media Management",
    icon: "share",
    desc: "End-to-end community building, monthly calendars, posting & audience growth",
    badge: "Scale",
    question: "What is your primary social media focus?",
    questionDesc: "Manage the moving parts of your social presence so it stays consistent and active.",
    subQuestionTitle: "Which platforms are your highest priority?",
    options: [
      {
        id: "social-growth",
        title: "Audience & Follower Growth",
        desc: "Strategic organic content, algorithm optimization, and viral formats to build an audience.",
        icon: "trending",
      },
      {
        id: "social-aesthetic",
        title: "Premium Aesthetic & Brand Curation",
        desc: "Beautifully designed feed, high-end styling, and cohesive visual storytelling.",
        icon: "image",
      },
      {
        id: "social-leads",
        title: "Lead Generation & Direct Client Inquiries",
        desc: "Turn followers into booked calls and paying customers through strategic DMs and links.",
        icon: "target",
      },
      {
        id: "social-full",
        title: "Full-Service Turnkey Management",
        desc: "We handle strategy, copywriting, design, posting, engagement, and monthly analytics.",
        icon: "shield",
      },
    ],
    scopeOptions: [
      { id: "plat-insta", label: "Instagram & Reels Focus", desc: "Visual storytelling, carousels, and daily engagement" },
      { id: "plat-linkedin", label: "LinkedIn (Founder & B2B Brand)", desc: "Thought leadership, industry insights, and executive presence" },
      { id: "plat-youtube", label: "YouTube (Shorts & Long-Form)", desc: "Channel management, video thumbnails, and long-term watch time" },
      { id: "plat-omni", label: "All Major Channels (Omni-Channel)", desc: "Coordinated distribution across Instagram, LinkedIn, YouTube, and X" },
    ],
  },
];

const TIMELINE_OPTIONS = [
  { id: "asap", label: "⚡ ASAP (1–2 Weeks)", desc: "Urgent sprint kickoff" },
  { id: "month", label: "🚀 3–4 Weeks", desc: "Standard project rollout" },
  { id: "quarter", label: "📅 1–2 Months", desc: "Planned upcoming quarter" },
  { id: "flexible", label: "💡 Flexible / Planning", desc: "Focused on quality & depth" },
];

const STEP_TITLES = [
  "Basic Details",
  "Service Selection",
  "Specific Need",
  "Scope & Timeline",
  "Review & Submit",
];

function Contact() {
  const [currentStep, setCurrentStep] = useState(1);
  const [direction, setDirection] = useState("forward");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });
  const [errors, setErrors] = useState({});
  const autoAdvanceTimer = useRef(null);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    company: "",
    serviceId: "web-dev",
    serviceName: "Web Development",
    serviceOptionId: "business-site",
    serviceOptionTitle: "Business / Corporate Website",
    scopeId: "custom-stack",
    scopeLabel: "Modern Custom Stack (React / Next.js / Node)",
    timelineId: "month",
    timelineLabel: "🚀 3–4 Weeks",
    additionalNotes: "",
  });

  const apiBaseUrl = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

  // Find active service configuration
  const currentService =
    SERVICES.find((s) => s.id === formData.serviceId) || SERVICES[0];

  function handleInputChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  }

  // Smooth auto-advancing selection for cards
  function handleSelectService(service) {
    if (autoAdvanceTimer.current) clearTimeout(autoAdvanceTimer.current);

    const defaultOption = service.options[0];
    const defaultScope = service.scopeOptions[0];
    setFormData((prev) => ({
      ...prev,
      serviceId: service.id,
      serviceName: service.name,
      serviceOptionId: defaultOption.id,
      serviceOptionTitle: defaultOption.title,
      scopeId: defaultScope.id,
      scopeLabel: defaultScope.label,
    }));

    // Delightful transition to next card after brief selection feedback
    autoAdvanceTimer.current = setTimeout(() => {
      setDirection("forward");
      setCurrentStep(3);
    }, 220);
  }

  function handleSelectOption(option) {
    if (autoAdvanceTimer.current) clearTimeout(autoAdvanceTimer.current);

    setFormData((prev) => ({
      ...prev,
      serviceOptionId: option.id,
      serviceOptionTitle: option.title,
    }));

    // Smooth transition to Card 4
    autoAdvanceTimer.current = setTimeout(() => {
      setDirection("forward");
      setCurrentStep(4);
    }, 220);
  }

  function handleSelectScope(scope) {
    setFormData((prev) => ({
      ...prev,
      scopeId: scope.id,
      scopeLabel: scope.label,
    }));
  }

  function handleSelectTimeline(item) {
    setFormData((prev) => ({
      ...prev,
      timelineId: item.id,
      timelineLabel: item.label,
    }));
  }

  function validateStep1() {
    const newErrors = {};
    if (!formData.fullName.trim() || formData.fullName.trim().length < 2) {
      newErrors.fullName = "Please enter your name.";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email.trim())) {
      newErrors.email = "Please enter a valid email address.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function goToStep(targetStep) {
    if (autoAdvanceTimer.current) clearTimeout(autoAdvanceTimer.current);
    if (targetStep > currentStep) {
      if (currentStep === 1 && !validateStep1()) {
        return;
      }
      setDirection("forward");
    } else {
      setDirection("backward");
    }
    setCurrentStep(targetStep);
  }

  function handleNext() {
    if (autoAdvanceTimer.current) clearTimeout(autoAdvanceTimer.current);
    if (currentStep === 1) {
      if (!validateStep1()) return;
    }
    if (currentStep < 5) {
      setDirection("forward");
      setCurrentStep((prev) => prev + 1);
    }
  }

  function handleBack() {
    if (autoAdvanceTimer.current) clearTimeout(autoAdvanceTimer.current);
    if (currentStep > 1) {
      setDirection("backward");
      setCurrentStep((prev) => prev - 1);
    }
  }

  async function handleSubmitProject(e) {
    if (e) e.preventDefault();

    if (!validateStep1()) {
      goToStep(1);
      return;
    }

    setIsSubmitting(true);
    setStatus({ type: "", message: "" });

    const summaryMessage = [
      `Project Questionnaire Submission:`,
      `• Client Name: ${formData.fullName.trim()}`,
      `• Email: ${formData.email.trim()}`,
      formData.phone.trim() ? `• Phone / WhatsApp: ${formData.phone.trim()}` : null,
      formData.company.trim() ? `• Company / Brand: ${formData.company.trim()}` : null,
      `• Selected Service: ${formData.serviceName}`,
      `• Specific Need: ${formData.serviceOptionTitle}`,
      `• Technical / Scope Preference: ${formData.scopeLabel}`,
      `• Target Timeline: ${formData.timelineLabel}`,
      formData.additionalNotes.trim()
        ? `\nClient Additional Notes:\n${formData.additionalNotes.trim()}`
        : null,
    ]
      .filter(Boolean)
      .join("\n");

    try {
      const response = await fetch(`${apiBaseUrl}/api/contacts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: formData.fullName.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim() || "Not provided",
          company: formData.company.trim(),
          service: formData.serviceName,
          needOption: formData.serviceOptionTitle,
          scopePreference: formData.scopeLabel,
          timeline: formData.timelineLabel,
          message: summaryMessage,
        }),
      });

      let data = {};
      try {
        data = await response.json();
      } catch {
        // Not JSON
      }

      if (!response.ok) {
        throw new Error(data.message || `Request failed with status ${response.status}`);
      }

      setIsSubmitted(true);
    } catch (error) {
      setStatus({
        type: "error",
        message:
          error.message ||
          "Unable to send your request directly. You can also send this brief directly via WhatsApp!",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleReset() {
    setIsSubmitted(false);
    setCurrentStep(1);
    setDirection("backward");
    setStatus({ type: "", message: "" });
  }

  // Pre-generate WhatsApp message for instant direct action
  const waCustomText = encodeURIComponent(
    `Hi NextGenies! I'm interested in ${formData.serviceName}.\n\n` +
      `• Name: ${formData.fullName || "Partner"}\n` +
      `• Specific Need: ${formData.serviceOptionTitle}\n` +
      `• Scope: ${formData.scopeLabel}\n` +
      `• Timeline: ${formData.timelineLabel}\n` +
      (formData.company ? `• Company: ${formData.company}\n` : "") +
      (formData.phone ? `• Phone: ${formData.phone}\n` : "") +
      (formData.additionalNotes ? `• Notes: ${formData.additionalNotes}\n` : "")
  );
  const waCustomUrl = `https://wa.me/919910880760?text=${waCustomText}`;

  return (
    <>
      <SEO
        title="Contact NextGenies — Interactive Project Questionnaire"
        description="Plan your project with NextGenies. Answer a few quick questions to receive a tailored digital roadmap, pricing quote, and strategic consultation."
        canonicalPath="/contact"
      />
      <Navbar />

      <main className="contact-page">
        <header className="contact-heading">
          <div className="section-label">Interactive Project Planner</div>
          <h1 className="contact-form-title">Tell Us About Your Project</h1>
          <p className="contact-hero-sub">
            Answer a few quick questions to receive a tailored strategy, project scope, and custom proposal.
          </p>
        </header>

        <section className="contact-grid">
          {/* Main Interactive Questionnaire Card */}
          <div className="questionnaire-card contact-form-card" style={{ display: "block", width: "100%" }}>
            {!isSubmitted ? (
              <div className="questionnaire-container" style={{ display: "block", width: "100%" }}>
                {/* Progress Header */}
                <header className="quest-progress-header">
                  <div className="quest-progress-meta">
                    <div className="quest-step-badge">
                      <span className="quest-badge-dot" />
                      Step {currentStep} of 5
                    </div>
                    <span className="quest-step-title-hint">
                      {STEP_TITLES[currentStep - 1]}
                    </span>
                  </div>

                  {/* Visual Progress Bar */}
                  <div className="quest-progress-track" role="progressbar" aria-valuenow={(currentStep / 5) * 100} aria-valuemin="0" aria-valuemax="100">
                    <div
                      className="quest-progress-fill"
                      style={{ width: `${(currentStep / 5) * 100}%` }}
                    />
                  </div>

                  {/* Answer History / Breadcrumbs Trail: previous cards move into progress indicator */}
                  <nav className="quest-history-trail" aria-label="Completed Steps">
                    {currentStep > 1 && formData.fullName && (
                      <button
                        type="button"
                        className="quest-history-chip"
                        onClick={() => goToStep(1)}
                        title="Click to edit basic details"
                      >
                        <span className="quest-history-check">✓</span>
                        <span className="quest-history-label">Contact: </span>
                        <span className="quest-history-text">{formData.fullName}</span>
                      </button>
                    )}
                    {currentStep > 2 && (
                      <button
                        type="button"
                        className="quest-history-chip"
                        onClick={() => goToStep(2)}
                        title="Click to change service"
                      >
                        <span className="quest-history-check">✓</span>
                        <span className="quest-history-label">Service: </span>
                        <span className="quest-history-text">{formData.serviceName}</span>
                      </button>
                    )}
                    {currentStep > 3 && (
                      <button
                        type="button"
                        className="quest-history-chip"
                        onClick={() => goToStep(3)}
                        title="Click to change requirement"
                      >
                        <span className="quest-history-check">✓</span>
                        <span className="quest-history-label">Need: </span>
                        <span className="quest-history-text">{formData.serviceOptionTitle}</span>
                      </button>
                    )}
                    {currentStep > 4 && (
                      <button
                        type="button"
                        className="quest-history-chip"
                        onClick={() => goToStep(4)}
                        title="Click to change scope or timeline"
                      >
                        <span className="quest-history-check">✓</span>
                        <span className="quest-history-label">Timeline: </span>
                        <span className="quest-history-text">{formData.timelineLabel}</span>
                      </button>
                    )}
                  </nav>
                </header>

                {/* Animated Step Cards */}
                <div className="quest-step-container">
                  {/* Step 1: Basic Contact Details */}
                  {currentStep === 1 && (
                    <form
                      className={`quest-step-card quest-anim-${direction}`}
                      key="step-1"
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleNext();
                      }}
                    >
                      <div className="quest-heading">
                        <h2 className="quest-title">Let's start with the basics</h2>
                        <p className="quest-desc">
                          Tell us who we are creating for and where to send your custom proposal.
                        </p>
                      </div>

                      <div className="quest-form-grid">
                        <div className="quest-field-group">
                          <label className="quest-label" htmlFor="fullName">
                            Full Name *
                          </label>
                          <input
                            id="fullName"
                            name="fullName"
                            type="text"
                            placeholder="Your full name"
                            value={formData.fullName}
                            onChange={handleInputChange}
                            className={`quest-input ${errors.fullName ? "has-error" : ""}`}
                            required
                            autoFocus
                          />
                          {errors.fullName && (
                            <span className="quest-error-text">{errors.fullName}</span>
                          )}
                        </div>

                        <div className="quest-field-group">
                          <label className="quest-label" htmlFor="email">
                            Email Address *
                          </label>
                          <input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="you@company.com"
                            value={formData.email}
                            onChange={handleInputChange}
                            className={`quest-input ${errors.email ? "has-error" : ""}`}
                            required
                          />
                          {errors.email && (
                            <span className="quest-error-text">{errors.email}</span>
                          )}
                        </div>

                        <div className="quest-field-group">
                          <label className="quest-label" htmlFor="company">
                            Company or Brand Name <span className="quest-label-optional">(Optional)</span>
                          </label>
                          <input
                            id="company"
                            name="company"
                            type="text"
                            placeholder="e.g. Acme Studio"
                            value={formData.company}
                            onChange={handleInputChange}
                            className="quest-input"
                          />
                        </div>

                        <div className="quest-field-group">
                          <label className="quest-label" htmlFor="phone">
                            Phone / WhatsApp <span className="quest-label-optional">(Optional, for quick callback)</span>
                          </label>
                          <input
                            id="phone"
                            name="phone"
                            type="tel"
                            placeholder="+91 99108 80760"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className="quest-input"
                          />
                        </div>
                      </div>

                      {/* Hidden submit so Enter key advances cleanly */}
                      <button type="submit" style={{ display: "none" }} aria-hidden="true" />
                    </form>
                  )}

                  {/* Step 2: Service Selection */}
                  {currentStep === 2 && (
                    <div className={`quest-step-card quest-anim-${direction}`} key="step-2">
                      <div className="quest-heading">
                        <h2 className="quest-title">What service do you need?</h2>
                        <p className="quest-desc">
                          Select the primary core capability you want NextGenies to build.
                        </p>
                      </div>

                      <div className="quest-options-grid">
                        {SERVICES.map((service) => {
                          const isSelected = formData.serviceId === service.id;
                          return (
                            <button
                              key={service.id}
                              type="button"
                              className={`quest-option-card ${isSelected ? "selected" : ""}`}
                              onClick={() => handleSelectService(service)}
                            >
                              <div className="quest-option-top-bar">
                                <div className="quest-option-icon">
                                  <AppIcon type={service.icon} />
                                </div>
                                <div className="quest-option-meta-right">
                                  {service.badge && (
                                    <span className="quest-option-badge">{service.badge}</span>
                                  )}
                                  <div className="quest-radio-dot">
                                    {isSelected ? "✓" : ""}
                                  </div>
                                </div>
                              </div>
                              <div className="quest-option-content">
                                <div className="quest-option-title">{service.name}</div>
                                <p className="quest-option-desc">{service.desc}</p>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Step 3: Dynamic Service Deep Dive */}
                  {currentStep === 3 && (
                    <div className={`quest-step-card quest-anim-${direction}`} key="step-3">
                      <div className="quest-heading">
                        <h2 className="quest-title">{currentService.question}</h2>
                        <p className="quest-desc">{currentService.questionDesc}</p>
                      </div>

                      <div className="quest-options-grid">
                        {currentService.options.map((option) => {
                          const isSelected = formData.serviceOptionId === option.id;
                          return (
                            <button
                              key={option.id}
                              type="button"
                              className={`quest-option-card ${isSelected ? "selected" : ""}`}
                              onClick={() => handleSelectOption(option)}
                            >
                              <div className="quest-option-top-bar">
                                <div className="quest-option-icon">
                                  <AppIcon type={option.icon} />
                                </div>
                                <div className="quest-radio-dot">
                                  {isSelected ? "✓" : ""}
                                </div>
                              </div>
                              <div className="quest-option-content">
                                <div className="quest-option-title">{option.title}</div>
                                <p className="quest-option-desc">{option.desc}</p>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Step 4: Technical Scope & Target Timeline */}
                  {currentStep === 4 && (
                    <div className={`quest-step-card quest-anim-${direction}`} key="step-4">
                      <div className="quest-heading">
                        <h2 className="quest-title">{currentService.subQuestionTitle}</h2>
                        <p className="quest-desc">
                          Define your technical preference, budget tier, and estimated kickoff timeline.
                        </p>
                      </div>

                      {/* Scope Options */}
                      <div className="quest-sub-section">
                        <label className="quest-sub-label">Technical / Scope Preference</label>
                        <div className="quest-options-grid">
                          {currentService.scopeOptions.map((scope) => {
                            const isSelected = formData.scopeId === scope.id;
                            return (
                              <button
                                key={scope.id}
                                type="button"
                                className={`quest-option-card quest-scope-card ${isSelected ? "selected" : ""}`}
                                onClick={() => handleSelectScope(scope)}
                              >
                                <div className="quest-option-top-bar">
                                  <span className="quest-option-title">{scope.label}</span>
                                  <div className="quest-radio-dot">
                                    {isSelected ? "✓" : ""}
                                  </div>
                                </div>
                                <p className="quest-option-desc">{scope.desc}</p>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Timeline Options */}
                      <div className="quest-sub-section">
                        <label className="quest-sub-label">Target Launch Timeline</label>
                        <div className="quest-timeline-grid">
                          {TIMELINE_OPTIONS.map((item) => {
                            const isSelected = formData.timelineId === item.id;
                            return (
                              <button
                                key={item.id}
                                type="button"
                                className={`quest-timeline-card ${isSelected ? "selected" : ""}`}
                                onClick={() => handleSelectTimeline(item)}
                              >
                                <div className="quest-timeline-top">
                                  <span className="quest-timeline-title">{item.label}</span>
                                  <div className="quest-radio-dot">
                                    {isSelected ? "✓" : ""}
                                  </div>
                                </div>
                                <div className="quest-timeline-desc">{item.desc}</div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 5: Summary & Submission Card */}
                  {currentStep === 5 && (
                    <div className={`quest-step-card quest-anim-${direction}`} key="step-5">
                      <div className="quest-heading">
                        <h2 className="quest-title">Summary of Your Project Request</h2>
                        <p className="quest-desc">
                          Review your selected requirements below. You can quickly edit any section before submitting.
                        </p>
                      </div>

                      {/* Structured Summary Table */}
                      <div className="quest-summary-card">
                        <div className="quest-summary-row">
                          <div className="quest-summary-label-wrap">
                            <span className="quest-row-icon" aria-hidden="true">👤</span>
                            <span className="quest-summary-label">Client Details</span>
                          </div>
                          <div className="quest-summary-content">
                            <span className="quest-summary-value">
                              {formData.fullName} • {formData.email}
                              {formData.company ? ` • ${formData.company}` : ""}
                              {formData.phone ? ` • ${formData.phone}` : ""}
                            </span>
                            <button
                              type="button"
                              className="quest-summary-edit-btn"
                              onClick={() => goToStep(1)}
                            >
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                <path d="M12 20h9" />
                                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                              </svg>
                              <span>Edit</span>
                            </button>
                          </div>
                        </div>

                        <div className="quest-summary-row">
                          <div className="quest-summary-label-wrap">
                            <span className="quest-row-icon" aria-hidden="true">🚀</span>
                            <span className="quest-summary-label">Primary Service</span>
                          </div>
                          <div className="quest-summary-content">
                            <span className="quest-summary-value">{formData.serviceName}</span>
                            <button
                              type="button"
                              className="quest-summary-edit-btn"
                              onClick={() => goToStep(2)}
                            >
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                <path d="M12 20h9" />
                                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                              </svg>
                              <span>Edit</span>
                            </button>
                          </div>
                        </div>

                        <div className="quest-summary-row">
                          <div className="quest-summary-label-wrap">
                            <span className="quest-row-icon" aria-hidden="true">🎯</span>
                            <span className="quest-summary-label">Specific Need</span>
                          </div>
                          <div className="quest-summary-content">
                            <span className="quest-summary-value">{formData.serviceOptionTitle}</span>
                            <button
                              type="button"
                              className="quest-summary-edit-btn"
                              onClick={() => goToStep(3)}
                            >
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                <path d="M12 20h9" />
                                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                              </svg>
                              <span>Edit</span>
                            </button>
                          </div>
                        </div>

                        <div className="quest-summary-row">
                          <div className="quest-summary-label-wrap">
                            <span className="quest-row-icon" aria-hidden="true">⚙️</span>
                            <span className="quest-summary-label">Scope / Preference</span>
                          </div>
                          <div className="quest-summary-content">
                            <span className="quest-summary-value">{formData.scopeLabel}</span>
                            <button
                              type="button"
                              className="quest-summary-edit-btn"
                              onClick={() => goToStep(4)}
                            >
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                <path d="M12 20h9" />
                                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                              </svg>
                              <span>Edit</span>
                            </button>
                          </div>
                        </div>

                        <div className="quest-summary-row">
                          <div className="quest-summary-label-wrap">
                            <span className="quest-row-icon" aria-hidden="true">⏱️</span>
                            <span className="quest-summary-label">Target Timeline</span>
                          </div>
                          <div className="quest-summary-content">
                            <span className="quest-summary-value">{formData.timelineLabel}</span>
                            <button
                              type="button"
                              className="quest-summary-edit-btn"
                              onClick={() => goToStep(4)}
                            >
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                <path d="M12 20h9" />
                                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                              </svg>
                              <span>Edit</span>
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Additional Notes */}
                      <div className="quest-field-group">
                        <label className="quest-label" htmlFor="additionalNotes">
                          Additional Project Notes, Links, or Goals <span className="quest-label-optional">(Optional)</span>
                        </label>
                        <textarea
                          id="additionalNotes"
                          name="additionalNotes"
                          className="quest-input quest-notes-area"
                          placeholder="Tell us about existing links, design inspiration, or specific milestones..."
                          value={formData.additionalNotes}
                          onChange={handleInputChange}
                        />
                      </div>

                      {status.message && (
                        <div
                          role="alert"
                          className={`form-status ${
                            status.type === "error" ? "form-error" : "form-success"
                          }`}
                          style={{ marginTop: "16px" }}
                        >
                          {status.message}
                          {status.type === "error" && (
                            <div style={{ marginTop: "8px" }}>
                              <a
                                href={waCustomUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                  color: "#60a5fa",
                                  textDecoration: "underline",
                                  fontWeight: 600,
                                }}
                              >
                                Send directly via WhatsApp instead →
                              </a>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Bottom Navigation Actions */}
                <footer className="quest-actions">
                  {currentStep > 1 ? (
                    <button
                      type="button"
                      className="quest-btn-back"
                      onClick={handleBack}
                      disabled={isSubmitting}
                    >
                      ← Back
                    </button>
                  ) : <div />}

                  {currentStep < 5 ? (
                    <button
                      type="button"
                      className="quest-btn-next"
                      onClick={handleNext}
                    >
                      Continue →
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="quest-btn-next quest-submit-cta"
                      onClick={handleSubmitProject}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Submitting Request..." : "Submit Project Request →"}
                    </button>
                  )}
                </footer>
              </div>
            ) : (
              /* Success / Confirmation Card */
              <div className="quest-success-view">
                <div className="quest-success-icon-wrap">
                  <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <h2 className="quest-success-title">Project Request Submitted!</h2>
                <p className="quest-success-desc">
                  Thank you, <strong>{formData.fullName}</strong>! We have received your detailed requirements for{" "}
                  <strong>{formData.serviceName}</strong>. Our team is already reviewing your brief and will respond within 24 hours.
                </p>

                <div className="quest-success-recap">
                  <div className="quest-recap-title">Request Summary</div>
                  <div className="quest-recap-item">
                    <span>📌</span>
                    <span>Service: <strong>{formData.serviceName}</strong> ({formData.serviceOptionTitle})</span>
                  </div>
                  <div className="quest-recap-item">
                    <span>⏱️</span>
                    <span>Timeline: <strong>{formData.timelineLabel}</strong></span>
                  </div>
                  <div className="quest-recap-item">
                    <span>📬</span>
                    <span>Proposal sent to: <strong>{formData.email}</strong></span>
                  </div>
                </div>

                <div className="quest-success-btns">
                  <a
                    className="quest-wa-instant-btn"
                    href={waCustomUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span>Chat on WhatsApp for Fast-Track Reply</span>
                    <span>→</span>
                  </a>
                  <button
                    type="button"
                    className="quest-restart-btn"
                    onClick={handleReset}
                  >
                    Start a New Inquiry
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Existing Contact Info Aside */}
          <aside className="contact-info">
            <p className="contact-response">
              We typically respond within <strong>24 hours.</strong> For urgent queries, reach us directly on WhatsApp.
            </p>

            <a className="wa-cta" href="https://wa.me/919910880760" target="_blank" rel="noopener noreferrer">
              <span className="wa-circle">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12.04 2.03A9.92 9.92 0 0 0 3.5 17.02L2.1 22l5.08-1.34a9.94 9.94 0 1 0 4.86-18.63Zm.01 1.79a8.15 8.15 0 0 1 6.9 12.48 8.1 8.1 0 0 1-10.96 2.55l-.36-.22-3.02.8.81-2.94-.24-.38A8.15 8.15 0 0 1 12.05 3.82Zm-3.49 4.1c-.18 0-.47.07-.72.34-.25.27-.94.92-.94 2.24 0 1.32.97 2.6 1.1 2.78.13.18 1.87 2.99 4.63 4.07 2.3.91 2.77.73 3.27.68.5-.05 1.62-.66 1.85-1.3.23-.64.23-1.18.16-1.3-.07-.11-.25-.18-.52-.31-.27-.13-1.62-.8-1.87-.89-.25-.09-.43-.13-.61.13-.18.27-.7.89-.86 1.07-.16.18-.32.2-.59.07-.27-.13-1.15-.42-2.19-1.35-.81-.72-1.36-1.61-1.52-1.88-.16-.27-.02-.41.12-.54.12-.12.27-.32.41-.48.13-.16.18-.27.27-.45.09-.18.04-.34-.02-.48-.07-.13-.61-1.47-.84-2.01-.22-.52-.44-.45-.61-.46h-.52Z" />
                </svg>
              </span>
              <span>
                <span className="wa-label">Chat on WhatsApp</span>
                <span className="wa-sub">+91 99108 80760 · Typically replies in minutes</span>
              </span>
            </a>

            <div className="contact-block">
              <div className="contact-block-title">Phone</div>
              <a className="contact-block-val" href="tel:+919910880760" style={{ textDecoration: "none", color: "inherit", display: "inline-block" }}>
                +91 99108 80760
              </a>
            </div>

            <div className="contact-block">
              <div className="contact-block-title">Email</div>
              <a className="contact-block-val" href="mailto:nextgenies.team@gmail.com" style={{ textDecoration: "none", color: "inherit", display: "inline-block" }}>
                nextgenies.team@gmail.com
              </a>
            </div>

            <div className="contact-block">
              <div className="contact-block-title">Location</div>
              <div className="contact-block-val">
                India — Remote-First. We work with brands globally.
              </div>
            </div>

            <div className="contact-block">
              <div className="contact-block-title">Working Hours</div>
              <div className="contact-block-val">Mon-Sat, 10am-8pm IST</div>
            </div>

            <div className="contact-block contact-help-card">
              <div className="contact-block-title">Not sure what you need?</div>
              <p className="contact-block-val">
                Book a free 20-minute discovery call. We'll understand your business and suggest what would actually move the needle.
              </p>
              <a className="contact-call-btn" href="https://wa.me/919910880760" target="_blank" rel="noopener noreferrer">
                Book Free Call
              </a>
            </div>
          </aside>
        </section>
      </main>

      <Footer />
    </>
  );
}

// Crisp inline SVG icon set for questionnaire cards
function AppIcon({ type }) {
  const iconMap = {
    code: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    ),
    trending: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
        <polyline points="17 6 23 6 23 12" />
      </svg>
    ),
    video: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="23 7 16 12 23 17 23 7" />
        <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
      </svg>
    ),
    cpu: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="4" width="16" height="16" rx="2" />
        <rect x="9" y="9" width="6" height="6" />
        <line x1="9" y1="1" x2="9" y2="4" />
        <line x1="15" y1="1" x2="15" y2="4" />
        <line x1="9" y1="20" x2="9" y2="23" />
        <line x1="15" y1="20" x2="15" y2="23" />
        <line x1="20" y1="9" x2="23" y2="9" />
        <line x1="20" y1="14" x2="23" y2="14" />
        <line x1="1" y1="9" x2="4" y2="9" />
        <line x1="1" y1="14" x2="4" y2="14" />
      </svg>
    ),
    shield: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    share: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="18" cy="5" r="3" />
        <circle cx="6" cy="12" r="3" />
        <circle cx="18" cy="19" r="3" />
        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
      </svg>
    ),
    building: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
        <line x1="9" y1="22" x2="9" y2="22.01" />
        <line x1="15" y1="22" x2="15" y2="22.01" />
        <line x1="9" y1="6" x2="9" y2="6.01" />
        <line x1="15" y1="6" x2="15" y2="6.01" />
        <line x1="9" y1="10" x2="9" y2="10.01" />
        <line x1="15" y1="10" x2="15" y2="10.01" />
        <line x1="9" y1="14" x2="9" y2="14.01" />
        <line x1="15" y1="14" x2="15" y2="14.01" />
        <line x1="9" y1="18" x2="9" y2="18.01" />
        <line x1="15" y1="18" x2="15" y2="18.01" />
      </svg>
    ),
    cart: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="21" r="1" />
        <circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
      </svg>
    ),
    user: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
    layers: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 2 7 12 12 22 7 12 2" />
        <polyline points="2 17 12 22 22 17" />
        <polyline points="2 12 12 17 22 12" />
      </svg>
    ),
    zap: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
    refresh: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="23 4 23 10 17 10" />
        <polyline points="1 20 1 14 7 14" />
        <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
      </svg>
    ),
    target: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="6" />
        <circle cx="12" cy="12" r="2" />
      </svg>
    ),
    search: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    ),
    megaphone: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
      </svg>
    ),
    chart: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    ),
    compass: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
      </svg>
    ),
    film: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18" />
        <line x1="7" y1="2" x2="7" y2="22" />
        <line x1="17" y1="2" x2="17" y2="22" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <line x1="2" y1="7" x2="7" y2="7" />
        <line x1="2" y1="17" x2="7" y2="17" />
        <line x1="17" y1="17" x2="22" y2="17" />
        <line x1="17" y1="7" x2="22" y2="7" />
      </svg>
    ),
    image: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <polyline points="21 15 16 10 5 21" />
      </svg>
    ),
    edit: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
      </svg>
    ),
    mic: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
        <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
        <line x1="12" y1="19" x2="12" y2="23" />
        <line x1="8" y1="23" x2="16" y2="23" />
      </svg>
    ),
    box: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
        <line x1="12" y1="22.08" x2="12" y2="12" />
      </svg>
    ),
    message: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
    book: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      </svg>
    ),
    sparkles: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
      </svg>
    ),
  };

  return iconMap[type] || iconMap.code;
}

export default Contact;
