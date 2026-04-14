import { apiFetch } from "@/lib/api";

/**
 * Fetch transactions with pagination, filtering, and sorting.
 * @param {object} filters
 * @returns {Promise<{ items: Array, page: number, perPage: number, total: number }>}
 */
export async function getTransactions(filters = {}) {
  const params = new URLSearchParams();
  if (filters.search) params.set("search", filters.search);
  if (filters.category && filters.category !== "all") params.set("category_id", filters.category);
  if (filters.startDate) params.set("start_date", filters.startDate);
  if (filters.endDate) params.set("end_date", filters.endDate);
  if (filters.sortBy) params.set("sort_by", filters.sortBy);
  if (filters.sortOrder) params.set("sort_order", filters.sortOrder);
  if (filters.page) params.set("page", String(filters.page));
  if (filters.perPage) params.set("per_page", String(filters.perPage));

  const qs = params.toString();
  const data = await apiFetch(`/transactions${qs ? `?${qs}` : ""}`);

  // Backend returns { page, per_page, total, items }
  return {
    items: data.items || data,
    page: data.page || 1,
    perPage: data.per_page || 15,
    total: data.total || (data.items || data).length,
  };
}

/**
 * Fetch the N most recent transactions.
 * @param {number} limit
 * @returns {Promise<Array>}
 */
export async function getRecentTransactions(limit = 5) {
  const data = await apiFetch(`/transactions?per_page=${limit}&sort_by=transaction_date&sort_order=desc`);
  return data.items || data;
}

/**
 * Create a new transaction.
 * @param {object} data - { name, category, amount, date, type }
 * @returns {Promise<object>}
 */
export async function createTransaction(data) {
  return apiFetch("/transactions", {
    method: "POST",
    body: JSON.stringify({
      category_id: data.category,
      amount: Math.abs(data.amount),
      type: data.type,
      description: data.name,
      transaction_date: data.date,
      source: "manual",
    }),
  });
}

/**
 * Update an existing transaction.
 * @param {string} id
 * @param {object} data - { name, category, amount, date, type }
 * @returns {Promise<object>}
 */
export async function updateTransaction(id, data) {
  const payload = {};
  if (data.name !== undefined) payload.description = data.name;
  if (data.category !== undefined) payload.category_id = data.category;
  if (data.amount !== undefined) payload.amount = Math.abs(data.amount);
  if (data.type !== undefined) payload.type = data.type;
  if (data.date !== undefined) payload.transaction_date = data.date;

  return apiFetch(`/transactions/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

/**
 * Delete a transaction by id.
 * @param {string} id
 * @returns {Promise<void>}
 */
export async function deleteTransaction(id) {
  await apiFetch(`/transactions/${id}`, { method: "DELETE" });
}

/**
 * Get the full list of category objects ({ id, name, color }).
 * @returns {Promise<Array<{ id: string, name: string, color: string }>>}
 */
export async function getCategories() {
  const data = await apiFetch("/categories");
  return Array.isArray(data)
    ? data.map((c) => ({ id: c.id, name: c.name || c.id, color: c.color || "#6b7280" }))
    : [];
}

/** Name used for the system-level income category. */
export const INCOME_CATEGORY_NAME = "Income";

/**
 * Return only expense-eligible categories (excludes the Income category).
 * @param {Array} categories
 */
export function filterExpenseCategories(categories) {
  return categories.filter(
    (c) => c.name.toLowerCase() !== INCOME_CATEGORY_NAME.toLowerCase(),
  );
}

/**
 * Find the Income category from a categories list.
 * @param {Array} categories
 * @returns {object|undefined}
 */
export function findIncomeCategory(categories) {
  return categories.find(
    (c) => c.name.toLowerCase() === INCOME_CATEGORY_NAME.toLowerCase(),
  );
}
