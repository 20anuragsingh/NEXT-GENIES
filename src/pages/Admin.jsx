import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import SEO from "../components/SEO";
import { api, formatWait } from "../lib/api";
import { clearToken, loadToken, saveToken, tokenExpiry } from "../lib/auth";
import { formatDate, mediaUrl } from "../lib/site";
import { useCountdown } from "../hooks/useReveal";

const LIMITS = { title: 180, slug: 180, description: 320, content: 50000, author: 100 };
const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_IMAGE = 5 * 1024 * 1024;
const emptyForm = { title: "", slug: "", description: "", content: "", author: "NextGenies", isPublished: true };

/* ───────────────────────── Login ───────────────────────── */
function Login({ onLogin, notice }) {
  const [creds, setCreds] = useState({ username: "", password: "" });
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(notice || "");
  const [fails, setFails] = useState(0);
  const [remaining, startWait] = useCountdown();

  async function submit(e) {
    e.preventDefault();
    if (remaining > 0 || busy) return;
    setBusy(true);
    setError("");
    try {
      const { token } = await api.admin.login({ username: creds.username.trim(), password: creds.password });
      saveToken(token);
      onLogin(token);
    } catch (err) {
      const nextFails = fails + 1;
      setFails(nextFails);
      setCreds((c) => ({ ...c, password: "" }));
      if (err.isRateLimited) {
        startWait(err.retryAfter || 900);
        setError(err.message);
      } else {
        setError(err.isUnauthorized ? "Invalid username or password." : err.message);
        // UI-only brake on top of the server-side limiter: 5 misses → 30s pause.
        if (nextFails % 5 === 0) startWait(30);
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="admin-login">
      <SEO title="Admin" description="Private area." path="/admin" robots="noindex, nofollow" />
      <form className="login-card neu-raised" onSubmit={submit} autoComplete="on">
        <span className="eyebrow">Private workspace</span>
        <h1 className="h2">Admin sign in</h1>
        <p className="muted">Sign in to manage leads and insights.</p>

        <label className="field">
          <span>Username</span>
          <input className="input" name="username" autoComplete="username" value={creds.username} onChange={(e) => setCreds({ ...creds, username: e.target.value })} required autoFocus />
        </label>
        <label className="field">
          <span>Password</span>
          <div className="pw">
            <input className="input" name="password" type={show ? "text" : "password"} autoComplete="current-password" value={creds.password} onChange={(e) => setCreds({ ...creds, password: e.target.value })} required />
            <button type="button" className="pw-toggle" onClick={() => setShow((v) => !v)} aria-label={show ? "Hide password" : "Show password"}>{show ? "Hide" : "Show"}</button>
          </div>
        </label>

        {error && <p className="alert error" role="alert">{error}{remaining > 0 && ` Try again in ${formatWait(remaining)}.`}</p>}

        <button className="btn btn-primary" type="submit" disabled={busy || remaining > 0}>
          {busy ? "Signing in…" : remaining > 0 ? `Locked · ${formatWait(remaining)}` : "Sign in"}
        </button>
        <Link to="/" className="back-home">← Back to website</Link>
      </form>
    </main>
  );
}

/* ───────────────────────── Dashboard ───────────────────────── */
function Dashboard({ token, onLogout, onExpired }) {
  const [tab, setTab] = useState("leads");
  const [leads, setLeads] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [q, setQ] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState({ type: "", text: "" });
  const [fileKey, setFileKey] = useState(0);

  const guard = useCallback(
    (err) => {
      if (err.isUnauthorized) {
        onExpired("Your admin session has expired. Please sign in again.");
        return true;
      }
      return false;
    },
    [onExpired],
  );

  const [reloadKey, setReloadKey] = useState(0);
  const refresh = () => {
    setLoading(true);
    setLoadError("");
    setReloadKey((k) => k + 1);
  };

  useEffect(() => {
    let cancelled = false;
    Promise.all([api.admin.contacts(token), api.admin.blogs(token)])
      .then(([l, b]) => {
        if (cancelled) return;
        setLeads(Array.isArray(l) ? l : []);
        setBlogs(Array.isArray(b) ? b : []);
        setLoading(false);
      })
      .catch((err) => {
        if (cancelled) return;
        if (!guard(err)) setLoadError(err.message);
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [token, guard, reloadKey]);

  const previewRef = useRef("");
  useEffect(() => () => previewRef.current && URL.revokeObjectURL(previewRef.current), []);
  const setPicked = (file) => {
    if (previewRef.current) URL.revokeObjectURL(previewRef.current);
    previewRef.current = file ? URL.createObjectURL(file) : "";
    setImage(file);
    setPreview(previewRef.current);
  };

  const filteredLeads = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return leads;
    return leads.filter((l) => `${l.fullName} ${l.email} ${l.company} ${l.service} ${l.message}`.toLowerCase().includes(t));
  }, [leads, q]);

  function pickImage(e) {
    const file = e.target.files?.[0];
    setMsg({ type: "", text: "" });
    if (!file) return setPicked(null);
    // The API silently ignores unsupported types, so catch them here.
    if (!IMAGE_TYPES.includes(file.type)) {
      setMsg({ type: "error", text: "Use a JPEG, PNG, WebP or GIF image." });
      e.target.value = "";
      return setPicked(null);
    }
    if (file.size > MAX_IMAGE) {
      setMsg({ type: "error", text: "Image is larger than 5 MB." });
      e.target.value = "";
      return setPicked(null);
    }
    setPicked(file);
  }

  async function publish(e) {
    e.preventDefault();
    setBusy(true);
    setMsg({ type: "", text: "" });
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    if (image) fd.append("image", image);
    try {
      const res = await api.admin.createBlog(token, fd);
      setMsg({ type: "success", text: res.message || "Saved." });
      setForm(emptyForm);
      setPicked(null);
      setFileKey((k) => k + 1);
      setBlogs(await api.admin.blogs(token));
    } catch (err) {
      if (!guard(err)) setMsg({ type: "error", text: err.message });
    } finally {
      setBusy(false);
    }
  }

  async function removeBlog(b) {
    if (!window.confirm(`Delete “${b.title}” permanently?`)) return;
    try {
      await api.admin.deleteBlog(token, b.id);
      setBlogs((c) => c.filter((x) => x.id !== b.id));
    } catch (err) {
      if (!guard(err)) setMsg({ type: "error", text: err.message });
    }
  }

  async function removeLead(l) {
    if (!window.confirm(`Delete the inquiry from ${l.fullName}?`)) return;
    try {
      await api.admin.deleteContact(token, l.id);
      setLeads((c) => c.filter((x) => x.id !== l.id));
    } catch (err) {
      if (!guard(err)) setLoadError(err.message);
    }
  }

  const counter = (v, max) => <small className={v.length > max * 0.9 ? "warn" : ""}>{v.length}/{max}</small>;

  return (
    <div className="admin">
      <SEO title="Admin dashboard" description="Manage inquiries and content." path="/admin" robots="noindex, nofollow" />
      <header className="admin-bar glass">
        <Link to="/" className="admin-brand"><img src="/ng-logo-192.png" alt="" width="26" height="26" /> NextGenies <span className="pill">Admin</span></Link>
        <div className="tabs neu-inset" role="tablist">
          <button role="tab" aria-selected={tab === "leads"} className={tab === "leads" ? "on" : ""} onClick={() => setTab("leads")}>Leads <b>{leads.length}</b></button>
          <button role="tab" aria-selected={tab === "blogs"} className={tab === "blogs" ? "on" : ""} onClick={() => setTab("blogs")}>Blogs <b>{blogs.length}</b></button>
        </div>
        <div className="admin-bar-actions">
          <button className="btn btn-neu btn-sm" onClick={refresh} disabled={loading}>{loading ? "Refreshing…" : "↻ Refresh"}</button>
          <button className="btn btn-neu btn-sm" onClick={onLogout}>Log out</button>
        </div>
      </header>

      <main className="admin-main">
        {loadError && <p className="alert error" role="alert">{loadError}</p>}

        {tab === "leads" && (
          <section aria-label="Leads">
            <div className="admin-tools">
              <h1 className="h3">Contact submissions</h1>
              <div className="search neu-inset">
                <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search leads" aria-label="Search leads" />
              </div>
            </div>
            {!loading && filteredLeads.length === 0 && <div className="state-card neu-raised"><p className="muted">{leads.length ? "No leads match your search." : "No inquiries yet. Submissions from the contact form will appear here."}</p></div>}
            <div className="lead-grid">
              {filteredLeads.map((l) => {
                const phone = (l.phone || "").replace(/[^0-9+]/g, "");
                const hasPhone = phone && l.phone !== "Not provided";
                return (
                  <article key={l.id} className="lead neu-raised">
                    <div className="lead-top">
                      <div>
                        <h2 className="h4">{l.fullName}</h2>
                        <div className="lead-links">
                          <a href={`mailto:${l.email}`}>{l.email}</a>
                          {hasPhone && <a href={`https://wa.me/${phone.replace("+", "")}`} target="_blank" rel="noopener noreferrer">{l.phone}</a>}
                          <span>{l.createdAt ? new Date(String(l.createdAt).replace(" ", "T") + (String(l.createdAt).includes("Z") ? "" : "Z")).toLocaleString() : ""}</span>
                        </div>
                      </div>
                      <button className="btn btn-danger btn-sm" onClick={() => removeLead(l)}>Delete</button>
                    </div>
                    <div className="tags">
                      <span className="pill">{l.service}</span>
                      {l.company && <span className="tag">{l.company}</span>}
                      {l.needOption && <span className="tag">{l.needOption}</span>}
                      {l.scopePreference && <span className="tag">{l.scopePreference}</span>}
                      {l.timeline && <span className="tag">{l.timeline}</span>}
                    </div>
                    <pre className="lead-msg">{l.message}</pre>
                  </article>
                );
              })}
            </div>
          </section>
        )}

        {tab === "blogs" && (
          <section className="admin-blogs" aria-label="Blogs">
            <form className="editor neu-raised" onSubmit={publish}>
              <h1 className="h3">Publish an insight</h1>
              <label className="field"><span>Title {counter(form.title, LIMITS.title)}</span>
                <input className="input" maxLength={LIMITS.title} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required /></label>
              <label className="field"><span>URL slug <em>optional</em></span>
                <input className="input" maxLength={LIMITS.slug} value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="generated-from-title" /></label>
              <label className="field"><span>SEO description {counter(form.description, LIMITS.description)}</span>
                <textarea className="input" rows={3} maxLength={LIMITS.description} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required /></label>
              <label className="field"><span>Article content {counter(form.content, LIMITS.content)}</span>
                <textarea className="input mono" rows={14} maxLength={LIMITS.content} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} required
                  placeholder={"Plain text. Optional formatting:\n# Heading\n- bullet\n**bold**  [link](https://…)"} /></label>
              <div className="two-col">
                <label className="field"><span>Author</span>
                  <input className="input" maxLength={LIMITS.author} value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} /></label>
                <label className="field"><span>Cover image <em>max 5 MB</em></span>
                  <input key={fileKey} className="input" type="file" accept={IMAGE_TYPES.join(",")} onChange={pickImage} /></label>
              </div>
              {preview && <img className="img-preview" src={preview} alt="Selected cover preview" />}
              <label className="check"><input type="checkbox" checked={form.isPublished} onChange={(e) => setForm({ ...form, isPublished: e.target.checked })} /> Publish immediately</label>
              {msg.text && <p className={`alert ${msg.type}`} role="status">{msg.text}</p>}
              <button className="btn btn-primary" type="submit" disabled={busy}>{busy ? "Saving…" : form.isPublished ? "Publish" : "Save draft"}</button>
            </form>

            <aside className="library neu-raised">
              <h2 className="h4">Library <span className="pill">{blogs.length}</span></h2>
              {!loading && blogs.length === 0 && <p className="muted">No posts yet.</p>}
              {blogs.map((b) => (
                <div key={b.id} className="lib-row">
                  {b.imageUrl ? <img src={mediaUrl(b.imageUrl)} alt="" loading="lazy" width="56" height="40" /> : <span className="lib-ph" />}
                  <div>
                    <strong>{b.title}</strong>
                    <small>{b.isPublished ? "Published" : "Draft"} · /{b.slug} · {formatDate(b.publishedAt || b.createdAt)}</small>
                  </div>
                  <div className="lib-actions">
                    {b.isPublished ? <Link className="btn btn-neu btn-sm" to={`/blogs/${b.slug}`} target="_blank">View</Link> : null}
                    <button className="btn btn-danger btn-sm" onClick={() => removeBlog(b)} aria-label={`Delete ${b.title}`}>Delete</button>
                  </div>
                </div>
              ))}
            </aside>
          </section>
        )}
      </main>
    </div>
  );
}

/* ───────────────────────── Route guard ───────────────────────── */
export default function Admin() {
  const [token, setToken] = useState(() => loadToken());
  const [notice, setNotice] = useState("");

  const logout = useCallback((message = "") => {
    clearToken();
    setToken("");
    setNotice(message);
  }, []);

  // Sign out automatically when the JWT's own expiry passes (the server still re-checks every request).
  useEffect(() => {
    if (!token) return;
    const exp = tokenExpiry(token);
    if (!exp) return;
    const ms = exp - Date.now();
    const t = setTimeout(() => logout("Your admin session has expired. Please sign in again."), Math.max(0, Math.min(ms, 2 ** 31 - 1)));
    return () => clearTimeout(t);
  }, [token, logout]);

  if (!token) return <Login notice={notice} onLogin={(t) => { setNotice(""); setToken(t); }} />;
  return <Dashboard token={token} onLogout={() => logout()} onExpired={logout} />;
}
