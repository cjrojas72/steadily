import { useState } from "react";
import { Plus } from "lucide-react";
import { useBudgets } from "@/hooks/useBudgets";
import { Card } from "@/components/Card";
import { PageHeader } from "@/components/PageHeader";
import { ProgressBar } from "@/components/ProgressBar";
import { BudgetCard } from "@/components/BudgetCard";
import { InsightCard } from "@/components/InsightCard";
import { Spinner } from "@/components/Spinner";
import { AddBudgetModal } from "@/components/AddBudgetModal";
import { formatCurrency, formatPercentage } from "@/utils/formatters";

export function Budgets() {
  const { budgets, summary, loading } = useBudgets();
  const [modalOpen, setModalOpen] = useState(false);

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
        <h3 className="mb-4">Monthly Overview</h3>
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

      {/* Individual Budgets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {budgets.map((budget) => (
          <BudgetCard key={budget.id} budget={budget} />
        ))}
      </div>

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
    </div>
  );
}
