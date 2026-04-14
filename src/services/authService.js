import { apiFetch, API_BASE_URL } from "@/lib/api";

async function ensureIncomeCategory(token) {
  const categoriesRes = await fetch(`${API_BASE_URL}/categories`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!categoriesRes.ok) {
    return;
  }

  const categoriesBody = await categoriesRes.json();
  const categories = categoriesBody.data ?? categoriesBody;
  const hasIncome = Array.isArray(categories)
    ? categories.some((cat) => cat.name?.toLowerCase() === "income")
    : false;

  if (!hasIncome) {
    await fetch(`${API_BASE_URL}/categories`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: "Income",
        color: "#1D9E75",
        icon: "trending-up",
        is_default: true,
      }),
    });
  }
}

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

  if (result.access_token) {
    await ensureIncomeCategory(result.access_token);
  }

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
