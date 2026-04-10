// ── Transactions ──
export const transactions = [
  { id: 1, name: "Whole Foods Market", category: "Food & Dining", amount: -87.45, date: "2026-04-06", type: "expense" },
  { id: 2, name: "Netflix Subscription", category: "Entertainment", amount: -15.99, date: "2026-04-05", type: "expense" },
  { id: 3, name: "Salary Deposit", category: "Income", amount: 5500.0, date: "2026-04-01", type: "income" },
  { id: 4, name: "Uber", category: "Transportation", amount: -24.3, date: "2026-04-04", type: "expense" },
  { id: 5, name: "Electric Bill", category: "Bills & Utilities", amount: -145.0, date: "2026-04-03", type: "expense" },
  { id: 6, name: "Amazon Purchase", category: "Shopping", amount: -234.56, date: "2026-04-02", type: "expense" },
  { id: 7, name: "Freelance Project", category: "Income", amount: 1200.0, date: "2026-03-30", type: "income" },
  { id: 8, name: "Starbucks", category: "Food & Dining", amount: -8.75, date: "2026-03-29", type: "expense" },
  { id: 9, name: "Gas Station", category: "Transportation", amount: -52.0, date: "2026-03-28", type: "expense" },
  { id: 10, name: "Gym Membership", category: "Health & Fitness", amount: -49.99, date: "2026-03-27", type: "expense" },
  { id: 11, name: "Target", category: "Shopping", amount: -156.78, date: "2026-03-26", type: "expense" },
  { id: 12, name: "Internet Bill", category: "Bills & Utilities", amount: -79.99, date: "2026-03-25", type: "expense" },
];

// ── Dashboard summary ──
export const dashboardSummary = {
  totalBalance: 24850.0,
  income: 5800.0,
  expenses: 3500.0,
  savings: 2300.0,
  balanceChange: 12.5,
};

export const recentTransactions = transactions.slice(0, 5);

// ── Charts: monthly income vs expenses ──
export const monthlyData = [
  { month: "Oct", income: 4800, expenses: 3200 },
  { month: "Nov", income: 5200, expenses: 3600 },
  { month: "Dec", income: 5000, expenses: 4100 },
  { month: "Jan", income: 5500, expenses: 3400 },
  { month: "Feb", income: 5300, expenses: 3800 },
  { month: "Mar", income: 5800, expenses: 3500 },
];

// ── Charts: spending by category ──
export const categoryData = [
  { name: "Food & Dining", value: 850, color: "#3b82f6" },
  { name: "Transportation", value: 320, color: "#8b5cf6" },
  { name: "Shopping", value: 540, color: "#ec4899" },
  { name: "Entertainment", value: 280, color: "#f59e0b" },
  { name: "Bills & Utilities", value: 1200, color: "#10b981" },
  { name: "Other", value: 310, color: "#6b7280" },
];

// ── Budgets ──
export const budgets = [
  { id: 1, category: "Food & Dining", budgetAmount: 1000, spentAmount: 850, color: "#3b82f6" },
  { id: 2, category: "Transportation", budgetAmount: 400, spentAmount: 320, color: "#8b5cf6" },
  { id: 3, category: "Shopping", budgetAmount: 500, spentAmount: 540, color: "#ec4899" },
  { id: 4, category: "Entertainment", budgetAmount: 300, spentAmount: 280, color: "#f59e0b" },
  { id: 5, category: "Bills & Utilities", budgetAmount: 1500, spentAmount: 1200, color: "#10b981" },
  { id: 6, category: "Health & Fitness", budgetAmount: 200, spentAmount: 150, color: "#06b6d4" },
];

// ── Analytics: monthly trend ──
export const monthlyTrend = [
  { month: "Sep", income: 4500, expenses: 3400, savings: 1100 },
  { month: "Oct", income: 4800, expenses: 3200, savings: 1600 },
  { month: "Nov", income: 5200, expenses: 3600, savings: 1600 },
  { month: "Dec", income: 5000, expenses: 4100, savings: 900 },
  { month: "Jan", income: 5500, expenses: 3400, savings: 2100 },
  { month: "Feb", income: 5300, expenses: 3800, savings: 1500 },
  { month: "Mar", income: 5800, expenses: 3500, savings: 2300 },
];

// ── Analytics: category trend ──
export const categoryTrend = [
  { month: "Oct", food: 780, transport: 290, shopping: 420, entertainment: 250, bills: 1100 },
  { month: "Nov", food: 820, transport: 310, shopping: 480, entertainment: 290, bills: 1150 },
  { month: "Dec", food: 950, transport: 340, shopping: 680, entertainment: 380, bills: 1200 },
  { month: "Jan", food: 800, transport: 280, shopping: 390, entertainment: 240, bills: 1180 },
  { month: "Feb", food: 830, transport: 320, shopping: 510, entertainment: 270, bills: 1190 },
  { month: "Mar", food: 850, transport: 320, shopping: 540, entertainment: 280, bills: 1200 },
];

// ── Analytics: weekly spending ──
export const weeklySpending = [
  { week: "Week 1", amount: 520 },
  { week: "Week 2", amount: 680 },
  { week: "Week 3", amount: 590 },
  { week: "Week 4", amount: 720 },
  { week: "Week 5", amount: 480 },
];
