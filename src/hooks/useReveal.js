import { useCallback, useEffect, useRef, useState } from "react";

const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

/** Adds `is-visible` state once the element scrolls into view. */
export function useReveal({ threshold = 0.15, rootMargin = "0px 0px -8% 0px", once = true } = {}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(() => prefersReducedMotion() || typeof IntersectionObserver === "undefined");

  useEffect(() => {
    const node = ref.current;
    if (!node || visible) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          if (once) observer.disconnect();
        } else if (!once) setVisible(false);
      },
      { threshold, rootMargin },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold, rootMargin, once, visible]);

  return [ref, visible];
}

/** Scroll progress (0..1) of a tall section while it passes through the viewport. rAF-throttled. */
export function useSectionProgress() {
  const ref = useRef(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = node.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const value = total <= 0 ? 0 : Math.min(1, Math.max(0, -rect.top / total));
      setProgress((prev) => (Math.abs(prev - value) < 0.0015 ? prev : value));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return [ref, progress];
}

export function useReducedMotion() {
  const [reduced, setReduced] = useState(prefersReducedMotion);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduced;
}

/** Counts up to `to` when `start` flips true (jumps straight to the end for reduced-motion users). */
export function useCountUp(to, start, duration = 1400) {
  const [value, setValue] = useState(0);
  const instant = prefersReducedMotion();
  useEffect(() => {
    if (!start || instant) return;
    let frame;
    const t0 = performance.now();
    const tick = (now) => {
      const p = Math.min(1, (now - t0) / duration);
      setValue(Math.round(to * (1 - Math.pow(1 - p, 3))));
      if (p < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [to, start, duration, instant]);
  return instant ? (start ? to : 0) : value;
}

/** Cool-down timer for rate-limit responses: `const [remaining, start] = useCountdown(); start(seconds)`. */
export function useCountdown() {
  const [until, setUntil] = useState(0);
  const [now, setNow] = useState(0);
  const start = useCallback((seconds) => {
    const t = Date.now();
    setUntil(t + seconds * 1000);
    setNow(t);
  }, []);
  useEffect(() => {
    if (!until) return;
    const id = setInterval(() => {
      const t = Date.now();
      setNow(t);
      if (t >= until) clearInterval(id);
    }, 1000);
    return () => clearInterval(id);
  }, [until]);
  return [until ? Math.max(0, Math.ceil((until - now) / 1000)) : 0, start];
}
