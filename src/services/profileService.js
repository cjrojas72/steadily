import { apiFetch } from "@/lib/api";

/**
 * Normalise the backend profile payload into the shape the UI uses.
 * Backend returns: id, email, display_name, first_name, last_name,
 *                  phone1, currency, created_at.
 */
function normaliseProfile(p) {
  if (!p) return null;
  return {
    id: p.id,
    email: p.email || "",
    displayName: p.display_name || "",
    firstName: p.first_name || "",
    lastName: p.last_name || "",
    phone: p.phone1 || "",
    currency: p.currency || "USD",
    createdAt: p.created_at || null,
  };
}

/**
 * Fetch the current user's profile.
 * @returns {Promise<object>}
 */
export async function getProfile() {
  const data = await apiFetch("/profile");
  return normaliseProfile(data);
}

/**
 * Update the current user's profile. Accepts any subset of
 * { firstName, lastName, phone, displayName }.
 * @param {object} data
 * @returns {Promise<object>}
 */
export async function updateProfile(data) {
  const payload = {};
  if (data.firstName !== undefined) payload.first_name = data.firstName;
  if (data.lastName !== undefined) payload.last_name = data.lastName;
  if (data.phone !== undefined) payload.phone1 = data.phone;
  if (data.displayName !== undefined) payload.display_name = data.displayName;

  const result = await apiFetch("/profile", {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
  return normaliseProfile(result);
}
