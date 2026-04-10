// import { apiFetch } from "@/lib/api";

/**
 * Log in with email + password.
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{ token: string, user: object }>}
 */
export async function login(email, password) {
  // TODO: replace with  apiFetch("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) })
  return {
    token: "mock-jwt-token",
    user: { id: "1", email, firstName: "John", lastName: "Doe" },
  };
}

/**
 * Register a new account.
 * @param {{ email: string, password: string, firstName: string, lastName: string }} data
 * @returns {Promise<{ token: string, user: object }>}
 */
export async function signup(data) {
  // TODO: replace with  apiFetch("/auth/signup", { method: "POST", body: JSON.stringify(data) })
  return {
    token: "mock-jwt-token",
    user: { id: "1", ...data },
  };
}

/**
 * Log the current user out.
 * @returns {Promise<void>}
 */
export async function logout() {
  // TODO: replace with  apiFetch("/auth/logout", { method: "POST" })
}

/**
 * Refresh the current JWT token.
 * @param {string} refreshToken
 * @returns {Promise<{ token: string }>}
 */
export async function refreshToken(refreshToken) {
  // TODO: replace with  apiFetch("/auth/refresh", { method: "POST", body: JSON.stringify({ refresh_token: refreshToken }) })
  return { token: "mock-refreshed-jwt-token" };
}
