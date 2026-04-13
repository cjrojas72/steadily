/**
 * API client — configured via VITE_API_BASE_URL in .env.
 *
 * Toggle between local and deployed Lambda by changing the env var:
 *   Local:    http://localhost:5000/api
 *   Lambda:   https://gky6zep8h4.execute-api.us-east-1.amazonaws.com/api
 */

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const TOKEN_KEY = "steadily_token";

/**
 * Thin wrapper around fetch that prepends the base URL, attaches the
 * JWT from localStorage, parses JSON, and unwraps the { data, error }
 * envelope the backend uses.
 */
export async function apiFetch(path, options = {}) {
  const url = `${API_BASE_URL}${path}`;
  const token = localStorage.getItem(TOKEN_KEY);

  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  const body = await res.json().catch(() => ({}));

  // Token expired or invalid — clear session and redirect to login
  if (res.status === 401 && !path.startsWith("/auth/")) {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem("steadily_user");
    window.location.href = "/login";
    throw new Error("Session expired. Please log in again.");
  }

  if (!res.ok) {
    throw new Error(body.error || `Request failed: ${res.status}`);
  }

  // Backend wraps all responses in { data, error } — unwrap it
  return body.data !== undefined ? body.data : body;
}
