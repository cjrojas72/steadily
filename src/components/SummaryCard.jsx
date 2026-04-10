import { Card } from "./Card";
import { formatCurrency } from "@/utils/formatters";

/**
 * Stat card shown on the Dashboard (balance, income, expenses, savings).
 *
 * @param {{ label: string, value: number, icon: React.ElementType,
 *           iconBg: string, iconColor: string, footer: React.ReactNode }} props
 */
export function SummaryCard({
  label,
  value,
  icon: Icon,
  iconBg,
  iconColor,
  footer,
}) {
  return (
    <Card>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-muted-foreground text-sm">{label}</p>
          <h3 className="mt-2">{formatCurrency(value)}</h3>
        </div>
        <div
          className={`w-12 h-12 rounded-full flex items-center justify-center ${iconBg}`}
        >
          <Icon className={`w-6 h-6 ${iconColor}`} />
        </div>
      </div>
      {footer && <div className="mt-4">{footer}</div>}
    </Card>
  );
}
