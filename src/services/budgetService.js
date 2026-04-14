import { apiFetch } from "@/lib/api";

/**
 * Fetch all budgets (backend returns spent_amount calculated from transactions).
 * @returns {Promise<Array>}
 */
export async function getBudgets() {
  const data = await apiFetch("/budgets");
  // Normalise backend field names to what the frontend components expect
  return (Array.isArray(data) ? data : []).map(normaliseBudget);
}

/**
 * Get budget summary totals.
 * @returns {Promise<{ totalBudget: number, totalSpent: number, remaining: number }>}
 */
export async function getBudgetSummary() {
  const budgets = await getBudgets();
  const totalBudget = budgets.reduce((s, b) => s + b.budgetAmount, 0);
  const totalSpent = budgets.reduce((s, b) => s + b.spentAmount, 0);
  return { totalBudget, totalSpent, remaining: totalBudget - totalSpent };
}

/**
 * Create a new budget.
 * @param {object} data - { title, description, category, budgetAmount, color, period }
 * @returns {Promise<object>}
 */
export async function createBudget(data) {
  const result = await apiFetch("/budgets", {
    method: "POST",
    body: JSON.stringify({
      category_id: data.category,
      limit_amount: data.budgetAmount,
      period: data.period || "monthly",
      title: data.title || "",
      description: data.description || "",
    }),
  });
  return normaliseBudget(result);
}

/**
 * Delete a budget.
 * @param {string} id
 * @returns {Promise<void>}
 */
export async function deleteBudget(id) {
  await apiFetch(`/budgets/${id}`, { method: "DELETE" });
}

/**
 * Return all budgets that belong to a given category.
 * Used by the income allocation UI.
 * @param {string} categoryId - category UUID
 * @returns {Promise<Array>}
 */
export async function getBudgetsByCategory(categoryId) {
  const budgets = await getBudgets();
  return budgets.filter((b) => b.categoryId === categoryId);
}

/**
 * Apply income to specific budgets.
 * @param {Array<{ budgetId: string, amount: number }>} allocations
 * @returns {Promise<void>}
 */
export async function applyIncomeToBudgets(allocations) {
  await apiFetch("/budgets/apply-income", {
    method: "POST",
    body: JSON.stringify({
      allocations: allocations.map((a) => ({
        budget_id: a.budgetId,
        amount: a.amount,
      })),
    }),
  });
}

/**
 * Map backend field names (snake_case) to frontend field names (camelCase).
 * The backend returns: id, category_id, category_name, category_color,
 *   limit_amount, effective_limit, spent_amount, period, title, description
 * effective_limit = limit_amount + income_applied (income raises the ceiling)
 * The frontend expects: id, category (name), categoryId (uuid),
 *   budgetAmount, spentAmount, period, title, description, color
 */
function normaliseBudget(b) {
  const period = b.period || "monthly";
  const { label, range } = getPeriodInfo(period);

  return {
    id: b.id,
    categoryId: b.category_id || b.categoryId,
    category: b.category_name || b.category || b.category_id || "",
    budgetAmount: Number(b.effective_limit ?? b.limit_amount ?? b.budgetAmount ?? 0),
    spentAmount: Number(b.spent_amount ?? b.spentAmount ?? 0),
    period,
    periodLabel: label,
    periodRange: range,
    title: b.title || "",
    description: b.description || "",
    color: b.category_color || b.color || null,
  };
}

/**
 * Compute a human-readable label and active date range for a budget period.
 * The date ranges match the backend SQL logic:
 *   - weekly:  date_trunc('week', CURRENT_DATE) → Monday–Sunday (ISO week)
 *   - monthly: same year + month as CURRENT_DATE
 *   - yearly:  same year as CURRENT_DATE
 */
function getPeriodInfo(period) {
  const now = new Date();
  const fmt = (d) =>
    d.toLocaleDateString("en-US", { month: "short", day: "numeric" });

  switch (period) {
    case "weekly": {
      const day = now.getDay(); // 0=Sun … 6=Sat
      const diff = day === 0 ? 6 : day - 1; // days since Monday
      const start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - diff);
      const end = new Date(start.getFullYear(), start.getMonth(), start.getDate() + 6);
      return { label: "Weekly", range: `${fmt(start)} – ${fmt(end)}` };
    }
    case "yearly":
      return { label: "Yearly", range: String(now.getFullYear()) };
    default: // monthly
      return {
        label: "Monthly",
        range: now.toLocaleDateString("en-US", { month: "long", year: "numeric" }),
      };
  }
}
