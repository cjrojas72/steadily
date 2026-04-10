// import { apiFetch } from "@/lib/api";
import { transactions as mockTransactions } from "@/data/mockData";

/**
 * Fetch all transactions, optionally filtered.
 * @param {{ search?: string, category?: string }} filters
 * @returns {Promise<Array>}
 */
export async function getTransactions(filters = {}) {
  // TODO: replace with  apiFetch("/transactions", { params: filters })
  let results = [...mockTransactions];

  if (filters.search) {
    const term = filters.search.toLowerCase();
    results = results.filter((t) => t.name.toLowerCase().includes(term));
  }

  if (filters.category && filters.category !== "all") {
    results = results.filter((t) => t.category === filters.category);
  }

  return results;
}

/**
 * Fetch the N most recent transactions.
 * @param {number} limit
 * @returns {Promise<Array>}
 */
export async function getRecentTransactions(limit = 5) {
  // TODO: replace with  apiFetch(`/transactions?limit=${limit}&sort=-date`)
  return mockTransactions.slice(0, limit);
}

/**
 * Create a new transaction.
 * @param {object} data - { name, category, amount, date, type }
 * @returns {Promise<object>}
 */
export async function createTransaction(data) {
  // TODO: replace with  apiFetch("/transactions", { method: "POST", body: JSON.stringify(data) })
  const newTransaction = {
    id: Date.now(),
    ...data,
  };
  mockTransactions.unshift(newTransaction);
  return newTransaction;
}

/**
 * Delete a transaction by id.
 * @param {number} id
 * @returns {Promise<void>}
 */
export async function deleteTransaction(id) {
  // TODO: replace with  apiFetch(`/transactions/${id}`, { method: "DELETE" })
  const index = mockTransactions.findIndex((t) => t.id === id);
  if (index !== -1) mockTransactions.splice(index, 1);
}

/**
 * Get the unique list of categories from all transactions.
 * @returns {Promise<string[]>}
 */
export async function getCategories() {
  // TODO: replace with  apiFetch("/categories")
  return Array.from(new Set(mockTransactions.map((t) => t.category)));
}
