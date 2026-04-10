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
}) {
  const percentage = Math.min((value / max) * 100, 100);
  const isOver = value > max;

  return (
    <div className={cn("w-full bg-muted rounded-full overflow-hidden", height)}>
      <div
        className={cn("h-full transition-all", isOver && !color && overBudgetClass)}
        style={{
          width: `${percentage}%`,
          ...(color ? { backgroundColor: color } : {}),
          ...(!color && !isOver ? {} : {}),
        }}
      />
    </div>
  );
}
