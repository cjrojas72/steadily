import { cn } from "@/utils/cn";

/**
 * Coloured insight / tips card used in Analytics and Budgets.
 *
 * @param {{ title: string, items: string[], variant: "green" | "yellow" | "blue" }} props
 */
const variants = {
  green: {
    wrapper:
      "bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-900",
    title: "text-green-900 dark:text-green-100",
    text: "text-green-800 dark:text-green-200",
  },
  yellow: {
    wrapper:
      "bg-yellow-50 dark:bg-yellow-950/30 border-yellow-200 dark:border-yellow-900",
    title: "text-yellow-900 dark:text-yellow-100",
    text: "text-yellow-800 dark:text-yellow-200",
  },
  blue: {
    wrapper:
      "bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900",
    title: "text-blue-900 dark:text-blue-100",
    text: "text-blue-800 dark:text-blue-200",
  },
};

export function InsightCard({ title, items, variant = "blue" }) {
  const v = variants[variant];

  return (
    <div className={cn("border rounded-lg p-6", v.wrapper)}>
      <h4 className={cn("mb-2", v.title)}>{title}</h4>
      <ul className={cn("text-sm space-y-2", v.text)}>
        {items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
