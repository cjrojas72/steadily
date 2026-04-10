import { TrendingUp, CreditCard } from "lucide-react";
import { formatCurrency, formatDate } from "@/utils/formatters";

/**
 * Single transaction row — used in Dashboard recent list and Transactions
 * mobile view.
 *
 * @param {{ transaction: object }} props
 */
export function TransactionItem({ transaction }) {
  const isIncome = transaction.amount > 0;

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center ${
            isIncome ? "bg-green-500/10" : "bg-muted"
          }`}
        >
          {isIncome ? (
            <TrendingUp className="w-5 h-5 text-green-600" />
          ) : (
            <CreditCard className="w-5 h-5 text-muted-foreground" />
          )}
        </div>
        <div>
          <p>{transaction.name}</p>
          <p className="text-sm text-muted-foreground">
            {transaction.category}
          </p>
        </div>
      </div>
      <div className="text-right">
        <p className={isIncome ? "text-green-600" : ""}>
          {formatCurrency(transaction.amount, true)}
        </p>
        <p className="text-sm text-muted-foreground">
          {formatDate(transaction.date)}
        </p>
      </div>
    </div>
  );
}
