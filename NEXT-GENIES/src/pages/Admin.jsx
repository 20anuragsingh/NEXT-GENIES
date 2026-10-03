import { useEffect, useState } from "react";
import SEO from "../components/SEO";

const emptyForm = { title: "", slug: "", description: "", content: "", author: "NextGenies", isPublished: true };

function Admin() {
  const apiBaseUrl = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");
  const [token, setToken] = useState(() => window.sessionStorage.getItem("nextgenies_admin_token") || "");
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [form, setForm] = useState(emptyForm);
  const [image, setImage] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [status, setStatus] = useState({ type: "", message: "" });
  const [isBusy, setIsBusy] = useState(false);

  useEffect(() => {
    if (!token) return;
    fetch(`${apiBaseUrl}/api/admin/blogs`, { headers: { Authorization: `Bearer ${token}` } })
      .then((response) => {
        if (!response.ok) throw new Error("expired");
        return response.json();
      })
      .then(setBlogs)
      .catch(() => {
        sessionStorage.removeItem("nextgenies_admin_token");
        setToken("");
      });
  }, [apiBaseUrl, token]);

  async function loadBlogs() {
    const response = await fetch(`${apiBaseUrl}/api/admin/blogs`, { headers: { Authorization: `Bearer ${token}` } });
    if (!response.ok) {
      sessionStorage.removeItem("nextgenies_admin_token");
      setToken("");
      return;
    }
    setBlogs(await response.json());
  }

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
          <p>Sign in to publish a new insight.</p>
          <label className="form-label" htmlFor="admin-username">Username</label>
          <input className="form-input" id="admin-username" type="text" value={credentials.username} onChange={(event) => setCredentials({ ...credentials, username: event.target.value })} required />
          <label className="form-label" htmlFor="admin-password">Password</label>
          <input className="form-input" id="admin-password" type="password" value={credentials.password} onChange={(event) => setCredentials({ ...credentials, password: event.target.value })} required />
          {status.message && <p className="form-status error">{status.message}</p>}
          <button className="btn-primary" type="submit" disabled={isBusy}>{isBusy ? "Signing in..." : "Sign in"}</button>
        </form>
      </main>
    );
  }

  return (
    <main className="admin-page">
      <SEO title="Blog Admin" description="Manage NextGenies blog posts." canonicalPath="/admin" robots="noindex, nofollow" />
      <div className="admin-header"><div><div className="section-label">Content studio</div><h1>Publish an insight</h1></div><button className="btn-secondary" type="button" onClick={logout}>Log out</button></div>
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
          <div className="admin-form-row"><div><label className="form-label" htmlFor="blog-author">Author</label><input className="form-input" id="blog-author" value={form.author} onChange={(event) => setForm({ ...form, author: event.target.value })} /></div><div><label className="form-label" htmlFor="blog-image">Cover image</label><input className="form-input" id="blog-image" type="file" accept="image/png,image/jpeg,image/webp,image/gif" onChange={(event) => setImage(event.target.files[0] || null)} /></div></div>
          <label className="admin-checkbox"><input type="checkbox" checked={form.isPublished} onChange={(event) => setForm({ ...form, isPublished: event.target.checked })} /> Publish immediately</label>
          {status.message && <p className={`form-status ${status.type}`}>{status.message}</p>}
          <button className="btn-primary" type="submit" disabled={isBusy}>{isBusy ? "Publishing..." : "Publish blog"}</button>
        </form>
        <aside className="admin-library"><div className="admin-library-heading"><h2>Published and drafts</h2><span>{blogs.length}</span></div>{blogs.length === 0 && <p className="blogs-status">No posts yet.</p>}{blogs.map((blog) => <div className="admin-blog-row" key={blog.id}><div><strong>{blog.title}</strong><small>{blog.isPublished ? "Published" : "Draft"} &middot; /{blog.slug}</small></div><button type="button" onClick={() => deleteBlog(blog.id)} aria-label={`Delete ${blog.title}`}>Delete</button></div>)}</aside>
      </div>
    </main>
  );
}

export default Admin;