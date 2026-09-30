import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import SEO from "../components/SEO";

function Blogs() {
  const { slug } = useParams();
  const [blogs, setBlogs] = useState([]);
  const [status, setStatus] = useState("Loading insights...");
  const apiBaseUrl = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

  useEffect(() => {
    const endpoint = slug
      ? `${apiBaseUrl}/api/blogs/${encodeURIComponent(slug)}`
      : `${apiBaseUrl}/api/blogs`;

    fetch(endpoint)
      .then((response) => {
        if (!response.ok) throw new Error(slug && response.status === 404 ? "That article could not be found." : "Unable to load blogs.");
        return response.json();
      })
      .then((data) => {
        const loadedBlogs = slug ? [data] : data;
        setBlogs(loadedBlogs);
        setStatus(loadedBlogs.length ? "" : "New insights are on the way.");
      })
      .catch((error) => setStatus(error.message === "That article could not be found." ? error.message : "Blogs are temporarily unavailable. Please check back soon."));
  }, [apiBaseUrl, slug]);

  const selectedBlog = blogs.find((blog) => blog.slug === slug);

  if (slug && selectedBlog) {
    return (
      <>
        <SEO
          title={selectedBlog.title}
          description={selectedBlog.description}
          canonicalPath={`/blogs/${selectedBlog.slug}`}
          ogType="article"
        />
        <Navbar />
        <main className="blog-detail-page">
          <Link className="blog-back-link" to="/blogs">&larr; Back to all insights</Link>
          <article className="blog-detail">
            <div className="blog-meta">{selectedBlog.author} &middot; {new Date(selectedBlog.publishedAt || selectedBlog.createdAt).toLocaleDateString()}</div>
            <h1>{selectedBlog.title}</h1>
            <p className="blog-detail-description">{selectedBlog.description}</p>
            {selectedBlog.imageUrl && <img className="blog-detail-image" src={`${apiBaseUrl}${selectedBlog.imageUrl}`} alt={selectedBlog.title} />}
            <div className="blog-detail-content">{selectedBlog.content}</div>
          </article>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <SEO
        title="Digital Growth Insights"
        description="Practical insights on content, websites, branding, and digital growth from the NextGenies team."
        canonicalPath="/blogs"
      />
      <Navbar />
      <main className="blogs-page">
        <header className="blogs-hero">
          <div className="section-label">The Journal</div>
          <h1>Ideas that move brands forward.</h1>
          <p>Useful thinking on building a sharper, more visible digital presence.</p>
        </header>

        <section className="blogs-list" aria-live="polite">
          {status && <p className="blogs-status">{status}</p>}
          {blogs.map((blog) => (
            <article className="blog-article" key={blog.id}>
              {blog.imageUrl && (
                <Link className="blog-image-link" to={`/blogs/${blog.slug}`} aria-label={`Read ${blog.title}`}>
                  <img className="blog-image" src={`${apiBaseUrl}${blog.imageUrl}`} alt={blog.title} />
                </Link>
              )}
              <div className="blog-article-copy">
                <div className="blog-meta">{blog.author} &middot; {new Date(blog.publishedAt || blog.createdAt).toLocaleDateString()}</div>
                <h2><Link to={`/blogs/${blog.slug}`}>{blog.title}</Link></h2>
                <p className="blog-description">{blog.description}</p>
                <Link className="blog-read-link" to={`/blogs/${blog.slug}`}>Read article <span aria-hidden="true">&rarr;</span></Link>
              </div>
            </article>
          ))}
        </section>
      </main>
      <Footer />
    </>
  );
}

export default Blogs;