import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import SEO from "../components/SEO";
import { breadcrumbLd } from "../lib/seoHelpers";
import Reveal from "../components/Reveal";
import { useBlogs } from "../lib/blogStore";
import { formatDate, mediaUrl, absoluteMedia, SITE_URL } from "../lib/site";

import { metaFor } from "../seo/routes";

function Cover({ blog, eager = false }) {
  const [failed, setFailed] = useState(false);
  if (!blog.imageUrl || failed) {
    return (
      <div className="cover cover-fallback" aria-hidden="true">
        <span>{blog.title.slice(0, 1)}</span>
      </div>
    );
  }
  return (
    <img
      className="cover"
      src={mediaUrl(blog.imageUrl)}
      alt={blog.title}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      width="1200"
      height="675"
      onError={() => setFailed(true)}
    />
  );
}

function PostCard({ blog, featured = false, index = 0 }) {
  const href = `/blogs/${blog.slug}`;
  return (
    <Reveal as="article" delay={(index % 3) * 80} className={`post-card neu-raised hover-lift${featured ? " featured" : ""}`}>
      <Link to={href} className="post-cover" tabIndex={-1} aria-hidden="true">
        <Cover blog={blog} eager={featured} />
      </Link>
      <div className="post-body">
        <div className="post-meta">
          <span>{blog.author}</span>
          {formatDate(blog.publishedAt || blog.createdAt) && <span>{formatDate(blog.publishedAt || blog.createdAt)}</span>}
        </div>
        <h2 className={featured ? "h2" : "h4"}>
          <Link to={href}>{blog.title}</Link>
        </h2>
        <p className="muted">{blog.description}</p>
        <Link to={href} className="read-link">Read article <span aria-hidden="true">→</span></Link>
      </div>
    </Reveal>
  );
}

function Skeletons() {
  return (
    <div className="post-grid" aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <div key={i} className="post-card neu-raised skeleton-card">
          <div className="cover skeleton" />
          <div className="post-body">
            <span className="skeleton line short" />
            <span className="skeleton line" />
            <span className="skeleton line" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Blogs() {
  const meta = metaFor("/blogs");
  const { blogs, status, error, retry } = useBlogs();
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("All");

  const categories = useMemo(
    () => ["All", ...new Set(blogs.map((blog) => blog.category).filter(Boolean))],
    [blogs],
  );

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return blogs.filter((b) => {
      const matchesCategory = category === "All" || b.category === category;
      const matchesSearch = !term || `${b.title} ${b.description} ${b.author}`.toLowerCase().includes(term);
      return matchesCategory && matchesSearch;
    });
  }, [blogs, category, q]);

  const [first, ...rest] = filtered;
  const showFeatured = !q.trim() && first;

  return (
    <>
      <SEO
        title={meta.title}
        description={meta.description}
        path="/blogs"
        jsonLd={[
          breadcrumbLd([{ name: "Home", path: "/" }, { name: "Blogs", path: "/blogs" }]),
          {
            "@context": "https://schema.org",
            "@type": "Blog",
            name: "NextGenies Journal",
            url: `${SITE_URL}/blogs/`,
            blogPost: blogs.slice(0, 20).map((b) => ({
              "@type": "BlogPosting",
              headline: b.title,
              url: `${SITE_URL}/blogs/${b.slug}/`,
              datePublished: b.publishedAt || b.createdAt,
              image: b.imageUrl ? absoluteMedia(b.imageUrl) : undefined,
              author: { "@type": "Person", name: b.author },
            })),
          },
        ]}
      />
      <main className="container page-top">
        <Reveal as="header" className="about-head">
          <span className="eyebrow">The journal</span>
          <h1 className="h1">Ideas that move <span className="accent-text">brands forward</span>.</h1>
          <p className="lead">Useful thinking on building a sharper, more visible digital presence.</p>
        </Reveal>

        {blogs.length > 3 && (
          <div className="blog-tools">
            <div className="search neu-inset">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></svg>
              <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search articles" aria-label="Search articles" />
            </div>
            {categories.length > 1 && (
              <div className="blog-filters" aria-label="Filter articles by category">
                {categories.map((item) => (
                  <button
                    key={item}
                    type="button"
                    className={`filter-chip${category === item ? " active" : ""}`}
                    aria-pressed={category === item}
                    onClick={() => setCategory(item)}
                  >
                    {item}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        <div aria-live="polite">
          {status === "loading" && <Skeletons />}

          {status === "error" && (
            <div className="state-card neu-raised">
              <h2 className="h3">{error?.network ? "We can't reach the server" : "Blogs are temporarily unavailable"}</h2>
              <p className="muted">{error?.message || "Please try again in a moment."}</p>
              <button type="button" className="btn btn-primary" onClick={retry}>Try again</button>
            </div>
          )}

          {status === "ready" && blogs.length === 0 && (
            <div className="state-card neu-raised">
              <h2 className="h3">New insights are on the way</h2>
              <p className="muted">We're writing. Check back soon.</p>
              <Link className="btn btn-neu" to="/services">Explore services</Link>
            </div>
          )}

          {status === "ready" && blogs.length > 0 && filtered.length === 0 && (
            <div className="state-card neu-raised"><p className="muted">No articles match “{q}”.</p></div>
          )}

          {status === "ready" && showFeatured && <PostCard blog={first} featured />}
          {status === "ready" && filtered.length > 0 && (
            <div className="post-grid">
              {(showFeatured ? rest : filtered).map((b, i) => <PostCard key={b.id} blog={b} index={i} />)}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
