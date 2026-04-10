// import { apiFetch } from "@/lib/api";
import {
  monthlyTrend as mockMonthlyTrend,
  categoryTrend as mockCategoryTrend,
  weeklySpending as mockWeeklySpending,
} from "@/data/mockData";

/**
 * Fetch monthly income / expenses / savings trend.
 * @returns {Promise<Array>}
 */
export async function getMonthlyTrend() {
  // TODO: replace with  apiFetch("/analytics/monthly-trend")
  return [...mockMonthlyTrend];
}

/**
 * Fetch spending-by-category trend over time.
 * @returns {Promise<Array>}
 */
export async function getCategoryTrend() {
  // TODO: replace with  apiFetch("/analytics/category-trend")
  return [...mockCategoryTrend];
}

/**
 * Fetch weekly spending totals for the current month.
 * @returns {Promise<Array>}
 */
export async function getWeeklySpending() {
  // TODO: replace with  apiFetch("/analytics/weekly-spending")
  return [...mockWeeklySpending];
}

/**
 * Compute average income / expenses / savings from the monthly trend.
 * @returns {Promise<{ avgIncome: number, avgExpenses: number, avgSavings: number }>}
 */
export async function getAverages() {
  // TODO: replace with  apiFetch("/analytics/averages")
  const data = mockMonthlyTrend;
  const len = data.length;
  return {
    avgIncome: data.reduce((s, m) => s + m.income, 0) / len,
    avgExpenses: data.reduce((s, m) => s + m.expenses, 0) / len,
    avgSavings: data.reduce((s, m) => s + m.savings, 0) / len,
  };
}
