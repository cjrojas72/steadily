import { cn } from "@/utils/cn";

/**
 * Toggle switch used in Settings for notifications / dark mode.
 *
 * @param {{ enabled: boolean, onChange: () => void, className?: string }} props
 */
export function Toggle({ enabled, onChange, className }) {
  return (
    <button
      onClick={onChange}
      className={cn(
        "w-12 h-6 rounded-full transition-colors relative cursor-pointer",
        enabled ? "bg-primary hover:bg-primary/90" : "bg-muted hover:bg-muted/80",
        className
      )}
    >
      <div
        className={cn(
          "w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform",
          enabled ? "translate-x-6" : "translate-x-0.5"
        )}
      />
    </button>
  );
}
