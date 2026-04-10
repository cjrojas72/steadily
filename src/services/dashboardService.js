// import { apiFetch } from "@/lib/api";
import {
  dashboardSummary as mockSummary,
  monthlyData as mockMonthlyData,
  categoryData as mockCategoryData,
} from "@/data/mockData";
import { getRecentTransactions } from "./transactionService";

/**
 * Fetch dashboard summary (balance, income, expenses, savings).
 * @returns {Promise<object>}
 */
export async function getDashboardSummary() {
  // TODO: replace with  apiFetch("/analytics/summary")
  return { ...mockSummary };
}

/**
 * Fetch income-vs-expenses chart data.
 * @returns {Promise<Array>}
 */
export async function getIncomeVsExpenses() {
  // TODO: replace with  apiFetch("/analytics/income-vs-expenses")
  return [...mockMonthlyData];
}

/**
 * Fetch spending-by-category breakdown for the pie chart.
 * @returns {Promise<Array>}
 */
export async function getSpendingByCategory() {
  // TODO: replace with  apiFetch("/analytics/spending-by-category")
  return [...mockCategoryData];
}

/**
 * Convenience – fetch everything the Dashboard page needs in one call.
 * @returns {Promise<object>}
 */
export async function getDashboardData() {
  const [summary, incomeVsExpenses, spendingByCategory, recentTransactions] =
    await Promise.all([
      getDashboardSummary(),
      getIncomeVsExpenses(),
      getSpendingByCategory(),
      getRecentTransactions(5),
    ]);

  return { summary, incomeVsExpenses, spendingByCategory, recentTransactions };
}
