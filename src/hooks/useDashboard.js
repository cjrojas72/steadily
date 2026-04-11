import { useState, useEffect, useCallback } from "react";
import { getDashboardData } from "@/services/dashboardService";
import { events } from "@/lib/events";

/**
 * Fetch everything the Dashboard page needs.
 * Automatically refreshes when transactions or budgets change.
 * Returns { data, loading, error }.
 */
export function useDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const result = await getDashboardData();
      setData(result);
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

  return { data, loading, error };
}
