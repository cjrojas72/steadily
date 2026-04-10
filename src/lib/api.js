/**
 * API client configuration.
 *
 * When the backend is connected this module will export a configured
 * fetch wrapper that points at the real API.  For now every service
 * returns mock data, but they all import this file so the wiring is
 * already in place.
 */

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

const TOKEN_KEY = "steadily_token";

/**
 * Thin wrapper around fetch that prepends the base URL, attaches the
 * JWT from localStorage, and parses JSON.
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

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed: ${res.status}`);
  }

  return res.json();
}
