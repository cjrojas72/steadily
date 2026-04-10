import { AlertCircle, CheckCircle } from "lucide-react";
import { Card } from "./Card";
import { ProgressBar } from "./ProgressBar";
import { formatCurrency, formatPercentage } from "@/utils/formatters";

/**
 * Individual budget card shown on the Budgets page.
 *
 * @param {{ budget: object }} props
 */
export function BudgetCard({ budget }) {
  const percentage = (budget.spentAmount / budget.budgetAmount) * 100;
  const isOverBudget = budget.spentAmount > budget.budgetAmount;
  const remaining = budget.budgetAmount - budget.spentAmount;

  return (
    <Card>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h4>{budget.category}</h4>
          <p className="text-sm text-muted-foreground mt-1">
            {formatCurrency(budget.spentAmount)} of{" "}
            {formatCurrency(budget.budgetAmount)}
          </p>
        </div>
        {isOverBudget ? (
          <div className="flex items-center gap-1 text-red-600">
            <AlertCircle className="w-5 h-5" />
            <span className="text-sm">Over budget</span>
          </div>
        ) : percentage >= 80 ? (
          <div className="flex items-center gap-1 text-yellow-600">
            <AlertCircle className="w-5 h-5" />
            <span className="text-sm">Warning</span>
          </div>
        ) : (
          <div className="flex items-center gap-1 text-green-600">
            <CheckCircle className="w-5 h-5" />
            <span className="text-sm">On track</span>
          </div>
        )}
      </div>

      <ProgressBar
        value={budget.spentAmount}
        max={budget.budgetAmount}
        color={budget.color}
      />

      <div className="flex justify-between text-sm mt-2">
        <span className="text-muted-foreground">
          {formatPercentage(percentage)} used
        </span>
        <span className={remaining >= 0 ? "text-green-600" : "text-red-600"}>
          {formatCurrency(Math.abs(remaining))}{" "}
          {remaining >= 0 ? "left" : "over"}
        </span>
      </div>
    </Card>
  );
}
