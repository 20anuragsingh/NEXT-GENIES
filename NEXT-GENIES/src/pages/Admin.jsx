import { useEffect, useState, useCallback } from "react";
import SEO from "../components/SEO";

const emptyForm = { title: "", slug: "", description: "", content: "", author: "NextGenies", isPublished: true };

function Admin() {
  const apiBaseUrl = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");
  const [token, setToken] = useState(() => window.sessionStorage.getItem("nextgenies_admin_token") || "");
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [activeTab, setActiveTab] = useState("inquiries"); // "inquiries" | "blogs"
  const [form, setForm] = useState(emptyForm);
  const [image, setImage] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [status, setStatus] = useState({ type: "", message: "" });
  const [isBusy, setIsBusy] = useState(false);

  const loadBlogs = useCallback(async () => {
    if (!token) return;
    try {
      const response = await fetch(`${apiBaseUrl}/api/admin/blogs`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        if (response.status === 401) {
          sessionStorage.removeItem("nextgenies_admin_token");
          setToken("");
        }
        return;
      }
      setBlogs(await response.json());
    } catch {
      // ignore
    }
  }, [apiBaseUrl, token]);

  const loadInquiries = useCallback(async () => {
    if (!token) return;
    try {
      const response = await fetch(`${apiBaseUrl}/api/admin/contacts`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        if (response.status === 401) {
          sessionStorage.removeItem("nextgenies_admin_token");
          setToken("");
        }
        return;
      }
      setInquiries(await response.json());
    } catch {
      // ignore
    }
  }, [apiBaseUrl, token]);

  useEffect(() => {
    if (!token) return;
    const timer = setTimeout(() => {
      loadBlogs();
      loadInquiries();
    }, 0);
    return () => clearTimeout(timer);
  }, [token, loadBlogs, loadInquiries]);

  async function handleLogin(event) {
    event.preventDefault();
    setIsBusy(true);
    setStatus({ type: "", message: "" });
    try {
      const response = await fetch(`${apiBaseUrl}/api/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      sessionStorage.setItem("nextgenies_admin_token", data.token);
      setToken(data.token);
    } catch (error) {
      setStatus({ type: "error", message: error.message || "Unable to sign in." });
    } finally {
      setIsBusy(false);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const formElement = event.currentTarget;
    setIsBusy(true);
    setStatus({ type: "", message: "" });
    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => formData.append(key, value));
    if (image) formData.append("image", image);

    try {
      const response = await fetch(`${apiBaseUrl}/api/admin/blogs`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      setForm(emptyForm);
      setImage(null);
      formElement.reset();
      setStatus({ type: "success", message: data.message });
      await loadBlogs();
    } catch (error) {
      setStatus({ type: "error", message: error.message || "Unable to save this blog." });
    } finally {
      setIsBusy(false);
    }
  }

  async function deleteBlog(id) {
    if (!window.confirm("Delete this blog permanently?")) return;
    const response = await fetch(`${apiBaseUrl}/api/admin/blogs/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (response.ok) setBlogs((current) => current.filter((blog) => blog.id !== id));
  }

  async function deleteInquiry(id) {
    if (!window.confirm("Delete this contact inquiry from database?")) return;
    const response = await fetch(`${apiBaseUrl}/api/admin/contacts/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (response.ok) setInquiries((current) => current.filter((item) => item.id !== id));
  }

  function logout() {
    sessionStorage.removeItem("nextgenies_admin_token");
    setToken("");
  }

  if (!token) {
    return (
      <main className="admin-page admin-login-page">
        <SEO title="Admin Login" description="NextGenies admin login." canonicalPath="/admin" robots="noindex, nofollow" />
        <form className="admin-login-card" onSubmit={handleLogin}>
          <div className="section-label">Private workspace</div>
          <h1>Admin login</h1>
          <p>Sign in to view leads and manage insights.</p>
          <label className="form-label" htmlFor="admin-username">Username</label>
          <input className="form-input" id="admin-username" type="text" value={credentials.username} onChange={(event) => setCredentials({ ...credentials, username: event.target.value })} required />
          <label className="form-label" htmlFor="admin-password">Password</label>
          <input className="form-input" id="admin-password" type="password" value={credentials.password} onChange={(event) => setCredentials({ ...credentials, password: event.target.value })} required />
          {status.message && <p className="form-status error">{status.message}</p>}
          <button className="btn-primary" type="submit" disabled={isBusy}>{isBusy ? "Signing in..." : "Sign in"}</button>
          <p style={{ marginTop: "14px", fontSize: "11.5px", color: "var(--muted, #94a3b8)" }}>
            Default dev credentials: <code>admin</code> / <code>admin123</code>
          </p>
        </form>
      </main>
    );
  }

  return (
    <main className="admin-page">
      <SEO title="Admin Dashboard" description="Manage NextGenies inquiries and content." canonicalPath="/admin" robots="noindex, nofollow" />
      <div className="admin-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px", marginBottom: "28px" }}>
        <div>
          <div className="section-label">Dashboard & Database</div>
          <h1>{activeTab === "inquiries" ? "Contact Submissions" : "Publish an Insight"}</h1>
        </div>

        <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ display: "flex", gap: "6px", background: "rgba(255, 255, 255, 0.06)", padding: "4px", borderRadius: "999px", border: "1px solid rgba(148, 190, 255, 0.15)" }}>
            <button
              type="button"
              className={activeTab === "inquiries" ? "btn-primary" : "btn-secondary"}
              style={{ padding: "6px 16px", fontSize: "12.5px", borderRadius: "999px", cursor: "pointer" }}
              onClick={() => setActiveTab("inquiries")}
            >
              📬 Leads ({inquiries.length})
            </button>
            <button
              type="button"
              className={activeTab === "blogs" ? "btn-primary" : "btn-secondary"}
              style={{ padding: "6px 16px", fontSize: "12.5px", borderRadius: "999px", cursor: "pointer" }}
              onClick={() => setActiveTab("blogs")}
            >
              📝 Blogs ({blogs.length})
            </button>
          </div>

          <button className="btn-secondary" type="button" onClick={logout} style={{ padding: "7px 16px", fontSize: "12.5px" }}>
            Log out
          </button>
        </div>
      </div>

      {activeTab === "inquiries" ? (
        <section className="admin-inquiries-wrap">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <p style={{ color: "#94a3b8", fontSize: "14px", margin: 0 }}>
              Showing {inquiries.length} contact form submission{inquiries.length === 1 ? "" : "s"} stored in database.
            </p>
            <button
              type="button"
              className="btn-secondary"
              style={{ padding: "5px 14px", fontSize: "12px" }}
              onClick={loadInquiries}
            >
              ↻ Refresh Leads
            </button>
          </div>

          {inquiries.length === 0 ? (
            <div style={{ padding: "60px 20px", textAlign: "center", background: "rgba(255, 255, 255, 0.02)", borderRadius: "18px", border: "1px dashed rgba(148, 190, 255, 0.2)" }}>
              <div style={{ fontSize: "36px", marginBottom: "12px" }}>📬</div>
              <h3 style={{ color: "#ffffff", marginBottom: "8px" }}>No inquiries yet</h3>
              <p style={{ color: "#94a3b8", fontSize: "14px", margin: 0 }}>
                Submissions from the Contact questionnaire will be saved and displayed here.
              </p>
            </div>
          ) : (
            <div style={{ display: "grid", gap: "16px" }}>
              {inquiries.map((inq) => {
                const dateStr = inq.createdAt ? new Date(inq.createdAt).toLocaleString() : "Just now";
                const cleanPhone = (inq.phone || "").replace(/[^0-9+]/g, "");
                const waUrl = cleanPhone ? `https://wa.me/${cleanPhone.replace("+", "")}` : null;

                return (
                  <article
                    key={inq.id}
                    style={{
                      background: "linear-gradient(145deg, rgba(20, 32, 54, 0.8), rgba(11, 18, 32, 0.95))",
                      border: "1px solid rgba(148, 190, 255, 0.18)",
                      borderRadius: "16px",
                      padding: "22px 24px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "14px",
                      boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "10px" }}>
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px", flexWrap: "wrap" }}>
                          <span style={{ fontSize: "18px", fontWeight: "700", color: "#ffffff" }}>
                            {inq.fullName}
                          </span>
                          <span
                            style={{
                              fontSize: "11px",
                              fontWeight: "700",
                              color: "#60a5fa",
                              background: "rgba(37, 99, 235, 0.2)",
                              border: "1px solid rgba(59, 130, 246, 0.35)",
                              padding: "2px 10px",
                              borderRadius: "999px",
                            }}
                          >
                            {inq.service}
                          </span>
                          {inq.company && (
                            <span style={{ fontSize: "12px", color: "#94a3b8" }}>
                              🏢 {inq.company}
                            </span>
                          )}
                        </div>
                        <div style={{ display: "flex", gap: "16px", fontSize: "13px", color: "#cbd5e1", flexWrap: "wrap" }}>
                          <a href={`mailto:${inq.email}`} style={{ color: "#38bdf8", textDecoration: "none" }}>
                            ✉️ {inq.email}
                          </a>
                          {inq.phone && inq.phone !== "Not provided" && (
                            <a
                              href={waUrl || `tel:${inq.phone}`}
                              target="_blank"
                              rel="noreferrer"
                              style={{ color: "#4ade80", textDecoration: "none" }}
                            >
                              📱 {inq.phone}
                            </a>
                          )}
                          <span style={{ color: "#64748b" }}>🕒 {dateStr}</span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => deleteInquiry(inq.id)}
                        style={{
                          background: "rgba(239, 68, 68, 0.15)",
                          border: "1px solid rgba(239, 68, 68, 0.35)",
                          color: "#f87171",
                          padding: "4px 12px",
                          borderRadius: "8px",
                          fontSize: "12px",
                          cursor: "pointer",
                        }}
                      >
                        Delete
                      </button>
                    </div>

                    {(inq.needOption || inq.scopePreference || inq.timeline) && (
                      <div
                        style={{
                          display: "flex",
                          gap: "8px",
                          flexWrap: "wrap",
                          fontSize: "12px",
                          paddingTop: "6px",
                          borderTop: "1px solid rgba(148, 190, 255, 0.1)",
                        }}
                      >
                        {inq.needOption && (
                          <span style={{ background: "rgba(255, 255, 255, 0.05)", padding: "3px 8px", borderRadius: "6px", color: "#cbd5e1" }}>
                            🎯 Need: <strong>{inq.needOption}</strong>
                          </span>
                        )}
                        {inq.scopePreference && (
                          <span style={{ background: "rgba(255, 255, 255, 0.05)", padding: "3px 8px", borderRadius: "6px", color: "#cbd5e1" }}>
                            ⚙️ Scope: <strong>{inq.scopePreference}</strong>
                          </span>
                        )}
                        {inq.timeline && (
                          <span style={{ background: "rgba(255, 255, 255, 0.05)", padding: "3px 8px", borderRadius: "6px", color: "#cbd5e1" }}>
                            ⏱️ Timeline: <strong>{inq.timeline}</strong>
                          </span>
                        )}
                      </div>
                    )}

                    <div
                      style={{
                        background: "rgba(0, 0, 0, 0.25)",
                        padding: "12px 14px",
                        borderRadius: "10px",
                        fontSize: "13px",
                        lineHeight: "1.6",
                        color: "#94a3b8",
                        whiteSpace: "pre-wrap",
                      }}
                    >
                      {inq.message}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      ) : (
        <div className="admin-grid">
          <form className="admin-editor" onSubmit={handleSubmit}>
            <label className="form-label" htmlFor="blog-title">Title</label>
            <input className="form-input" id="blog-title" value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} required />
            <label className="form-label" htmlFor="blog-slug">URL slug <span>(optional)</span></label>
            <input className="form-input" id="blog-slug" value={form.slug} onChange={(event) => setForm({ ...form, slug: event.target.value })} placeholder="generated-from-title" />
            <label className="form-label" htmlFor="blog-description">SEO description</label>
            <textarea className="form-input" id="blog-description" rows="3" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} required />
            <label className="form-label" htmlFor="blog-content">Article content</label>
            <textarea className="form-input admin-content-input" id="blog-content" rows="14" value={form.content} onChange={(event) => setForm({ ...form, content: event.target.value })} required />
            <div className="admin-form-row">
              <div>
                <label className="form-label" htmlFor="blog-author">Author</label>
                <input className="form-input" id="blog-author" value={form.author} onChange={(event) => setForm({ ...form, author: event.target.value })} />
              </div>
              <div>
                <label className="form-label" htmlFor="blog-image">Cover image</label>
                <input className="form-input" id="blog-image" type="file" accept="image/png,image/jpeg,image/webp,image/gif" onChange={(event) => setImage(event.target.files[0] || null)} />
              </div>
            </div>
            <label className="admin-checkbox">
              <input type="checkbox" checked={form.isPublished} onChange={(event) => setForm({ ...form, isPublished: event.target.checked })} /> Publish immediately
            </label>
            {status.message && <p className={`form-status ${status.type}`}>{status.message}</p>}
            <button className="btn-primary" type="submit" disabled={isBusy}>{isBusy ? "Publishing..." : "Publish blog"}</button>
          </form>
          <aside className="admin-library">
            <div className="admin-library-heading">
              <h2>Published and drafts</h2>
              <span>{blogs.length}</span>
            </div>
            {blogs.length === 0 && <p className="blogs-status">No posts yet.</p>}
            {blogs.map((blog) => (
              <div className="admin-blog-row" key={blog.id}>
                <div>
                  <strong>{blog.title}</strong>
                  <small>{blog.isPublished ? "Published" : "Draft"} &middot; /{blog.slug}</small>
                </div>
                <button type="button" onClick={() => deleteBlog(blog.id)} aria-label={`Delete ${blog.title}`}>Delete</button>
              </div>
            ))}
          </aside>
        </div>
      )}
    </main>
  );
}

export default Admin;