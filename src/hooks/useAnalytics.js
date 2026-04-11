import { useState, useEffect, useCallback } from "react";
import {
  getMonthlyTrend,
  getCategoryTrend,
  getWeeklySpending,
  getAverages,
} from "@/services/analyticsService";
import { events } from "@/lib/events";

/**
 * Fetch all analytics data.
 * Automatically refreshes when transactions or budgets change.
 * Returns { monthlyTrend, categoryTrend, weeklySpending, averages, loading, error }.
 */
export function useAnalytics() {
  const [data, setData] = useState({
    monthlyTrend: [],
    categoryTrend: [],
    weeklySpending: [],
    averages: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const [monthlyTrend, categoryTrend, weeklySpending, averages] =
        await Promise.all([
          getMonthlyTrend(),
          getCategoryTrend(),
          getWeeklySpending(),
          getAverages(),
        ]);
      setData({ monthlyTrend, categoryTrend, weeklySpending, averages });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // Re-fetch when transactions or budgets change
  useEffect(() => {
    const handleRefresh = () => load();
    events.on("transaction-created", handleRefresh);
    events.on("transaction-updated", handleRefresh);
    events.on("transaction-deleted", handleRefresh);
    events.on("budget-created", handleRefresh);
    events.on("budget-deleted", handleRefresh);
    return () => {
      events.off("transaction-created", handleRefresh);
      events.off("transaction-updated", handleRefresh);
      events.off("transaction-deleted", handleRefresh);
      events.off("budget-created", handleRefresh);
      events.off("budget-deleted", handleRefresh);
    };
  }, [load]);

  return { ...data, loading, error };
}
