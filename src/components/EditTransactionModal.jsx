import { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";
import { Modal } from "./Modal";
import { Spinner } from "./Spinner";
import {
  updateTransaction,
  getCategories,
  filterExpenseCategories,
  findIncomeCategory,
} from "@/services/transactionService";
import { getBudgetsByCategory, applyIncomeToBudgets } from "@/services/budgetService";
import { events } from "@/lib/events";
import { formatCurrency } from "@/utils/formatters";

/**
 * Modal form for editing an existing transaction.
 * When type is "income", shows a checklist of budgets in the selected
 * category so the user can allocate the income by percentage.
 *
 * @param {{
 *   open: boolean,
 *   onClose: () => void,
 *   transaction: object | null,
 * }} props
 */
export function EditTransactionModal({ open, onClose, transaction }) {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    description: "",
    category: "",
    amount: "",
    type: "expense",
    transaction_date: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Budget allocation state for income
  const [categoryBudgets, setCategoryBudgets] = useState([]);
  const [allocations, setAllocations] = useState({});

  // Fetch categories from API when modal opens
  useEffect(() => {
    if (!open) return;
    getCategories().then((cats) => setCategories(cats));
  }, [open]);

  // Pre-fill form when the transaction changes
  useEffect(() => {
    if (transaction) {
      setForm({
        description: transaction.name || "",
        // Use category_id (UUID) if available, fall back to category
        category: transaction.category_id || transaction.category || "",
        amount: String(Math.abs(transaction.amount)),
        type: transaction.type || "expense",
        transaction_date: transaction.date || "",
      });
      setError("");
      setAllocations({});
    }
  }, [transaction]);

  const expenseCategories = useMemo(
    () => filterExpenseCategories(categories),
    [categories],
  );

  const incomeCategory = useMemo(
    () => findIncomeCategory(categories),
    [categories],
  );

  useEffect(() => {
    if (form.type === "income" && incomeCategory) {
      setForm((prev) => ({ ...prev, category: incomeCategory.id }));
    } else if (form.type === "expense" && expenseCategories.length > 0) {
      const current = expenseCategories.find((c) => c.id === form.category);
      if (!current) {
        setForm((prev) => ({ ...prev, category: expenseCategories[0].id }));
      }
    }
  }, [form.type, incomeCategory, expenseCategories]);

  // Fetch budgets for the selected category when type is income
  useEffect(() => {
    if (form.type !== "income") {
      setCategoryBudgets([]);
      setAllocations({});
      return;
    }

    let cancelled = false;
    getBudgetsByCategory(form.category).then((budgets) => {
      if (cancelled) return;
      setCategoryBudgets(budgets);
    });

    return () => { cancelled = true; };
  }, [form.type, form.category]);

  const handleClose = () => {
    setError("");
    onClose();
  };

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const toggleBudget = (budgetId) => {
    setAllocations((prev) => {
      const existing = prev[budgetId];
      if (existing?.checked) {
        const next = { ...prev };
        delete next[budgetId];
        return next;
      }
      return { ...prev, [budgetId]: { checked: true, percentage: "" } };
    });
  };

  const setPercentage = (budgetId, value) => {
    setAllocations((prev) => ({
      ...prev,
      [budgetId]: { ...prev[budgetId], percentage: value },
    }));
  };

  const checkedAllocations = useMemo(
    () => Object.entries(allocations).filter(([, v]) => v.checked),
    [allocations],
  );
  const totalPercentage = useMemo(
    () => checkedAllocations.reduce((sum, [, v]) => sum + (parseFloat(v.percentage) || 0), 0),
    [checkedAllocations],
  );

  const isIncome = form.type === "income";
  const hasBudgets = categoryBudgets.length > 0;
  const hasAllocations = checkedAllocations.length > 0;

  // Form validity check for disabling submit
  const parsedAmountValid = parseFloat(form.amount) > 0;
  const baseFieldsValid =
    form.description.trim().length > 0 &&
    form.category.length > 0 &&
    parsedAmountValid &&
    form.transaction_date.length > 0;
  const allocationsValid =
    !isIncome ||
    !hasAllocations ||
    (Math.abs(totalPercentage - 100) < 0.01 &&
      checkedAllocations.every(([, v]) => parseFloat(v.percentage) > 0));
  const isFormValid = baseFieldsValid && allocationsValid;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const amount = parseFloat(form.amount);
    if (!form.description.trim()) {
      setError("Description is required");
      return;
    }
    if (isNaN(amount) || amount <= 0) {
      setError("Amount must be greater than 0");
      return;
    }
    if (!form.transaction_date) {
      setError("Date is required");
      return;
    }

    // Validate allocations for income with selected budgets
    if (isIncome && hasAllocations) {
      if (Math.abs(totalPercentage - 100) > 0.01) {
        setError(`Allocation percentages must total 100% (currently ${totalPercentage.toFixed(1)}%)`);
        return;
      }
      for (const [, v] of checkedAllocations) {
        const pct = parseFloat(v.percentage);
        if (isNaN(pct) || pct <= 0) {
          setError("Each selected budget must have a percentage greater than 0");
          return;
        }
      }
    }

    setSubmitting(true);
    try {
      // 1. Update the transaction
      await updateTransaction(transaction.id, {
        name: form.description.trim(),
        category: form.category,
        amount: isIncome ? amount : -amount,
        date: form.transaction_date,
        type: form.type,
      });

      // 2. If income with allocations, update each budget directly
      if (isIncome && hasAllocations) {
        const budgetUpdates = checkedAllocations.map(([budgetId, v]) => ({
          budgetId,
          amount: (parseFloat(v.percentage) / 100) * amount,
        }));
        await applyIncomeToBudgets(budgetUpdates);
      }

      events.emit("transaction-updated");
      toast.success("Transaction updated successfully");
      handleClose();
    } catch (err) {
      setError(err.message || "Failed to update transaction");
    } finally {
      setSubmitting(false);
    }
  };

  const parsedAmount = parseFloat(form.amount) || 0;

  return (
    <Modal open={open} onClose={handleClose} title="Edit Transaction">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-lg p-3 text-sm text-red-700 dark:text-red-200">
            {error}
          </div>
        )}

        {/* Type */}
        <div>
          <label className="block mb-2">Type</label>
          <div className="flex gap-2">
            {["expense", "income"].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setForm((prev) => ({ ...prev, type: t }))}
                className={`flex-1 px-4 py-2 rounded-lg border transition-colors cursor-pointer capitalize ${
                  form.type === t
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-border hover:bg-accent"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block mb-2">Description <span className="text-red-500">*</span></label>
          <input
            type="text"
            value={form.description}
            onChange={handleChange("description")}
            placeholder="e.g. Whole Foods Market"
            className="w-full px-4 py-2 bg-input-background border border-border rounded-lg"
            required
          />
        </div>

        {/* Category */}
        <div>
          <label className="block mb-2">Category <span className="text-red-500">*</span></label>
          <select
            value={form.category}
            onChange={handleChange("category")}
            className="w-full px-4 py-2 bg-input-background border border-border rounded-lg"
            required
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Amount */}
        <div>
          <label className="block mb-2">Amount ($) <span className="text-red-500">*</span></label>
          <input
            type="number"
            min="0.01"
            step="0.01"
            value={form.amount}
            onChange={handleChange("amount")}
            placeholder="0.00"
            className="w-full px-4 py-2 bg-input-background border border-border rounded-lg"
            required
          />
        </div>

        {/* Date */}
        <div>
          <label className="block mb-2">Date <span className="text-red-500">*</span></label>
          <input
            type="date"
            value={form.transaction_date}
            onChange={handleChange("transaction_date")}
            className="w-full px-4 py-2 bg-input-background border border-border rounded-lg"
            required
          />
        </div>

        {/* Income budget allocation */}
        {isIncome && hasBudgets && (
          <div className="border border-border rounded-lg p-4 space-y-3">
            <div>
              <label className="block font-medium mb-1">Allocate to Budgets</label>
              <p className="text-xs text-muted-foreground">
                Select which budgets should receive this income and set the percentage for each.
              </p>
            </div>

            <div className="space-y-2">
              {categoryBudgets.map((budget) => {
                const alloc = allocations[budget.id];
                const isChecked = !!alloc?.checked;
                const pct = parseFloat(alloc?.percentage) || 0;
                const portion = parsedAmount > 0 ? (pct / 100) * parsedAmount : 0;

                return (
                  <div key={budget.id} className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleBudget(budget.id)}
                      className="w-4 h-4 rounded border-border cursor-pointer accent-primary"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm truncate">{budget.title || budget.category}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatCurrency(budget.spentAmount)} / {formatCurrency(budget.budgetAmount)} spent
                      </p>
                    </div>
                    {isChecked && (
                      <div className="flex items-center gap-1.5 shrink-0">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          step="1"
                          value={alloc?.percentage ?? ""}
                          onChange={(e) => setPercentage(budget.id, e.target.value)}
                          placeholder="0"
                          className="w-16 px-2 py-1 text-sm bg-input-background border border-border rounded-lg text-right"
                        />
                        <span className="text-sm text-muted-foreground">%</span>
                        {portion > 0 && (
                          <span className="text-xs text-green-600 ml-1">
                            {formatCurrency(portion)}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {hasAllocations && (
              <div className={`flex justify-between text-sm pt-2 border-t border-border ${
                Math.abs(totalPercentage - 100) < 0.01
                  ? "text-green-600"
                  : "text-amber-600"
              }`}>
                <span>Total allocation</span>
                <span>{totalPercentage.toFixed(1)}% of {formatCurrency(parsedAmount)}</span>
              </div>
            )}
          </div>
        )}

        {isIncome && !hasBudgets && (
          <div className="border border-dashed border-border rounded-lg p-3 text-sm text-muted-foreground text-center">
            No budgets found for {categories.find((c) => c.id === form.category)?.name || "this category"}. Income will be recorded without budget allocation.
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={submitting || !isFormValid}
          className="w-full bg-primary text-primary-foreground px-4 py-2 rounded-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer hover:bg-primary/90 transition-colors"
        >
          {submitting ? (
            <>
              <Spinner size="w-4 h-4" inline />
              Saving...
            </>
          ) : (
            "Save Changes"
          )}
        </button>
      </form>
    </Modal>
  );
}
