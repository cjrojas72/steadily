/** Sidebar / top-level navigation items */
export const NAV_ITEMS = [
  { name: "Dashboard", path: "/", icon: "LayoutDashboard" },
  { name: "Transactions", path: "/transactions", icon: "ArrowLeftRight" },
  { name: "Budgets", path: "/budgets", icon: "Target" },
  { name: "Analytics", path: "/analytics", icon: "BarChart3" },
  { name: "Settings", path: "/settings", icon: "Settings" },
];

/** Category colour map – single source of truth for charts & badges */
export const CATEGORY_COLORS = {
  "Food & Dining": "#3b82f6",
  Transportation: "#8b5cf6",
  Shopping: "#ec4899",
  Entertainment: "#f59e0b",
  "Bills & Utilities": "#10b981",
  "Health & Fitness": "#06b6d4",
  Other: "#6b7280",
};

/** Chart stroke/grid colours */
export const CHART_COLORS = {
  grid: "#e5e7eb",
  axis: "#6b7280",
  income: "#10b981",
  expenses: "#ef4444",
  savings: "#3b82f6",
};
