import { cn } from "@/utils/cn";

/**
 * Reusable progress bar used in Budgets.
 *
 * @param {{ value: number, max: number, color?: string,
 *           height?: string, overBudgetClass?: string }} props
 */
export function ProgressBar({
  value,
  max,
  color,
  height = "h-3",
  overBudgetClass = "bg-red-500",
  defaultClass = "bg-primary",
}) {
  const percentage = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  const isOver = value > max;

  return (
    <div className={cn("w-full bg-muted rounded-full overflow-hidden", height)}>
      <div
        className={cn(
          "h-full rounded-full transition-all",
          isOver ? overBudgetClass : (!color && defaultClass),
        )}
        style={{
          width: `${percentage}%`,
          ...(color && !isOver ? { backgroundColor: color } : {}),
        }}
      />
    </div>
  );
}
