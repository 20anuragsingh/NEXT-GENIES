import { API_URL } from "./site";

/**
 * Thin fetch wrapper around the existing NextGenies backend.
 * - Never changes the request/response contract of the backend.
 * - Understands the backend's express-rate-limit responses (HTTP 429 + Retry-After / RateLimit headers).
 */
export class ApiError extends Error {
  constructor(message, { status = 0, retryAfter = 0, network = false } = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.retryAfter = retryAfter; // seconds (0 = unknown)
    this.network = network;
  }
  get isRateLimited() {
    return this.status === 429;
  }
  get isUnauthorized() {
    return this.status === 401;
  }
  get isNotFound() {
    return this.status === 404;
  }
}

// Backend limiters use a 15 minute window; used when the browser can't read Retry-After (cross-origin).
const DEFAULT_RETRY_SECONDS = 15 * 60;

function parseRetryAfter(headers) {
  const direct = Number(headers.get("retry-after"));
  if (Number.isFinite(direct) && direct > 0) return Math.ceil(direct);
  // draft-8 `RateLimit: "default";r=0;t=123`
  const rl = headers.get("ratelimit");
  const m = rl && /t=(\d+)/.exec(rl);
  if (m) return Number(m[1]);
  return 0;
}

export async function request(path, { method = "GET", token, json, formData, signal, timeout = 20000 } = {}) {
  const headers = {};
  let body;
  if (json !== undefined) {
    headers["Content-Type"] = "application/json";
    body = JSON.stringify(json);
  } else if (formData) {
    body = formData; // browser sets multipart boundary
  }
  if (token) headers.Authorization = `Bearer ${token}`;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  if (signal) signal.addEventListener("abort", () => controller.abort(), { once: true });

  let response;
  try {
    response = await fetch(`${API_URL}${path}`, { method, headers, body, signal: controller.signal });
  } catch (error) {
    if (signal?.aborted) throw error; // caller cancelled on purpose
    throw new ApiError(
      error.name === "AbortError"
        ? "The server took too long to respond. Please try again."
        : "Can't reach the server right now. Check your connection and try again.",
      { network: true },
    );
  } finally {
    clearTimeout(timer);
  }

  let data = null;
  try {
    data = await response.json();
  } catch {
    /* non-JSON body */
  }

  if (!response.ok) {
    const retryAfter = response.status === 429 ? parseRetryAfter(response.headers) || DEFAULT_RETRY_SECONDS : 0;
    const fallback =
      response.status === 429
        ? "Too many requests. Please wait a little and try again."
        : `Request failed (${response.status}).`;
    throw new ApiError(data?.message || fallback, { status: response.status, retryAfter });
  }
  return data;
}

export const api = {
  health: () => request("/api/health"),
  blogs: (opts) => request("/api/blogs", opts),
  blog: (slug, opts) => request(`/api/blogs/${encodeURIComponent(slug)}`, opts),
  sendContact: (payload) => request("/api/contacts", { method: "POST", json: payload }),
  admin: {
    login: (credentials) => request("/api/admin/login", { method: "POST", json: credentials }),
    blogs: (token) => request("/api/admin/blogs", { token }),
    createBlog: (token, formData) => request("/api/admin/blogs", { method: "POST", token, formData }),
    deleteBlog: (token, id) => request(`/api/admin/blogs/${id}`, { method: "DELETE", token }),
    contacts: (token) => request("/api/admin/contacts", { token }),
    deleteContact: (token, id) => request(`/api/admin/contacts/${id}`, { method: "DELETE", token }),
  },
};

/** "14 min 3 s" style label */
export function formatWait(seconds) {
  const s = Math.max(0, Math.round(seconds));
  if (s >= 60) return `${Math.ceil(s / 60)} min`;
  return `${s}s`;
}
