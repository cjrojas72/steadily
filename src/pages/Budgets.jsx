import { useState, useMemo } from "react";
import { toast } from "sonner";
import { Plus, ChevronDown } from "lucide-react";
import { useBudgets } from "@/hooks/useBudgets";
import { deleteBudget } from "@/services/budgetService";
import { events } from "@/lib/events";
import { Card } from "@/components/Card";
import { PageHeader } from "@/components/PageHeader";
import { ProgressBar } from "@/components/ProgressBar";
import { BudgetCard } from "@/components/BudgetCard";
import { InsightCard } from "@/components/InsightCard";
import { Spinner } from "@/components/Spinner";
import { AddBudgetModal } from "@/components/AddBudgetModal";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { formatCurrency, formatPercentage } from "@/utils/formatters";

const INITIAL_LIMIT = 10;

export function Budgets() {
  const { budgets, summary, loading } = useBudgets();
  const [modalOpen, setModalOpen] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [showAll, setShowAll] = useState(false);
  const [deletingBudget, setDeletingBudget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleDeleteBudget = async () => {
    if (!deletingBudget) return;
    setDeleteLoading(true);
    try {
      await deleteBudget(deletingBudget.id);
      events.emit("budget-deleted");
      toast.success("Budget deleted successfully");
      setDeletingBudget(null);
    } catch (err) {
      toast.error(err.message || "Failed to delete budget");
    } finally {
      setDeleteLoading(false);
    }
  };

  // Derive unique categories (with colors) from the actual budgets list
  const categories = useMemo(() => {
    const seen = new Map();
    for (const b of budgets) {
      if (!seen.has(b.category)) {
        seen.set(b.category, b.color || "#6b7280");
      }
    }
    return Array.from(seen, ([name, color]) => ({ name, color }));
  }, [budgets]);

  // Filter by selected category
  const filteredBudgets = useMemo(
    () =>
      categoryFilter === "all"
        ? budgets
        : budgets.filter((b) => b.category === categoryFilter),
    [budgets, categoryFilter],
  );

  // Group filtered budgets by category (preserves category order)
  const groupedBudgets = useMemo(() => {
    const groups = {};
    for (const budget of filteredBudgets) {
      if (!groups[budget.category]) groups[budget.category] = [];
      groups[budget.category].push(budget);
    }
    return groups;
  }, [filteredBudgets]);

  // Flatten grouped budgets so we can apply the 10-item limit
  const flatBudgets = useMemo(
    () => Object.entries(groupedBudgets).flatMap(([cat, items]) =>
      items.map((b) => ({ ...b, _group: cat })),
    ),
    [groupedBudgets],
  );

  const visibleBudgets = showAll
    ? flatBudgets
    : flatBudgets.slice(0, INITIAL_LIMIT);
  const hiddenCount = flatBudgets.length - INITIAL_LIMIT;

  // Re-group the visible slice so we can render category headings
  const visibleGrouped = useMemo(() => {
    const groups = {};
    for (const b of visibleBudgets) {
      if (!groups[b._group]) groups[b._group] = [];
      groups[b._group].push(b);
    }
    return groups;
  }, [visibleBudgets]);

  if (loading || !summary) return <Spinner />;

  const { totalBudget, totalSpent, remaining } = summary;
  const spentPercent = (totalSpent / totalBudget) * 100;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Budgets"
        description="Manage your spending budgets"
        action={
          <button
            onClick={() => setModalOpen(true)}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-lg flex items-center gap-2 w-full sm:w-auto justify-center cursor-pointer hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Create Budget
          </button>
        }
      />

      {/* Overview */}
      <Card>
        <h3 className="mb-4">Budget Overview</h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-muted-foreground">Total Budget</span>
              <span>{formatCurrency(totalBudget)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-muted-foreground">Total Spent</span>
              <span>{formatCurrency(totalSpent)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Remaining</span>
              <span className={remaining >= 0 ? "text-green-600" : "text-red-600"}>
                {formatCurrency(remaining)}
              </span>
            </div>
          </div>

          <ProgressBar
            value={totalSpent}
            max={totalBudget}
            height="h-4"
          />

          <p className="text-sm text-muted-foreground">
            You've spent {formatPercentage(spentPercent)} of your total budget
          </p>
        </div>
      </Card>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => { setCategoryFilter("all"); setShowAll(false); }}
          className={`px-4 py-1.5 rounded-full text-sm transition-colors cursor-pointer ${
            categoryFilter === "all"
              ? "bg-primary text-primary-foreground"
              : "bg-card border border-border hover:bg-accent"
          }`}
        >
          All Categories
        </button>
        {categories.map((cat) => (
          <button
            key={cat.name}
            onClick={() => { setCategoryFilter(cat.name); setShowAll(false); }}
            className={`px-4 py-1.5 rounded-full text-sm transition-colors cursor-pointer flex items-center gap-2 ${
              categoryFilter === cat.name
                ? "bg-primary text-primary-foreground"
                : "bg-card border border-border hover:bg-accent"
            }`}
          >
            <span
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{ backgroundColor: cat.color }}
            />
            {cat.name}
          </button>
        ))}
      </div>

      {/* Budgets grouped by category */}
      {Object.entries(visibleGrouped).length === 0 ? (
        <Card>
          <p className="text-center text-muted-foreground py-4">
            No budgets found for this category.
          </p>
        </Card>
      ) : (
        Object.entries(visibleGrouped).map(([category, items]) => (
          <div key={category} className="space-y-3">
            <div className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-full shrink-0"
                style={{ backgroundColor: items[0]?.color || "#6b7280" }}
              />
              <h3 className="text-lg font-semibold">{category}</h3>
              <span className="text-sm text-muted-foreground">
                ({groupedBudgets[category]?.length ?? items.length})
              </span>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {items.map((budget) => (
                <BudgetCard key={budget.id} budget={budget} onDelete={setDeletingBudget} />
              ))}
            </div>
          </div>
        ))
      )}

      {/* Show more / Show less */}
      {!showAll && hiddenCount > 0 && (
        <div className="flex justify-center">
          <button
            onClick={() => setShowAll(true)}
            className="flex items-center gap-2 px-6 py-2.5 bg-card border border-border rounded-lg text-sm hover:bg-accent transition-colors cursor-pointer"
          >
            <ChevronDown className="w-4 h-4" />
            Show {hiddenCount} more budget{hiddenCount !== 1 ? "s" : ""}
          </button>
        </div>
      )}

      {showAll && flatBudgets.length > INITIAL_LIMIT && (
        <div className="flex justify-center">
          <button
            onClick={() => setShowAll(false)}
            className="flex items-center gap-2 px-6 py-2.5 bg-card border border-border rounded-lg text-sm hover:bg-accent transition-colors cursor-pointer"
          >
            Show less
          </button>
        </div>
      )}

      {/* Tips */}
      <InsightCard
        variant="blue"
        title="Budget Tips"
        items={[
          "Review your budgets regularly and adjust them based on your spending patterns",
          "Set realistic budget limits that align with your financial goals",
          "Use budget alerts to get notified when you're approaching your limits",
          "Track discretionary spending categories like dining and entertainment closely",
        ]}
      />

      <AddBudgetModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />

      <ConfirmDialog
        open={!!deletingBudget}
        onClose={() => setDeletingBudget(null)}
        onConfirm={handleDeleteBudget}
        title="Delete Budget"
        message={`Are you sure you want to delete the "${deletingBudget?.title || deletingBudget?.category}" budget? This action cannot be undone.`}
        confirmText="Delete Budget"
        loading={deleteLoading}
      />
    </div>
  );
}
