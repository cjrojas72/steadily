import { apiFetch } from "@/lib/api";
import { getRecentTransactions, getCategories } from "./transactionService";

/**
 * Fetch dashboard summary (balance, income, expenses, savings).
 * Uses the monthly-totals analytics endpoint.
 * @returns {Promise<object>}
 */
export async function getDashboardSummary() {
  const data = await apiFetch("/analytics/monthly-totals");
  const rows = Array.isArray(data) ? data : [];

  // Current month totals
  const current = rows[0] || {};
  const income = Number(current.income || 0);
  const expenses = Number(current.expenses || 0);

  // Savings = current month net (what you saved this month)
  const savings = income - expenses;

  // Total balance = cumulative all-time (income - expenses)
  const totalBalance = rows.reduce(
    (sum, r) => sum + Number(r.income || 0) - Number(r.expenses || 0),
    0,
  );

  // Previous month for change calculation
  const prev = rows[1] || {};
  const prevSavings = Number(prev.income || 0) - Number(prev.expenses || 0);
  const savingsChange = prevSavings !== 0
    ? ((savings - prevSavings) / Math.abs(prevSavings)) * 100
    : 0;

  return {
    totalBalance,
    income,
    expenses,
    savings,
    savingsChange: Math.round(savingsChange * 10) / 10,
  };
}

/**
 * Fetch income-vs-expenses chart data.
 * @returns {Promise<Array>}
 */
export async function getIncomeVsExpenses() {
  const data = await apiFetch("/analytics/monthly-totals");
  const rows = Array.isArray(data) ? data : [];
  return rows
    .map((r) => ({
      month: monthName(r.month),
      income: Number(r.income || 0),
      expenses: Number(r.expenses || 0),
    }))
    .reverse();
}

/**
 * Fetch spending-by-category breakdown for the pie chart.
 * Filters to the current month and aggregates by category name
 * so each category appears as a single slice.
 * @returns {Promise<Array>}
 */
export async function getSpendingByCategory() {
  const now = new Date();
  const data = await apiFetch(
    `/analytics/monthly-spending?year=${now.getFullYear()}&month=${now.getMonth() + 1}`,
  );
  const rows = Array.isArray(data) ? data : [];

  // Aggregate by category name in case of duplicates
  const map = new Map();
  for (const r of rows) {
    const name = r.category_name || r.category_id;
    const existing = map.get(name);
    if (existing) {
      existing.value += Number(r.total || 0);
    } else {
      map.set(name, {
        name,
        value: Number(r.total || 0),
        color: r.color || "#6b7280",
      });
    }
  }
  return Array.from(map.values());
}

/**
 * Convenience – fetch everything the Dashboard page needs in one call.
 * @returns {Promise<object>}
 */
export async function getDashboardData() {
  const [summary, incomeVsExpenses, spendingByCategory, rawTransactions, cats] =
    await Promise.all([
      getDashboardSummary(),
      getIncomeVsExpenses(),
      getSpendingByCategory(),
      getRecentTransactions(5),
      getCategories(),
    ]);

  // Normalise raw backend transactions for display
  const catMap = Object.fromEntries(cats.map((c) => [c.id, c]));
  const recentTransactions = (Array.isArray(rawTransactions) ? rawTransactions : []).map((t) => {
    const absAmount = Number(t.amount || 0);
    return {
      ...t,
      name: t.description || t.name || "",
      category: catMap[t.category_id]?.name || t.category_id || t.category || "",
      date: t.transaction_date || t.date || "",
      amount: t.type === "expense" ? -absAmount : absAmount,
    };
  });

  return { summary, incomeVsExpenses, spendingByCategory, recentTransactions };
}

function monthName(num) {
  const names = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return names[num] || String(num);
}
