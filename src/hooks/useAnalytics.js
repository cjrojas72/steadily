import { useState, useEffect } from "react";
import {
  getMonthlyTrend,
  getCategoryTrend,
  getWeeklySpending,
  getAverages,
} from "@/services/analyticsService";

/**
 * Fetch all analytics data.
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

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        const [monthlyTrend, categoryTrend, weeklySpending, averages] =
          await Promise.all([
            getMonthlyTrend(),
            getCategoryTrend(),
            getWeeklySpending(),
            getAverages(),
          ]);
        if (!cancelled) {
          setData({ monthlyTrend, categoryTrend, weeklySpending, averages });
        }
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, []);

  return { ...data, loading, error };
}
