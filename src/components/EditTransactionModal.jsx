import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Modal } from "./Modal";
import { Spinner } from "./Spinner";
import { updateTransaction } from "@/services/transactionService";
import { events } from "@/lib/events";
import { CATEGORY_COLORS } from "@/lib/constants";

const CATEGORIES = Object.keys(CATEGORY_COLORS);

/**
 * Modal form for editing an existing transaction.
 *
 * @param {{
 *   open: boolean,
 *   onClose: () => void,
 *   transaction: object | null,
 * }} props
 */
export function EditTransactionModal({ open, onClose, transaction }) {
  const [form, setForm] = useState({
    description: "",
    category: CATEGORIES[0],
    amount: "",
    type: "expense",
    transaction_date: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Pre-fill form when the transaction changes
  useEffect(() => {
    if (transaction) {
      setForm({
        description: transaction.name || "",
        category: transaction.category || CATEGORIES[0],
        amount: String(Math.abs(transaction.amount)),
        type: transaction.type || "expense",
        transaction_date: transaction.date || "",
      });
      setError("");
    }
  }, [transaction]);

  const handleClose = () => {
    setError("");
    onClose();
  };

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

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
      await updateTransaction(transaction.id, {
        name: form.description.trim(),
        category: form.category,
        amount: form.type === "expense" ? -amount : amount,
        date: form.transaction_date,
        type: form.type,
      });
      events.emit("transaction-updated");
      toast.success("Transaction updated successfully");
      handleClose();
    } catch (err) {
      setError(err.message || "Failed to update transaction");
    } finally {
      setSubmitting(false);
    }
  };

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
          <label className="block mb-2">Description</label>
          <input
            type="text"
            value={form.description}
            onChange={handleChange("description")}
            placeholder="e.g. Whole Foods Market"
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
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Amount */}
        <div>
          <label className="block mb-2">Amount ($)</label>
          <input
            type="number"
            min="0.01"
            step="0.01"
            value={form.amount}
            onChange={handleChange("amount")}
            placeholder="0.00"
            className="w-full px-4 py-2 bg-input-background border border-border rounded-lg"
          />
        </div>

        {/* Date */}
        <div>
          <label className="block mb-2">Date</label>
          <input
            type="date"
            value={form.transaction_date}
            onChange={handleChange("transaction_date")}
            className="w-full px-4 py-2 bg-input-background border border-border rounded-lg"
          />
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
