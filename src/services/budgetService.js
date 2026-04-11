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
 * Return all budgets that belong to a given category.
 * Used by the income allocation UI to show which budgets can receive funds.
 *
 * TODO: replace with  apiFetch(`/budgets?category=${category}`) when wired to backend
 *
 * @param {string} category
 * @returns {Promise<Array>}
 */
export async function getBudgetsByCategory(category) {
  return mockBudgets.filter((b) => b.category === category);
}

/**
 * Adjust the spentAmount on a budget matching the given category.
 * Positive amount increases spent (expense), negative decreases (income).
 *
 * TODO: remove this function when wired to backend – the API will
 *       calculate spent amounts from actual transactions automatically.
 *
 * @param {string} category
 * @param {number} amount - value to add to spentAmount (positive = more spent, negative = less spent)
 */
export function adjustBudgetSpent(category, amount) {
  const budget = mockBudgets.find((b) => b.category === category);
  if (budget) {
    budget.spentAmount = Math.max(0, budget.spentAmount + amount);
  }
}

/**
 * Apply income to specific budgets by reducing their spentAmount.
 * Called after creating an income transaction with budget allocations.
 *
 * @param {Array<{ budgetId: number, amount: number }>} allocations
 *   Each entry has the budgetId and the dollar amount to apply.
 * @returns {Promise<void>}
 */
export async function applyIncomeToBudgets(allocations) {
  // TODO: replace with  apiFetch("/budgets/apply-income", {
  //   method: "POST",
  //   body: JSON.stringify({ allocations: allocations.map(a => ({ budget_id: a.budgetId, amount: a.amount })) }),
  // })
  for (const alloc of allocations) {
    const budget = mockBudgets.find((b) => b.id === alloc.budgetId);
    if (budget) {
      budget.spentAmount = Math.max(0, budget.spentAmount - alloc.amount);
    }
  }
}
