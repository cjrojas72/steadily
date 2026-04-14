import { useState, useEffect, useCallback } from "react";
import { getTransactions, getCategories } from "@/services/transactionService";
import { events } from "@/lib/events";

const PER_PAGE = 15;

/**
 * Manage transaction list with search, category filter, date range,
 * sorting, and pagination.
 * Automatically refreshes when a transaction event fires.
 */
export function useTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [sortBy, setSortBy] = useState("transaction_date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE));

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const [result, cats] = await Promise.all([
        getTransactions({
          search: searchTerm,
          category: filterCategory,
          startDate,
          endDate,
          sortBy,
          sortOrder,
          page,
          perPage: PER_PAGE,
        }),
        getCategories(),
      ]);

      const { items, total: t } = result;
      setTotal(t);

      // Normalise transactions so components always see { name, category, date, amount (signed) }
      const catMap = Object.fromEntries(cats.map((c) => [c.id, c]));
      const normalised = (Array.isArray(items) ? items : []).map((txn) => {
        const absAmount = Number(txn.amount || 0);
        return {
          ...txn,
          name: txn.description || txn.name || "",
          category: catMap[txn.category_id]?.name || txn.category_id || txn.category || "",
          date: txn.transaction_date || txn.date || "",
          amount: txn.type === "expense" ? -absAmount : absAmount,
        };
      });
      setTransactions(normalised);
      setCategories([{ id: "all", name: "All Categories" }, ...cats]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, filterCategory, startDate, endDate, sortBy, sortOrder, page]);

  useEffect(() => {
    load();
  }, [load]);

  // Reset to page 1 when filters change
  const setSearchTermAndReset = (val) => { setSearchTerm(val); setPage(1); };
  const setFilterCategoryAndReset = (val) => { setFilterCategory(val); setPage(1); };
  const setStartDateAndReset = (val) => { setStartDate(val); setPage(1); };
  const setEndDateAndReset = (val) => { setEndDate(val); setPage(1); };
  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "desc" ? "asc" : "desc"));
    setPage(1);
  };
  const setSortByAndReset = (val) => { setSortBy(val); setPage(1); };

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
    setSearchTerm: setSearchTermAndReset,
    filterCategory,
    setFilterCategory: setFilterCategoryAndReset,
    startDate,
    setStartDate: setStartDateAndReset,
    endDate,
    setEndDate: setEndDateAndReset,
    sortBy,
    setSortBy: setSortByAndReset,
    sortOrder,
    toggleSortOrder,
    page,
    setPage,
    totalPages,
    total,
    loading,
    error,
    refresh: load,
  };
}
