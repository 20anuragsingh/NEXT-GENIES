import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import SEO from "../components/SEO";
import { breadcrumbLd } from "../lib/seoHelpers";
import Icon from "../components/Icon";
import { SERVICES, TIMELINE_OPTIONS } from "../data/questionnaire";
import { api, formatWait } from "../lib/api";
import { CONTACT } from "../lib/site";
import { useCountdown } from "../hooks/useReveal";
import { metaFor } from "../seo/routes";
import { trackEvent } from "../lib/analytics";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Limits mirror the backend validation in POST /api/contacts.
const LIMITS = { name: 100, email: 255, phone: 50, company: 150, notes: 12000 };

const DRAFT_KEY = "ng-contact-draft";

const readDraft = () => {
  try {
    const raw = sessionStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

const STEPS = ["name", "email", "reach", "service", "need", "scope", "timeline", "notes", "review"];

const initial = {
  fullName: "",
  email: "",
  phone: "",
  company: "",
  serviceId: "",
  serviceName: "",
  needId: "",
  needTitle: "",
  scopeId: "",
  scopeLabel: "",
  timelineId: "",
  timelineLabel: "",
  notes: "",
};

export default function Contact() {
  const meta = metaFor("/contact");
  const draft = useMemo(() => readDraft(), []);
  const [step, setStep] = useState(() => (typeof draft?.step === "number" ? Math.min(STEPS.length - 1, draft.step) : 0));
  const [dir, setDir] = useState("fwd");
  const [data, setData] = useState(() => (draft?.data ? { ...initial, ...draft.data } : initial));
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [failure, setFailure] = useState(null); // { message, retryAfter }
  const [cooldown, startCooldown] = useCountdown();
  const cardRef = useRef(null);
  const timer = useRef(null);
  const started = useRef(false);

  const service = useMemo(() => SERVICES.find((s) => s.id === data.serviceId), [data.serviceId]);
  const key = STEPS[step];
  const total = STEPS.length;

  useEffect(() => () => clearTimeout(timer.current), []);

  // Persist form draft so accidental page refresh doesn't wipe progress
  useEffect(() => {
    if (done) {
      try {
        sessionStorage.removeItem(DRAFT_KEY);
      } catch {
        /* ignore */
      }
      return;
    }
    const hasData = Object.values(data).some(Boolean);
    if (hasData) {
      try {
        sessionStorage.setItem(DRAFT_KEY, JSON.stringify({ data, step }));
      } catch {
        /* ignore */
      }
    }
  }, [data, step, done]);

  // Move focus into the new card so keyboard / screen-reader users follow the flow.
  useEffect(() => {
    const el = cardRef.current?.querySelector("input, textarea, [data-autofocus]");
    el?.focus({ preventScroll: true });
  }, [step, done]);

  const set = (patch) => {
    setData((d) => ({ ...d, ...patch }));
    setError("");
  };

  const validate = useCallback(
    (k) => {
      if (k === "name") {
        const v = data.fullName.trim();
        if (v.length < 2) return "Please tell us your name.";
      }
      if (k === "email") {
        const v = data.email.trim();
        if (!EMAIL_RE.test(v)) return "Please enter a valid email address.";
      }
      if (k === "service" && !data.serviceId) return "Pick the service you're interested in.";
      if (k === "need" && !data.needId) return "Pick what fits best.";
      if (k === "scope" && !data.scopeId) return "Choose one option to continue.";
      if (k === "timeline" && !data.timelineId) return "Choose a timeline.";
      return "";
    },
    [data],
  );

  const go = useCallback((to, direction) => {
    clearTimeout(timer.current);
    setDir(direction);
    setStep(to);
    setError("");
  }, []);

  const next = useCallback(() => {
    const problem = validate(key);
    if (problem) {
      trackEvent("contact_form_validation_error", { step: key });
      return setError(problem);
    }
    if (step < total - 1) go(step + 1, "fwd");
  }, [validate, key, step, total, go]);

  const back = () => step > 0 && go(step - 1, "back");

  // Auto-advance after choosing a card (short delay so the selection animation is visible).
  const choose = (patch) => {
    set(patch);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      setDir("fwd");
      setStep((s) => Math.min(total - 1, s + 1));
    }, 280);
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter" && e.target.tagName === "INPUT" && key !== "review") {
      e.preventDefault();
      next();
    }
  };

  const summary = () =>
    [
      "Project Questionnaire Submission:",
      `• Client Name: ${data.fullName.trim()}`,
      `• Email: ${data.email.trim()}`,
      data.phone.trim() ? `• Phone / WhatsApp: ${data.phone.trim()}` : null,
      data.company.trim() ? `• Company / Brand: ${data.company.trim()}` : null,
      `• Selected Service: ${data.serviceName}`,
      `• Specific Need: ${data.needTitle}`,
      `• Technical / Scope Preference: ${data.scopeLabel}`,
      `• Target Timeline: ${data.timelineLabel}`,
      data.notes.trim() ? `\nClient Additional Notes:\n${data.notes.trim()}` : null,
    ]
      .filter(Boolean)
      .join("\n");

  async function submit() {
    // re-validate everything (the user may have jumped back and cleared something)
    for (let i = 0; i < STEPS.length - 1; i++) {
      const problem = validate(STEPS[i]);
      if (problem) {
        go(i, "back");
        setError(problem);
        return;
      }
    }
    setSubmitting(true);
    setFailure(null);
    trackEvent("contact_form_submit_attempt", { service: data.serviceName || "unspecified" });
    try {
      // Same payload the backend has always received from this form.
      await api.sendContact({
        fullName: data.fullName.trim(),
        email: data.email.trim(),
        phone: data.phone.trim() || "Not provided",
        company: data.company.trim(),
        service: data.serviceName,
        needOption: data.needTitle,
        scopePreference: data.scopeLabel,
        timeline: data.timelineLabel,
        message: summary(),
      });
      setDone(true);
      trackEvent("contact_form_submit_success", { service: data.serviceName || "unspecified" });
    } catch (err) {
      if (err.isRateLimited) startCooldown(err.retryAfter || 900);
      setFailure({ message: err.message, rateLimited: err.isRateLimited });
      trackEvent("contact_form_submit_failure", { service: data.serviceName || "unspecified", rate_limited: Boolean(err.isRateLimited) });
    } finally {
      setSubmitting(false);
    }
  }

  function reset() {
    setData(initial);
    setDone(false);
    setFailure(null);
    setStep(0);
    setDir("back");
    try {
      sessionStorage.removeItem(DRAFT_KEY);
    } catch {
      /* ignore */
    }
  }

  const onFormInteraction = () => {
    if (started.current) return;
    started.current = true;
    trackEvent("contact_form_start");
  };

  const waUrl = `${CONTACT.whatsapp}?text=${encodeURIComponent(
    `Hi NextGenies! I'm interested in ${data.serviceName || "your services"}.\n` +
      (data.fullName ? `• Name: ${data.fullName}\n` : "") +
      (data.needTitle ? `• Need: ${data.needTitle}\n` : "") +
      (data.scopeLabel ? `• Scope: ${data.scopeLabel}\n` : "") +
      (data.timelineLabel ? `• Timeline: ${data.timelineLabel}\n` : "") +
      (data.notes ? `• Notes: ${data.notes}\n` : ""),
  )}`;

  const answers = [
    { at: 0, label: "Name", value: data.fullName.trim() },
    { at: 1, label: "Email", value: data.email.trim() },
    { at: 2, label: "Reach", value: [data.phone.trim(), data.company.trim()].filter(Boolean).join(" · ") },
    { at: 3, label: "Service", value: data.serviceName },
    { at: 4, label: "Need", value: data.needTitle },
    { at: 5, label: "Scope", value: data.scopeLabel },
    { at: 6, label: "Timeline", value: data.timelineLabel },
  ].filter((a) => a.value && a.at < step);

  return (
    <>
      <SEO
        title={meta.title}
        description={meta.description}
        path="/contact"
        jsonLd={[
          breadcrumbLd([{ name: "Home", path: "/" }, { name: "Contact", path: "/contact" }]),
          {
            "@context": "https://schema.org",
            "@type": "ContactPage",
            name: "Contact NextGenies",
            mainEntity: { "@type": "Organization", name: "NextGenies", email: CONTACT.email, telephone: CONTACT.phone },
          },
        ]}
      />

      <main className="container contact">
        <header className="contact-head">
          <span className="eyebrow">Start a project</span>
          <h1 className="h1">Let's build something <span className="accent-text">together</span>.</h1>
          <p className="lead">Answer a few quick questions, one card at a time. Takes about a minute.</p>
          <p className="contact-quick">
            Prefer a direct conversation?{" "}
            <a href={CONTACT.whatsapp} target="_blank" rel="noopener noreferrer">WhatsApp us directly →</a>
            {" or "}
            <a href={`mailto:${CONTACT.email}`}>email our team</a>.
          </p>
        </header>

        <div className="contact-layout">
          <aside className="trail" aria-label="Your answers so far">
            {answers.length === 0 && !done && <p className="muted trail-empty">Your answers will appear here.</p>}
            {answers.map((a) => (
              <button key={a.label} type="button" className="trail-chip glass" onClick={() => go(a.at, "back")} title="Edit this answer">
                <small>{a.label}</small>
                <span>{a.value}</span>
              </button>
            ))}
          </aside>

          <section className="deck" aria-live="polite" onFocusCapture={onFormInteraction} onPointerDownCapture={onFormInteraction}>
            {!done && (
              <>
                <div className="deck-progress" role="progressbar" aria-valuemin={1} aria-valuemax={total} aria-valuenow={step + 1} aria-label="Form progress">
                  <i style={{ transform: `scaleX(${(step + 1) / total})` }} />
                </div>
                <div className="deck-count">Step {step + 1} of {total}</div>
              </>
            )}

            <div className="deck-stack">
              <span className="deck-ghost g2" aria-hidden="true" />
              <span className="deck-ghost g1" aria-hidden="true" />

              {done ? (
                <div className="q-card neu-raised success" key="done">
                  <div className="check" aria-hidden="true">
                    <svg viewBox="0 0 52 52"><circle cx="26" cy="26" r="24" /><path d="m15 27 8 8 15-17" /></svg>
                  </div>
                  <h2 className="h2">Thank you, {data.fullName.trim().split(" ")[0]}!</h2>
                  <p className="lead">We received your brief for <strong>{data.serviceName}</strong> and will get back to you shortly.</p>
                  <div className="btn-row center">
                    <a className="btn btn-primary" href={waUrl} target="_blank" rel="noopener noreferrer">Continue on WhatsApp</a>
                    <button type="button" className="btn btn-neu" onClick={reset}>Send another</button>
                  </div>
                </div>
              ) : (
                <div className={`q-card neu-raised ${dir}`} key={key} ref={cardRef} onKeyDown={onKeyDown}>
                  {key === "name" && (
                    <Field label="What should we call you?" hint="Your full name" error={error}>
                      <input className="input" autoComplete="name" maxLength={LIMITS.name} value={data.fullName} onChange={(e) => set({ fullName: e.target.value })} placeholder="e.g. Aarav Sharma" />
                    </Field>
                  )}

                  {key === "email" && (
                    <Field label={`Nice to meet you${data.fullName.trim() ? ", " + data.fullName.trim().split(" ")[0] : ""}.`} hint="Where can we send our reply?" error={error}>
                      <input className="input" type="email" inputMode="email" autoComplete="email" maxLength={LIMITS.email} value={data.email} onChange={(e) => set({ email: e.target.value })} placeholder="you@company.com" />
                    </Field>
                  )}

                  {key === "reach" && (
                    <>
                      <h2 className="q-title">Anything else to reach you?</h2>
                      <p className="q-hint">Both optional. WhatsApp is the fastest way to talk.</p>
                      <div className="two-col">
                        <label className="field">
                          <span>Phone / WhatsApp</span>
                          <input className="input" type="tel" inputMode="tel" autoComplete="tel" maxLength={LIMITS.phone} value={data.phone} onChange={(e) => set({ phone: e.target.value })} placeholder="+91 …" />
                        </label>
                        <label className="field">
                          <span>Company / brand</span>
                          <input className="input" autoComplete="organization" maxLength={LIMITS.company} value={data.company} onChange={(e) => set({ company: e.target.value })} placeholder="Your brand" />
                        </label>
                      </div>
                    </>
                  )}

                  {key === "service" && (
                    <>
                      <h2 className="q-title">What service do you need?</h2>
                      <p className="q-hint">Pick the closest match, we'll fine-tune next.</p>
                      <Options
                        items={SERVICES.map((s) => ({ id: s.id, title: s.name, desc: s.desc, icon: s.icon, badge: s.badge }))}
                        value={data.serviceId}
                        onPick={(o) => {
                          const s = SERVICES.find((x) => x.id === o.id);
                          choose({
                            serviceId: s.id,
                            serviceName: s.name,
                            // reset dependent answers when the service changes
                            needId: s.id === data.serviceId ? data.needId : "",
                            needTitle: s.id === data.serviceId ? data.needTitle : "",
                            scopeId: s.id === data.serviceId ? data.scopeId : "",
                            scopeLabel: s.id === data.serviceId ? data.scopeLabel : "",
                          });
                        }}
                      />
                    </>
                  )}

                  {key === "need" && service && (
                    <>
                      <h2 className="q-title">{service.question}</h2>
                      <p className="q-hint">{service.questionDesc}</p>
                      <Options items={service.options} value={data.needId} onPick={(o) => choose({ needId: o.id, needTitle: o.title })} />
                    </>
                  )}

                  {key === "scope" && service && (
                    <>
                      <h2 className="q-title">{service.subQuestionTitle}</h2>
                      <p className="q-hint">Helps us scope the right plan.</p>
                      <Options items={service.scopeOptions.map((s) => ({ ...s, title: s.label }))} value={data.scopeId} onPick={(o) => choose({ scopeId: o.id, scopeLabel: o.title })} />
                    </>
                  )}

                  {key === "timeline" && (
                    <>
                      <h2 className="q-title">When would you like to start?</h2>
                      <p className="q-hint">An estimate is fine.</p>
                      <Options items={TIMELINE_OPTIONS.map((t) => ({ ...t, title: t.label }))} value={data.timelineId} onPick={(o) => choose({ timelineId: o.id, timelineLabel: o.title })} compact />
                    </>
                  )}

                  {key === "notes" && (
                    <Field label="Anything we should know?" hint="Goals, links, references, budget… optional." error={error}>
                      <textarea className="input" rows={5} maxLength={LIMITS.notes} value={data.notes} onChange={(e) => set({ notes: e.target.value })} placeholder="Tell us a little about the project" />
                    </Field>
                  )}

                  {key === "review" && (
                    <>
                      <h2 className="q-title">Looks good?</h2>
                      <p className="q-hint">Review your brief, then send it over.</p>
                      <dl className="review">
                        {[
                          ["Name", data.fullName.trim()],
                          ["Email", data.email.trim()],
                          ["Phone", data.phone.trim()],
                          ["Company", data.company.trim()],
                          ["Service", data.serviceName],
                          ["Need", data.needTitle],
                          ["Scope", data.scopeLabel],
                          ["Timeline", data.timelineLabel],
                          ["Notes", data.notes.trim()],
                        ]
                          .filter(([, v]) => v)
                          .map(([k, v]) => (
                            <div key={k}><dt>{k}</dt><dd>{v}</dd></div>
                          ))}
                      </dl>
                      {failure && (
                        <div className="alert error" role="alert">
                          <strong>{failure.rateLimited ? "Slow down a little" : "Couldn't send"}</strong>
                          <span>
                            {failure.message}
                            {failure.rateLimited && cooldown > 0 && ` You can try again in ${formatWait(cooldown)}.`}
                          </span>
                          <a href={waUrl} target="_blank" rel="noopener noreferrer">Send this brief on WhatsApp instead →</a>
                        </div>
                      )}
                    </>
                  )}

                  {error && !["name", "email", "notes"].includes(key) && <p className="field-error" role="alert">{error}</p>}

                  <div className="q-actions">
                    <button type="button" className="btn btn-neu" onClick={back} disabled={step === 0 || submitting}>← Back</button>
                    {key === "review" ? (
                      <button type="button" className="btn btn-primary" onClick={submit} disabled={submitting || cooldown > 0}>
                        {submitting ? "Sending…" : cooldown > 0 ? `Wait ${formatWait(cooldown)}` : "Send brief →"}
                      </button>
                    ) : (
                      <button type="button" className="btn btn-primary" onClick={next}>
                        {["reach", "notes"].includes(key) && !(key === "reach" ? data.phone || data.company : data.notes) ? "Skip →" : "Continue →"}
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            <p className="deck-foot">
              Prefer to talk? <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a> · <a href={CONTACT.whatsapp} target="_blank" rel="noopener noreferrer">WhatsApp</a>
            </p>
          </section>
        </div>
      </main>
    </>
  );
}

function Field({ label, hint, error, children }) {
  return (
    <div className="field-block">
      <h2 className="q-title">{label}</h2>
      <p className="q-hint">{hint}</p>
      {children}
      {error && <p className="field-error" role="alert">{error}</p>}
    </div>
  );
}

function Options({ items, value, onPick, compact = false }) {
  return (
    <div className={`options${compact ? " compact" : ""}`} role="radiogroup">
      {items.map((o, i) => {
        const selected = value === o.id;
        return (
          <button
            key={o.id}
            type="button"
            role="radio"
            aria-checked={selected}
            data-autofocus={selected || (!value && i === 0) ? "" : undefined}
            className={`opt${selected ? " selected" : ""}`}
            style={{ "--i": i }}
            onClick={() => onPick(o)}
          >
            {o.icon && <span className="icon-chip neu-inset"><Icon type={o.icon} size={18} /></span>}
            <span className="opt-body">
              <span className="opt-title">{o.title}{o.badge && <em>{o.badge}</em>}</span>
              {o.desc && <span className="opt-desc">{o.desc}</span>}
            </span>
          </button>
        );
      })}
    </div>
  );
}
