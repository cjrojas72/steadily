import { useState, useEffect, useCallback } from "react";
import { getBudgets, getBudgetSummary } from "@/services/budgetService";
import { events } from "@/lib/events";

/**
 * Fetch budgets and summary totals.
 * Automatically refreshes when a "budget-created" event fires.
 */
export function useBudgets() {
  const [budgets, setBudgets] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const [b, s] = await Promise.all([getBudgets(), getBudgetSummary()]);
      setBudgets(b);
      setSummary(s);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // Re-fetch when a new budget is created
  useEffect(() => {
    const handleCreated = () => load();
    events.on("budget-created", handleCreated);
    return () => events.off("budget-created", handleCreated);
  }, [load]);

  return { budgets, summary, loading, error, refresh: load };
}
