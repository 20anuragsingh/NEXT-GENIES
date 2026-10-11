// Admin session handling. The backend issues an 8h JWT from POST /api/admin/login.
// The token lives only in sessionStorage (cleared when the tab closes) and is never sent anywhere except as a Bearer header.
const KEY = "nextgenies_admin_token";

export function decodeToken(token) {
  try {
    const part = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(decodeURIComponent(escape(atob(part))));
  } catch {
    return null;
  }
}

/** ms epoch of expiry, or 0 when unreadable. UI-only convenience — the server is the real authority. */
export function tokenExpiry(token) {
  const payload = decodeToken(token);
  return payload?.exp ? payload.exp * 1000 : 0;
}

export function isTokenValid(token) {
  if (!token) return false;
  const exp = tokenExpiry(token);
  return exp === 0 ? true : exp - 5000 > Date.now();
}

export function loadToken() {
  try {
    const token = window.sessionStorage.getItem(KEY) || "";
    if (isTokenValid(token)) return token;
    window.sessionStorage.removeItem(KEY);
  } catch {
    /* storage blocked */
  }
  return "";
}

export function saveToken(token) {
  try {
    window.sessionStorage.setItem(KEY, token);
  } catch {
    /* storage blocked */
  }
}

export function clearToken() {
  try {
    window.sessionStorage.removeItem(KEY);
  } catch {
    /* storage blocked */
  }
}
