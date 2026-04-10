import { cn } from "@/utils/cn";

/**
 * Loading spinner.  Renders as a centred block by default; pass
 * `inline` to keep it inline.
 */
export function Spinner({ className, size = "w-8 h-8", inline = false }) {
  const spinner = (
    <div
      className={cn(
        "animate-spin rounded-full border-4 border-muted border-t-primary",
        size,
        className
      )}
    />
  );

  if (inline) return spinner;

  return (
    <div className="flex items-center justify-center py-12">{spinner}</div>
  );
}
