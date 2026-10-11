import { Fragment } from "react";
import { parseBlocks } from "./textUtils";

// Blog content is plain text written in the admin textarea. This renders a small, SAFE markdown subset
// (headings, lists, quotes, bold, italic, links) as React elements — no dangerouslySetInnerHTML.
const INLINE = /(\*\*[^*]+\*\*|\*[^*\s][^*]*\*|\[[^\]]+\]\((?:https?:\/\/|\/)[^)\s]+\))/g;

function inline(text, keyPrefix) {
  return text.split(INLINE).map((part, i) => {
    const key = `${keyPrefix}-${i}`;
    if (part.startsWith("**") && part.endsWith("**")) return <strong key={key}>{part.slice(2, -2)}</strong>;
    if (part.startsWith("*") && part.endsWith("*") && part.length > 2) return <em key={key}>{part.slice(1, -1)}</em>;
    const link = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(part);
    if (link) {
      const external = /^https?:\/\//i.test(link[2]);
      return (
        <a key={key} href={link[2]} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
          {link[1]}
        </a>
      );
    }
    return <Fragment key={key}>{part}</Fragment>;
  });
}

export function RichText({ content }) {
  const blocks = parseBlocks(content);
  return (
    <>
      {blocks.map((block, i) => {
        const key = `b${i}`;
        if (block.type === "h") {
          const Tag = `h${Math.min(block.level, 4)}`;
          return <Tag key={key}>{inline(block.text, key)}</Tag>;
        }
        if (block.type === "list") {
          const Tag = block.ordered ? "ol" : "ul";
          return (
            <Tag key={key}>
              {block.items.map((item, j) => (
                <li key={`${key}-${j}`}>{inline(item, `${key}-${j}`)}</li>
              ))}
            </Tag>
          );
        }
        if (block.type === "quote") return <blockquote key={key}>{inline(block.text, key)}</blockquote>;
        return <p key={key}>{inline(block.text, key)}</p>;
      })}
    </>
  );
}
