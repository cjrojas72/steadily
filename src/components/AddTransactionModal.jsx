import { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";
import { Modal } from "./Modal";
import { Spinner } from "./Spinner";
import {
  createTransaction,
  getCategories,
  filterExpenseCategories,
  findIncomeCategory,
} from "@/services/transactionService";
import { events } from "@/lib/events";

/**
 * Modal form for adding a new transaction.
 *
 * - Expense: user picks a category from the dropdown (Income is hidden).
 * - Income:  category is automatically set to "Income" (hidden from user).
 *            No budget allocation — income simply increases total balance.
 */
export function AddTransactionModal({ open, onClose }) {
  const [allCategories, setAllCategories] = useState([]);
  const [form, setForm] = useState({
    description: "",
    category: "",
    amount: "",
    type: "expense",
    transaction_date: new Date().toISOString().split("T")[0],
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Categories available for the expense dropdown (excludes Income)
  const expenseCategories = useMemo(
    () => filterExpenseCategories(allCategories),
    [allCategories],
  );

  // The system Income category
  const incomeCategory = useMemo(
    () => findIncomeCategory(allCategories),
    [allCategories],
  );

  // Fetch categories from API when modal opens
  useEffect(() => {
    if (!open) return;
    getCategories().then((cats) => {
      setAllCategories(cats);
      const expense = filterExpenseCategories(cats);
      if (expense.length > 0 && !form.category) {
        setForm((prev) => ({ ...prev, category: expense[0].id }));
      }
    });
  }, [open]);

  // When switching to income, auto-set category to the Income category
  useEffect(() => {
    if (form.type === "income" && incomeCategory) {
      setForm((prev) => ({ ...prev, category: incomeCategory.id }));
    } else if (form.type === "expense" && expenseCategories.length > 0) {
      // Make sure we're not still pointing at the Income category
      const current = expenseCategories.find((c) => c.id === form.category);
      if (!current) {
        setForm((prev) => ({ ...prev, category: expenseCategories[0].id }));
      }
    }
  }, [form.type, incomeCategory, expenseCategories]);

  const reset = () => {
    setForm({
      description: "",
      category: expenseCategories[0]?.id || "",
      amount: "",
      type: "expense",
      transaction_date: new Date().toISOString().split("T")[0],
    });
    setError("");
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const isIncome = form.type === "income";

  // Form validity
  const parsedAmountValid = parseFloat(form.amount) > 0;
  const isFormValid =
    form.description.trim().length > 0 &&
    form.category.length > 0 &&
    parsedAmountValid &&
    form.transaction_date.length > 0;

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

    setSubmitting(true);
    try {
      await createTransaction({
        name: form.description.trim(),
        category: form.category,
        amount: isIncome ? amount : -amount,
        date: form.transaction_date,
        type: form.type,
      });

      events.emit("transaction-created");
      toast.success("Transaction added successfully");
      handleClose();
    } catch (err) {
      setError(err.message || "Failed to create transaction");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal open={open} onClose={handleClose} title="Add Transaction">
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
            placeholder={isIncome ? "e.g. Paycheck, Freelance work" : "e.g. Whole Foods Market"}
            className="w-full px-4 py-2 bg-input-background border border-border rounded-lg"
            required
          />
        </div>

        {/* Category — only shown for expenses */}
        {!isIncome && (
          <div>
            <label className="block mb-2">Category <span className="text-red-500">*</span></label>
            <select
              value={form.category}
              onChange={handleChange("category")}
              className="w-full px-4 py-2 bg-input-background border border-border rounded-lg"
              required
            >
              {expenseCategories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        )}

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

        {/* Submit */}
        <button
          type="submit"
          disabled={submitting || !isFormValid}
          className="w-full bg-primary text-primary-foreground px-4 py-2 rounded-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer hover:bg-primary/90 transition-colors"
        >
          {submitting ? (
            <>
              <Spinner size="w-4 h-4" inline />
              Adding...
            </>
          ) : (
            "Add Transaction"
          )}
        </button>
      </form>
    </Modal>
  );
}
