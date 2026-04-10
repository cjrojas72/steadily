import { useState } from "react";
import { Download, TrendingUp, CreditCard, Plus } from "lucide-react";
import { useTransactions } from "@/hooks/useTransactions";
import { Card } from "@/components/Card";
import { PageHeader } from "@/components/PageHeader";
import { SearchInput } from "@/components/SearchInput";
import { Spinner } from "@/components/Spinner";
import { AddTransactionModal } from "@/components/AddTransactionModal";
import { formatCurrency, formatDateLong, formatDate } from "@/utils/formatters";

export function Transactions() {
  const {
    transactions,
    categories,
    searchTerm,
    setSearchTerm,
    filterCategory,
    setFilterCategory,
    loading,
  } = useTransactions();

  const [modalOpen, setModalOpen] = useState(false);

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
                <option key={cat} value={cat}>
                  {cat === "all" ? "All Categories" : cat}
                </option>
              ))}
            </select>
            <button className="px-4 py-2 border border-border rounded-lg flex items-center gap-2 hover:bg-accent cursor-pointer transition-colors">
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Export</span>
            </button>
          </div>
        </div>
      </Card>

      {/* Loading state */}
      {loading ? (
        <Spinner />
      ) : (
        <>
          {/* Transactions Table */}
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            {/* Desktop view */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left px-6 py-3 text-muted-foreground">Date</th>
                    <th className="text-left px-6 py-3 text-muted-foreground">Description</th>
                    <th className="text-left px-6 py-3 text-muted-foreground">Category</th>
                    <th className="text-right px-6 py-3 text-muted-foreground">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((t, index) => (
                    <tr
                      key={t.id}
                      className={`border-t border-border hover:bg-accent/50 cursor-pointer ${
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
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile view */}
            <div className="md:hidden divide-y divide-border">
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
                    <p className={t.amount > 0 ? "text-green-600" : ""}>
                      {formatCurrency(t.amount, true)}
                    </p>
                  </div>
                  <span className="px-3 py-1 bg-muted rounded-full text-sm">
                    {t.category}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {transactions.length === 0 && (
            <Card className="p-12 text-center">
              <p className="text-muted-foreground">No transactions found</p>
            </Card>
          )}
        </>
      )}

      <AddTransactionModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
}
