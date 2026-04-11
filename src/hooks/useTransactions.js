import { useState, useEffect, useCallback } from "react";
import { getTransactions, getCategories } from "@/services/transactionService";
import { events } from "@/lib/events";

/**
 * Manage transaction list with search + category filter.
 * Automatically refreshes when a "transaction-created" event fires.
 */
export function useTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const [txns, cats] = await Promise.all([
        getTransactions({ search: searchTerm, category: filterCategory }),
        getCategories(),
      ]);
      setTransactions(txns);
      setCategories(["all", ...cats]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, filterCategory]);

  useEffect(() => {
    load();
  }, [load]);

  // Re-fetch when transactions change (created, updated, or deleted)
  useEffect(() => {
    const handleRefresh = () => load();
    events.on("transaction-created", handleRefresh);
    events.on("transaction-updated", handleRefresh);
    events.on("transaction-deleted", handleRefresh);
    return () => {
      events.off("transaction-created", handleRefresh);
      events.off("transaction-updated", handleRefresh);
      events.off("transaction-deleted", handleRefresh);
    };
  }, [load]);

  return {
    transactions,
    categories,
    searchTerm,
    setSearchTerm,
    filterCategory,
    setFilterCategory,
    loading,
    error,
    refresh: load,
  };
}
