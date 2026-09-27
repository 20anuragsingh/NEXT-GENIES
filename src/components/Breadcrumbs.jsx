import { Link, useLocation } from "react-router-dom";

function Breadcrumbs() {
  const { pathname } = useLocation();
  const crumbs = pathname.split("/").filter(Boolean);
  if (crumbs.length === 0) return null;

  const formatTitle = (slug) =>
    slug
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

  return (
    <nav aria-label="breadcrumb" className="breadcrumbs">
      <ol>
        <li><Link to="/">Home</Link></li>
        {crumbs.map((c, i) => {
          const to = "/" + crumbs.slice(0, i + 1).join("/");
          const name = formatTitle(c);
          const isCurrent = i === crumbs.length - 1;
          return (
            <li key={to}>
              {isCurrent ? (
                <span aria-current="page">{name}</span>
              ) : (
                <Link to={to}>{name}</Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export default Breadcrumbs;

