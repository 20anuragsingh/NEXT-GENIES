import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import SEO from "../components/SEO";
import { breadcrumbLd, canonicalFor } from "../lib/seoHelpers";
import NotFound from "./NotFound";
import { api } from "../lib/api";
import { useBlogs } from "../lib/blogStore";
import { absoluteMedia, formatDate, mediaUrl, SITE_URL } from "../lib/site";
import { RichText } from "../lib/richText";
import { readingTime } from "../lib/textUtils";

export default function BlogPost() {
  const { slug } = useParams();
  const [state, setState] = useState({ slug: null, blog: null, error: null });
  const { blogs } = useBlogs();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    api
      .blog(slug, { signal: controller.signal })
      .then((blog) => setState({ slug, blog, error: null }))
      .catch((error) => !controller.signal.aborted && setState({ slug, blog: null, error }));
    return () => controller.abort();
  }, [slug]);

  const current = state.slug === slug;
  const blog = current ? state.blog : null;
  const error = current ? state.error : null;

  if (error?.isNotFound) return <NotFound />;

  if (error) {
    return (
      <main className="container page-top center-text">
        <SEO title="Article unavailable" description="This article could not be loaded." path={`/blogs/${slug}`} robots="noindex, follow" />
        <div className="state-card neu-raised">
          <h1 className="h3">We couldn't load this article</h1>
          <p className="muted">{error.message}</p>
          <button className="btn btn-primary" onClick={() => window.location.reload()}>Reload</button>
          <Link className="btn btn-neu" to="/blogs">All articles</Link>
        </div>
      </main>
    );
  }

  if (!blog) {
    return (
      <main className="container page-top post-page" aria-busy="true">
        <span className="skeleton line short" />
        <span className="skeleton line big" />
        <span className="skeleton line" />
        <div className="cover skeleton" style={{ marginTop: 24 }} />
      </main>
    );
  }

  const date = blog.publishedAt || blog.createdAt;
  const url = canonicalFor(`/blogs/${blog.slug}`);
  const related = blogs.filter((b) => b.slug !== blog.slug).slice(0, 3);
  const mins = readingTime(blog.content);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard unavailable */
    }
  };
  const enc = encodeURIComponent;

  return (
    <>
      <SEO
        title={blog.title}
        description={blog.description}
        path={`/blogs/${blog.slug}`}
        ogType="article"
        image={blog.imageUrl ? absoluteMedia(blog.imageUrl) : undefined}
        publishedTime={date}
        jsonLd={[
          breadcrumbLd([{ name: "Home", path: "/" }, { name: "Blogs", path: "/blogs" }, { name: blog.title, path: `/blogs/${blog.slug}` }]),
          {
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: blog.title,
            description: blog.description,
            image: blog.imageUrl ? [absoluteMedia(blog.imageUrl)] : undefined,
            datePublished: date,
            author: { "@type": "Person", name: blog.author },
            publisher: { "@type": "Organization", name: "NextGenies", logo: { "@type": "ImageObject", url: `${SITE_URL}/ng-logo-transparent.png` } },
            mainEntityOfPage: url,
          },
        ]}
      />

      <main className="container page-top post-page">
        <nav aria-label="Breadcrumb" className="crumbs">
          <Link to="/">Home</Link><span>/</span><Link to="/blogs">Blogs</Link>
        </nav>

        <article>
          <header className="post-head">
            <div className="post-meta">
              <span>{blog.author}</span>
              {formatDate(date) && <time dateTime={date}>{formatDate(date)}</time>}
              <span>{mins} min read</span>
            </div>
            <h1 className="h1">{blog.title}</h1>
            <p className="lead">{blog.description}</p>
          </header>

          {blog.imageUrl && (
            <img className="post-hero neu-raised" src={mediaUrl(blog.imageUrl)} alt={blog.title} width="1200" height="675" decoding="async" />
          )}

          <div className="prose">
            <RichText content={blog.content} />
          </div>

          <footer className="share glass">
            <span>Share this article</span>
            <div>
              <a className="btn btn-neu btn-sm" href={`https://wa.me/?text=${enc(blog.title + " " + url)}`} target="_blank" rel="noopener noreferrer">WhatsApp</a>
              <a className="btn btn-neu btn-sm" href={`https://www.linkedin.com/sharing/share-offsite/?url=${enc(url)}`} target="_blank" rel="noopener noreferrer">LinkedIn</a>
              <a className="btn btn-neu btn-sm" href={`https://twitter.com/intent/tweet?text=${enc(blog.title)}&url=${enc(url)}`} target="_blank" rel="noopener noreferrer">X</a>
              <button type="button" className="btn btn-neu btn-sm" onClick={copy}>{copied ? "Copied ✓" : "Copy link"}</button>
            </div>
          </footer>
        </article>

        {related.length > 0 && (
          <section className="related" aria-labelledby="related-h">
            <h2 id="related-h" className="h3">Keep reading</h2>
            <div className="post-grid">
              {related.map((b) => (
                <article key={b.id} className="post-card neu-raised hover-lift">
                  <div className="post-body">
                    <div className="post-meta"><span>{formatDate(b.publishedAt || b.createdAt)}</span></div>
                    <h3 className="h4"><Link to={`/blogs/${b.slug}`}>{b.title}</Link></h3>
                    <p className="muted">{b.description}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </main>
    </>
  );
}
