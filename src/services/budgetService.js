// import { apiFetch } from "@/lib/api";
import { budgets as mockBudgets } from "@/data/mockData";

/**
 * Fetch all budgets for the current month.
 * @returns {Promise<Array>}
 */
export async function getBudgets() {
  // TODO: replace with  apiFetch("/budgets")
  return [...mockBudgets];
}

/**
 * Get budget summary totals.
 * @returns {Promise<{ totalBudget: number, totalSpent: number, remaining: number }>}
 */
export async function getBudgetSummary() {
  // TODO: replace with  apiFetch("/budgets/summary")
  const totalBudget = mockBudgets.reduce((s, b) => s + b.budgetAmount, 0);
  const totalSpent = mockBudgets.reduce((s, b) => s + b.spentAmount, 0);
  return { totalBudget, totalSpent, remaining: totalBudget - totalSpent };
}

/**
 * Create a new budget.
 * @param {object} data - { title, description, category, budgetAmount, color, period }
 * @returns {Promise<object>}
 */
export async function createBudget(data) {
  // TODO: replace with  apiFetch("/budgets", { method: "POST", body: JSON.stringify(data) })
  const newBudget = {
    id: Date.now(),
    spentAmount: 0,
    ...data,
  };
  mockBudgets.push(newBudget);
  return newBudget;
}

/**
 * Update an existing budget.
 * @param {number} id
 * @param {object} data
 * @returns {Promise<object>}
 */
export async function updateBudget(id, data) {
  // TODO: replace with  apiFetch(`/budgets/${id}`, { method: "PUT", body: JSON.stringify(data) })
  const budget = mockBudgets.find((b) => b.id === id);
  if (!budget) throw new Error("Budget not found");
  Object.assign(budget, data);
  return budget;
}

/**
 * Delete a budget.
 * @param {number} id
 * @returns {Promise<void>}
 */
export async function deleteBudget(id) {
  // TODO: replace with  apiFetch(`/budgets/${id}`, { method: "DELETE" })
  const index = mockBudgets.findIndex((b) => b.id === id);
  if (index !== -1) mockBudgets.splice(index, 1);
}

/**
 * Adjust the spentAmount on a budget matching the given category.
 * Positive amount increases spent (expense), negative decreases (income refund, deletion, etc).
 *
 * TODO: remove this function when wired to backend – the API will
 *       calculate spent amounts from actual transactions automatically.
 *
 * @param {string} category
 * @param {number} amount - absolute value to add to spentAmount
 */
export function adjustBudgetSpent(category, amount) {
  const budget = mockBudgets.find((b) => b.category === category);
  if (budget) {
    budget.spentAmount = Math.max(0, budget.spentAmount + amount);
  }
}
