import { Modal } from "./Modal";
import { AlertTriangle } from "lucide-react";

/**
 * Reusable confirmation dialog – used before destructive actions like delete.
 *
 * @param {{
 *   open: boolean,
 *   onClose: () => void,
 *   onConfirm: () => void,
 *   title?: string,
 *   message?: string,
 *   confirmText?: string,
 *   loading?: boolean,
 * }} props
 */
export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title = "Are you sure?",
  message = "This action cannot be undone.",
  confirmText = "Delete",
  loading = false,
}) {
  return (
    <Modal open={open} onClose={onClose} title={title}>
      <div className="space-y-6">
        <div className="flex gap-3 items-start">
          <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-950/40 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5 text-red-600" />
          </div>
          <p className="text-muted-foreground pt-2">{message}</p>
        </div>

        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 border border-border rounded-lg hover:bg-accent transition-colors cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors cursor-pointer disabled:opacity-50"
          >
            {loading ? "Deleting..." : confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
}
