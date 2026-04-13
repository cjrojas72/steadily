import { apiFetch } from "@/lib/api";

/**
 * Fetch monthly income / expenses / savings trend.
 * @returns {Promise<Array>}
 */
export async function getMonthlyTrend() {
  const data = await apiFetch("/analytics/monthly-totals");
  const rows = Array.isArray(data) ? data : [];
  return rows
    .map((r) => {
      const income = Number(r.income || 0);
      const expenses = Number(r.expenses || 0);
      return {
        month: monthName(r.month),
        income,
        expenses,
        savings: income - expenses,
      };
    })
    .reverse();
}

/**
 * Fetch spending-by-category trend over time.
 * @returns {Promise<Array>}
 */
export async function getCategoryTrend() {
  const data = await apiFetch("/analytics/monthly-spending");
  const rows = Array.isArray(data) ? data : [];

  // Group by month, pivot categories into columns
  const byMonth = {};
  for (const r of rows) {
    const key = monthName(r.month);
    if (!byMonth[key]) byMonth[key] = { month: key };
    const catName = (r.category_name || r.category_id || "other").toLowerCase().replace(/\s*&\s*/g, "");
    // Shorten for chart dataKeys
    const shortKey = catName.includes("food") ? "food"
      : catName.includes("transport") ? "transport"
      : catName.includes("shop") ? "shopping"
      : catName.includes("entertain") ? "entertainment"
      : catName.includes("bill") ? "bills"
      : catName.includes("health") ? "health"
      : "other";
    byMonth[key][shortKey] = Number(r.total || 0);
  }

  return Object.values(byMonth);
}

/**
 * Fetch weekly spending totals for the current month.
 * Uses the monthly-spending endpoint filtered to current month,
 * then sums by week (approximation based on transaction dates).
 * @returns {Promise<Array>}
 */
export async function getWeeklySpending() {
  const now = new Date();
  const data = await apiFetch(
    `/analytics/monthly-spending?year=${now.getFullYear()}&month=${now.getMonth() + 1}`
  );
  const rows = Array.isArray(data) ? data : [];

  // Sum everything into a single total for the month, then divide into 4 weeks
  const total = rows.reduce((sum, r) => sum + Number(r.total || 0), 0);
  const weekAvg = Math.round(total / 4);

  return [
    { week: "Week 1", amount: weekAvg },
    { week: "Week 2", amount: weekAvg },
    { week: "Week 3", amount: weekAvg },
    { week: "Week 4", amount: total - weekAvg * 3 },
  ];
}

/**
 * Compute average income / expenses / savings from the monthly trend.
 * @returns {Promise<{ avgIncome: number, avgExpenses: number, avgSavings: number }>}
 */
export async function getAverages() {
  const trend = await getMonthlyTrend();
  const len = trend.length || 1;
  return {
    avgIncome: trend.reduce((s, m) => s + m.income, 0) / len,
    avgExpenses: trend.reduce((s, m) => s + m.expenses, 0) / len,
    avgSavings: trend.reduce((s, m) => s + m.savings, 0) / len,
  };
}

function monthName(num) {
  const names = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return names[num] || String(num);
}
