import { AlertCircle, CheckCircle, Trash2, Calendar } from "lucide-react";
import { Card } from "./Card";
import { ProgressBar } from "./ProgressBar";
import { formatCurrency, formatPercentage } from "@/utils/formatters";

/**
 * Individual budget card shown on the Budgets page.
 *
 * @param {{ budget: object, onDelete?: (budget: object) => void }} props
 */
export function BudgetCard({ budget, onDelete }) {
  const percentage = (budget.spentAmount / budget.budgetAmount) * 100;
  const isOverBudget = budget.spentAmount > budget.budgetAmount;
  const remaining = budget.budgetAmount - budget.spentAmount;

  return (
    <Card>
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h4>{budget.title || budget.category}</h4>
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
              {budget.periodLabel || budget.period}
            </span>
          </div>
          {budget.periodRange && (
            <div className="flex items-center gap-1 mt-1">
              <Calendar className="w-3 h-3 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">{budget.periodRange}</p>
            </div>
          )}
          {budget.description && (
            <p className="text-xs text-muted-foreground mt-0.5">{budget.description}</p>
          )}
          <p className="text-sm text-muted-foreground mt-1">
            {formatCurrency(budget.spentAmount)} of{" "}
            {formatCurrency(budget.budgetAmount)}
          </p>
        </div>
        <div className="flex items-center gap-2">
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
          {onDelete && (
            <button
              onClick={() => onDelete(budget)}
              className="p-1.5 rounded-lg text-muted-foreground hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
              title="Delete budget"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
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
