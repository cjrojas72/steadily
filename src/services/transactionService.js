// import { apiFetch } from "@/lib/api";
import { transactions as mockTransactions } from "@/data/mockData";
// TODO: remove this import when wired to backend – spent amounts will be calculated server-side
import { adjustBudgetSpent } from "@/services/budgetService";

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

  // TODO: remove when wired to backend – the API recalculates spent from transactions
  if (data.type === "expense") {
    adjustBudgetSpent(data.category, Math.abs(data.amount));
  }

  return newTransaction;
}

/**
 * Update an existing transaction.
 * @param {number} id
 * @param {object} data - { name, category, amount, date, type }
 * @returns {Promise<object>}
 */
export async function updateTransaction(id, data) {
  // TODO: replace with  apiFetch(`/transactions/${id}`, { method: "PATCH", body: JSON.stringify(data) })
  const txn = mockTransactions.find((t) => t.id === id);
  if (!txn) throw new Error("Transaction not found");

  // TODO: remove budget adjustment when wired to backend
  // Reverse old spent amount
  if (txn.type === "expense") {
    adjustBudgetSpent(txn.category, -Math.abs(txn.amount));
  }

  Object.assign(txn, data);

  // Apply new spent amount
  if (txn.type === "expense") {
    adjustBudgetSpent(txn.category, Math.abs(txn.amount));
  }

  return txn;
}

/**
 * Delete a transaction by id.
 * @param {number} id
 * @returns {Promise<void>}
 */
export async function deleteTransaction(id) {
  // TODO: replace with  apiFetch(`/transactions/${id}`, { method: "DELETE" })
  const index = mockTransactions.findIndex((t) => t.id === id);
  if (index !== -1) {
    const txn = mockTransactions[index];

    // TODO: remove when wired to backend – the API recalculates spent from transactions
    if (txn.type === "expense") {
      adjustBudgetSpent(txn.category, -Math.abs(txn.amount));
    }

    mockTransactions.splice(index, 1);
  }
}

/**
 * Get the unique list of categories from all transactions.
 * @returns {Promise<string[]>}
 */
export async function getCategories() {
  // TODO: replace with  apiFetch("/categories")
  return Array.from(new Set(mockTransactions.map((t) => t.category)));
}
