import { cn } from "@/utils/cn";

/**
 * Reusable card wrapper used across all pages.
 */
export function Card({ children, className, ...props }) {
  return (
    <div
      className={cn("bg-card border border-border rounded-xl shadow p-6", className)}
      {...props}
    >
      {children}
    </div>
  );
}
