import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Modal } from "./Modal";
import { Spinner } from "./Spinner";
import { createBudget } from "@/services/budgetService";
import { getCategories } from "@/services/transactionService";
import { events } from "@/lib/events";

const PERIODS = ["monthly", "weekly", "yearly"];

/**
 * Modal form for creating a new budget.
 * Fields match the backend schema: category (category_id),
 * limit_amount, period.
 */
export function AddBudgetModal({ open, onClose }) {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    limit_amount: "",
    period: "monthly",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Fetch categories from API when modal opens
  useEffect(() => {
    if (!open) return;
    getCategories().then((cats) => {
      setCategories(cats);
      if (cats.length > 0 && !form.category) {
        setForm((prev) => ({ ...prev, category: cats[0].id }));
      }
    });
  }, [open]);

  const reset = () => {
    setForm({ title: "", description: "", category: categories[0]?.id || "", limit_amount: "", period: "monthly" });
    setError("");
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const amount = parseFloat(form.limit_amount);
    if (isNaN(amount) || amount <= 0) {
      setError("Budget amount must be greater than 0");
      return;
    }

    setSubmitting(true);
    try {
      const selectedCat = categories.find((c) => c.id === form.category);
      await createBudget({
        title: form.title.trim(),
        description: form.description.trim(),
        category: form.category,
        budgetAmount: amount,
        color: selectedCat?.color || "#6b7280",
        period: form.period,
      });
      events.emit("budget-created");
      toast.success("Budget created successfully");
      handleClose();
    } catch (err) {
      setError(err.message || "Failed to create budget");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal open={open} onClose={handleClose} title="Create Budget">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-lg p-3 text-sm text-red-700 dark:text-red-200">
            {error}
          </div>
        )}

        {/* Title */}
        <div>
          <label className="block mb-2">Title</label>
          <input
            type="text"
            value={form.title}
            onChange={handleChange("title")}
            placeholder="e.g. Grocery & Restaurants"
            className="w-full px-4 py-2 bg-input-background border border-border rounded-lg"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block mb-2">Description</label>
          <input
            type="text"
            value={form.description}
            onChange={handleChange("description")}
            placeholder="e.g. Weekly groceries and eating out"
            className="w-full px-4 py-2 bg-input-background border border-border rounded-lg"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block mb-2">Category</label>
          <select
            value={form.category}
            onChange={handleChange("category")}
            className="w-full px-4 py-2 bg-input-background border border-border rounded-lg"
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Limit Amount */}
        <div>
          <label className="block mb-2">Budget Limit ($)</label>
          <input
            type="number"
            min="0.01"
            step="0.01"
            value={form.limit_amount}
            onChange={handleChange("limit_amount")}
            placeholder="0.00"
            className="w-full px-4 py-2 bg-input-background border border-border rounded-lg"
          />
        </div>

        {/* Period */}
        <div>
          <label className="block mb-2">Period</label>
          <select
            value={form.period}
            onChange={handleChange("period")}
            className="w-full px-4 py-2 bg-input-background border border-border rounded-lg"
          >
            {PERIODS.map((p) => (
              <option key={p} value={p} className="capitalize">
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-primary text-primary-foreground px-4 py-2 rounded-lg flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer hover:bg-primary/90 transition-colors"
        >
          {submitting ? (
            <>
              <Spinner size="w-4 h-4" inline />
              Creating...
            </>
          ) : (
            "Create Budget"
          )}
        </button>
      </form>
    </Modal>
  );
}
