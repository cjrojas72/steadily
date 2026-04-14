import { useState } from "react";
import { toast } from "sonner";
import {
  Download,
  TrendingUp,
  CreditCard,
  Plus,
  Pencil,
  Trash2,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useTransactions } from "@/hooks/useTransactions";
import { deleteTransaction } from "@/services/transactionService";
import { exportTransactionsCsv } from "@/utils/exportCsv";
import { events } from "@/lib/events";
import { Card } from "@/components/Card";
import { PageHeader } from "@/components/PageHeader";
import { SearchInput } from "@/components/SearchInput";
import { Spinner } from "@/components/Spinner";
import { AddTransactionModal } from "@/components/AddTransactionModal";
import { EditTransactionModal } from "@/components/EditTransactionModal";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { formatCurrency, formatDateLong, formatDate } from "@/utils/formatters";

export function Transactions() {
  const {
    transactions,
    categories,
    searchTerm,
    setSearchTerm,
    filterCategory,
    setFilterCategory,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    sortBy,
    setSortBy,
    sortOrder,
    toggleSortOrder,
    page,
    setPage,
    totalPages,
    total,
    loading,
  } = useTransactions();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingTxn, setEditingTxn] = useState(null);
  const [deletingTxn, setDeletingTxn] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleDelete = async () => {
    if (!deletingTxn) return;
    setDeleteLoading(true);
    try {
      await deleteTransaction(deletingTxn.id);
      events.emit("transaction-deleted");
      toast.success("Transaction deleted successfully");
      setDeletingTxn(null);
    } catch (err) {
      toast.error(err.message || "Failed to delete transaction");
    } finally {
      setDeleteLoading(false);
    }
  };

  /** Render the sort icon for a sortable column header */
  const SortIcon = ({ column }) => {
    if (sortBy !== column) return <ArrowUpDown className="w-3.5 h-3.5 opacity-40" />;
    return sortOrder === "asc"
      ? <ArrowUp className="w-3.5 h-3.5" />
      : <ArrowDown className="w-3.5 h-3.5" />;
  };

  /** Click a column header to sort by it, or toggle direction */
  const handleSort = (column) => {
    if (sortBy === column) {
      toggleSortOrder();
    } else {
      setSortBy(column);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Transactions"
        description="View and manage your transactions"
        action={
          <button
            onClick={() => setModalOpen(true)}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-lg flex items-center gap-2 w-full sm:w-auto justify-center cursor-pointer hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Transaction
          </button>
        }
      />

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col gap-4">
          {/* Row 1: Search + Category + Export */}
          <div className="flex flex-col lg:flex-row gap-4">
            <SearchInput
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Search transactions..."
            />
            <div className="flex gap-2">
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-4 py-2 bg-input-background border border-border rounded-lg"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <button
                onClick={() => {
                  if (transactions.length === 0) {
                    toast.error("No transactions to export");
                    return;
                  }
                  exportTransactionsCsv(transactions);
                  toast.success(`Exported ${transactions.length} transaction${transactions.length !== 1 ? "s" : ""}`);
                }}
                disabled={transactions.length === 0}
                className="px-4 py-2 border border-border rounded-lg flex items-center gap-2 hover:bg-accent cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Export</span>
              </button>
            </div>
          </div>

          {/* Row 2: Date range */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
            <span className="text-sm text-muted-foreground whitespace-nowrap">Date range:</span>
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="px-3 py-2 bg-input-background border border-border rounded-lg text-sm"
              />
              <span className="text-muted-foreground">to</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="px-3 py-2 bg-input-background border border-border rounded-lg text-sm"
              />
              {(startDate || endDate) && (
                <button
                  onClick={() => { setStartDate(""); setEndDate(""); }}
                  className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground border border-border rounded-lg hover:bg-accent transition-colors cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Loading state */}
      {loading ? (
        <Spinner />
      ) : (
        <>
          {/* Result count */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {total} transaction{total !== 1 ? "s" : ""}
              {total > 0 && (
                <span>
                  {" "}&middot; Page {page} of {totalPages}
                </span>
              )}
            </p>
          </div>

          {/* Transactions Table */}
          <div className="bg-card border border-border rounded-lg overflow-hidden shadow">
            {/* Desktop view */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th
                      onClick={() => handleSort("transaction_date")}
                      className="text-left px-6 py-3 text-muted-foreground cursor-pointer hover:text-foreground transition-colors select-none"
                    >
                      <span className="flex items-center gap-1.5">
                        Date
                        <SortIcon column="transaction_date" />
                      </span>
                    </th>
                    <th
                      onClick={() => handleSort("description")}
                      className="text-left px-6 py-3 text-muted-foreground cursor-pointer hover:text-foreground transition-colors select-none"
                    >
                      <span className="flex items-center gap-1.5">
                        Description
                        <SortIcon column="description" />
                      </span>
                    </th>
                    <th className="text-left px-6 py-3 text-muted-foreground">Category</th>
                    <th
                      onClick={() => handleSort("amount")}
                      className="text-right px-6 py-3 text-muted-foreground cursor-pointer hover:text-foreground transition-colors select-none"
                    >
                      <span className="flex items-center justify-end gap-1.5">
                        Amount
                        <SortIcon column="amount" />
                      </span>
                    </th>
                    <th className="px-6 py-3 text-muted-foreground w-24"></th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((t, index) => (
                    <tr
                      key={t.id}
                      className={`border-t border-border hover:bg-accent/50 ${
                        index % 2 !== 0 ? "bg-muted/20" : ""
                      }`}
                    >
                      <td className="px-6 py-4 text-muted-foreground">
                        {formatDateLong(t.date)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              t.type === "income" ? "bg-green-500/10" : "bg-muted"
                            }`}
                          >
                            {t.type === "income" ? (
                              <TrendingUp className="w-5 h-5 text-green-600" />
                            ) : (
                              <CreditCard className="w-5 h-5 text-muted-foreground" />
                            )}
                          </div>
                          <span>{t.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-muted rounded-full text-sm">
                          {t.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className={t.amount > 0 ? "text-green-600" : ""}>
                          {formatCurrency(t.amount, true)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => setEditingTxn(t)}
                            className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-accent transition-colors cursor-pointer"
                            title="Edit transaction"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeletingTxn(t)}
                            className="p-1.5 rounded-lg text-muted-foreground hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
                            title="Delete transaction"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile view */}
            <div className="md:hidden divide-y divide-border">
              {/* Mobile sort control */}
              <div className="p-3 bg-muted/50 flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="text-xs px-2 py-1 bg-input-background border border-border rounded-lg"
                >
                  <option value="transaction_date">Date</option>
                  <option value="amount">Amount</option>
                  <option value="description">Description</option>
                </select>
                <button
                  onClick={toggleSortOrder}
                  className="p-1 rounded border border-border hover:bg-accent transition-colors cursor-pointer"
                  title={sortOrder === "asc" ? "Ascending" : "Descending"}
                >
                  {sortOrder === "asc" ? (
                    <ArrowUp className="w-3.5 h-3.5" />
                  ) : (
                    <ArrowDown className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>

              {transactions.map((t) => (
                <div key={t.id} className="p-4 hover:bg-accent/50">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          t.type === "income" ? "bg-green-500/10" : "bg-muted"
                        }`}
                      >
                        {t.type === "income" ? (
                          <TrendingUp className="w-5 h-5 text-green-600" />
                        ) : (
                          <CreditCard className="w-5 h-5 text-muted-foreground" />
                        )}
                      </div>
                      <div>
                        <p>{t.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(t.date)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <p className={t.amount > 0 ? "text-green-600" : ""}>
                        {formatCurrency(t.amount, true)}
                      </p>
                      <button
                        onClick={() => setEditingTxn(t)}
                        className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-accent transition-colors cursor-pointer"
                        title="Edit transaction"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeletingTxn(t)}
                        className="p-1.5 rounded-lg text-muted-foreground hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
                        title="Delete transaction"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-muted rounded-full text-sm">
                    {t.category}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Empty state */}
          {transactions.length === 0 && (
            <Card className="p-12 text-center">
              <p className="text-muted-foreground">No transactions found</p>
            </Card>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page <= 1}
                className="p-2 rounded-lg border border-border hover:bg-accent transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {/* Page numbers */}
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((p) => {
                  // Show first, last, and pages near the current page
                  if (p === 1 || p === totalPages) return true;
                  return Math.abs(p - page) <= 1;
                })
                .reduce((acc, p, i, arr) => {
                  // Insert ellipsis between non-consecutive pages
                  if (i > 0 && p - arr[i - 1] > 1) {
                    acc.push("ellipsis-" + p);
                  }
                  acc.push(p);
                  return acc;
                }, [])
                .map((p) =>
                  typeof p === "string" ? (
                    <span key={p} className="px-1 text-muted-foreground">
                      &hellip;
                    </span>
                  ) : (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-9 h-9 rounded-lg text-sm transition-colors cursor-pointer ${
                        p === page
                          ? "bg-primary text-primary-foreground"
                          : "border border-border hover:bg-accent"
                      }`}
                    >
                      {p}
                    </button>
                  ),
                )}

              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page >= totalPages}
                className="p-2 rounded-lg border border-border hover:bg-accent transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </>
      )}

      <AddTransactionModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />

      <EditTransactionModal
        open={!!editingTxn}
        onClose={() => setEditingTxn(null)}
        transaction={editingTxn}
      />

      <ConfirmDialog
        open={!!deletingTxn}
        onClose={() => setDeletingTxn(null)}
        onConfirm={handleDelete}
        title="Delete Transaction"
        message={`Are you sure you want to delete "${deletingTxn?.name}"? This action cannot be undone.`}
        confirmText="Delete Transaction"
        loading={deleteLoading}
      />
    </div>
  );
}
