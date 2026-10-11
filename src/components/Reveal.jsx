import { useReveal } from "../hooks/useReveal";

/** Scroll-reveal wrapper. `as` lets you pick the tag, `delay` staggers siblings (ms). */
export default function Reveal({ as: Tag = "div", delay = 0, className = "", children, ...rest }) {
  const [ref, visible] = useReveal();
  return (
    <Tag ref={ref} className={`reveal${visible ? " in" : ""} ${className}`} style={{ "--d": `${delay}ms` }} {...rest}>
      {children}
    </Tag>
  );
}
