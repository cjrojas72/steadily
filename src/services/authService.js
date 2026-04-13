import { apiFetch } from "@/lib/api";

/**
 * Log in with email + password.
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{ token: string, user: object }>}
 */
export async function login(email, password) {
  const data = await apiFetch("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  return {
    token: data.access_token,
    refreshToken: data.refresh_token,
    user: data.user || { email },
  };
}

/**
 * Register a new account.
 * @param {{ email: string, password: string, firstName: string, lastName: string }} data
 * @returns {Promise<{ token: string, user: object }>}
 */
export async function signup(data) {
  const result = await apiFetch("/auth/signup", {
    method: "POST",
    body: JSON.stringify({
      email: data.email,
      password: data.password,
      display_name: `${data.firstName} ${data.lastName}`.trim(),
    }),
  });
  return {
    token: result.access_token,
    refreshToken: result.refresh_token,
    user: result.user || { email: data.email, ...data },
  };
}

/**
 * Log the current user out.
 * @returns {Promise<void>}
 */
export async function logout() {
  try {
    await apiFetch("/auth/logout", { method: "POST" });
  } catch {
    // Logout may fail if the token is already expired — that's fine
  }
}

/**
 * Refresh the current JWT token.
 * @param {string} token
 * @returns {Promise<{ token: string }>}
 */
export async function refreshToken(token) {
  const data = await apiFetch("/auth/refresh", {
    method: "POST",
    body: JSON.stringify({ refresh_token: token }),
  });
  return { token: data.access_token };
}
