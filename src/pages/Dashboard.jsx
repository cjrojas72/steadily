import { TrendingUp, TrendingDown, PiggyBank, Wallet } from "lucide-react";
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useDashboard } from "@/hooks/useDashboard";
import { Card } from "@/components/Card";
import { SummaryCard } from "@/components/SummaryCard";
import { TransactionItem } from "@/components/TransactionItem";
import { Spinner } from "@/components/Spinner";
import { CHART_COLORS } from "@/lib/constants";

export function Dashboard() {
  const { data, loading } = useDashboard();

  if (loading || !data) return <Spinner />;

  const { summary, incomeVsExpenses, spendingByCategory, recentTransactions } =
    data;

  return (
    <div className="space-y-6">
      <div>
        <h2>Dashboard</h2>
        <p className="text-muted-foreground">Overview of your finances</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard
          label="Total Balance"
          value={summary.totalBalance}
          icon={Wallet}
          iconBg="bg-primary/10"
          iconColor="text-primary"
          footer={
            <p className="text-muted-foreground text-sm">All time</p>
          }
        />
        <SummaryCard
          label="Income"
          value={summary.income}
          icon={TrendingUp}
          iconBg="bg-green-500/10"
          iconColor="text-green-600"
          footer={
            <p className="text-muted-foreground text-sm">This month</p>
          }
        />
        <SummaryCard
          label="Expenses"
          value={summary.expenses}
          icon={TrendingDown}
          iconBg="bg-red-500/10"
          iconColor="text-red-600"
          footer={
            <p className="text-muted-foreground text-sm">This month</p>
          }
        />
        <SummaryCard
          label="Savings"
          value={summary.savings}
          icon={PiggyBank}
          iconBg="bg-blue-500/10"
          iconColor="text-blue-600"
          footer={
            summary.savingsChange !== 0 ? (
              <div className={`flex items-center gap-1 text-sm ${summary.savingsChange > 0 ? "text-green-600" : "text-red-600"}`}>
                {summary.savingsChange > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                <span>{summary.savingsChange > 0 ? "+" : ""}{summary.savingsChange}% from last month</span>
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">This month</p>
            )
          }
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="mb-4">Income vs Expenses</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={incomeVsExpenses}>
              <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} />
              <XAxis dataKey="month" stroke={CHART_COLORS.axis} />
              <YAxis stroke={CHART_COLORS.axis} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="income" stroke={CHART_COLORS.income} strokeWidth={2} />
              <Line type="monotone" dataKey="expenses" stroke={CHART_COLORS.expenses} strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <h3 className="mb-4">Spending by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={spendingByCategory}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {spendingByCategory.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3>Recent Transactions</h3>
          <button className="text-primary text-sm hover:underline cursor-pointer">
            View all
          </button>
        </div>
        <div className="space-y-4">
          {recentTransactions.map((t) => (
            <TransactionItem key={t.id} transaction={t} />
          ))}
        </div>
      </Card>
    </div>
  );
}
