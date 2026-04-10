import { TrendingUp, TrendingDown } from "lucide-react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useAnalytics } from "@/hooks/useAnalytics";
import { Card } from "@/components/Card";
import { InsightCard } from "@/components/InsightCard";
import { Spinner } from "@/components/Spinner";
import { formatCurrency } from "@/utils/formatters";
import { CHART_COLORS } from "@/lib/constants";

export function Analytics() {
  const { monthlyTrend, categoryTrend, weeklySpending, averages, loading } =
    useAnalytics();

  if (loading || !averages) return <Spinner />;

  return (
    <div className="space-y-6">
      <div>
        <h2>Analytics</h2>
        <p className="text-muted-foreground">
          Detailed insights into your spending patterns
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <p className="text-muted-foreground text-sm mb-2">
            Avg Monthly Income
          </p>
          <h3 className="text-green-600">
            {formatCurrency(averages.avgIncome)}
          </h3>
          <div className="flex items-center gap-1 mt-2 text-sm text-green-600">
            <TrendingUp className="w-4 h-4" />
            <span>+5.2% from last period</span>
          </div>
        </Card>

        <Card>
          <p className="text-muted-foreground text-sm mb-2">
            Avg Monthly Expenses
          </p>
          <h3 className="text-red-600">
            {formatCurrency(averages.avgExpenses)}
          </h3>
          <div className="flex items-center gap-1 mt-2 text-sm text-red-600">
            <TrendingDown className="w-4 h-4" />
            <span>-2.1% from last period</span>
          </div>
        </Card>

        <Card>
          <p className="text-muted-foreground text-sm mb-2">
            Avg Monthly Savings
          </p>
          <h3 className="text-blue-600">
            {formatCurrency(averages.avgSavings)}
          </h3>
          <div className="flex items-center gap-1 mt-2 text-sm text-blue-600">
            <TrendingUp className="w-4 h-4" />
            <span>+18.5% from last period</span>
          </div>
        </Card>
      </div>

      {/* Income, Expenses, and Savings Trend */}
      <Card>
        <h3 className="mb-4">Income vs Expenses vs Savings</h3>
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart data={monthlyTrend}>
            <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} />
            <XAxis dataKey="month" stroke={CHART_COLORS.axis} />
            <YAxis stroke={CHART_COLORS.axis} />
            <Tooltip />
            <Legend />
            <Area type="monotone" dataKey="income" stackId="1" stroke={CHART_COLORS.income} fill={CHART_COLORS.income} fillOpacity={0.6} />
            <Area type="monotone" dataKey="expenses" stackId="2" stroke={CHART_COLORS.expenses} fill={CHART_COLORS.expenses} fillOpacity={0.6} />
            <Area type="monotone" dataKey="savings" stackId="3" stroke={CHART_COLORS.savings} fill={CHART_COLORS.savings} fillOpacity={0.6} />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      {/* Category Trends */}
      <Card>
        <h3 className="mb-4">Spending by Category Over Time</h3>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={categoryTrend}>
            <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} />
            <XAxis dataKey="month" stroke={CHART_COLORS.axis} />
            <YAxis stroke={CHART_COLORS.axis} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="food" stroke="#3b82f6" strokeWidth={2} />
            <Line type="monotone" dataKey="transport" stroke="#8b5cf6" strokeWidth={2} />
            <Line type="monotone" dataKey="shopping" stroke="#ec4899" strokeWidth={2} />
            <Line type="monotone" dataKey="entertainment" stroke="#f59e0b" strokeWidth={2} />
            <Line type="monotone" dataKey="bills" stroke="#10b981" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Weekly Spending */}
      <Card>
        <h3 className="mb-4">Weekly Spending (This Month)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={weeklySpending}>
            <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} />
            <XAxis dataKey="week" stroke={CHART_COLORS.axis} />
            <YAxis stroke={CHART_COLORS.axis} />
            <Tooltip />
            <Bar dataKey="amount" fill={CHART_COLORS.savings} radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InsightCard
          variant="green"
          title="Positive Trends"
          items={[
            "Your savings rate has increased by 18.5% this month",
            "Transportation costs are down 12% from last month",
            "You're spending 8% less on entertainment",
          ]}
        />
        <InsightCard
          variant="yellow"
          title="Areas to Watch"
          items={[
            "Shopping expenses increased by 15% this month",
            "Week 4 spending was 30% higher than your average",
            "Food & Dining is trending upward over the past 3 months",
          ]}
        />
      </div>
    </div>
  );
}
