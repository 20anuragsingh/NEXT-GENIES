import { useCallback, useEffect, useState } from "react";
import { api } from "./api";

// Tiny in-memory cache so the list → article → list navigation feels instant.
let cache = { at: 0, data: null };
const TTL = 60 * 1000;

export function useBlogs() {
  const [state, setState] = useState(() => ({
    blogs: cache.data || [],
    status: cache.data ? "ready" : "loading",
    error: null,
  }));
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const fresh = cache.data && Date.now() - cache.at < TTL && attempt === 0;
    if (fresh) return;
    const controller = new AbortController();
    api
      .blogs({ signal: controller.signal })
      .then((data) => {
        const blogs = Array.isArray(data) ? data : [];
        cache = { at: Date.now(), data: blogs };
        setState({ blogs, status: "ready", error: null });
      })
      .catch((error) => {
        if (controller.signal.aborted) return;
        setState((s) => ({ ...s, status: "error", error }));
      });
    return () => controller.abort();
  }, [attempt]);

  const retry = useCallback(() => {
    setState((s) => ({ ...s, status: s.blogs.length ? "ready" : "loading", error: null }));
    setAttempt((n) => n + 1);
  }, []);
  return { ...state, retry };
}
