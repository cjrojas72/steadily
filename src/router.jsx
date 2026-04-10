import { createBrowserRouter } from "react-router";
import { MainLayout } from "@/layouts/MainLayout";
import { ProtectedRoute } from "@/auth/ProtectedRoute";
import { Dashboard } from "@/pages/Dashboard";
import { Transactions } from "@/pages/Transactions";
import { Budgets } from "@/pages/Budgets";
import { Analytics } from "@/pages/Analytics";
import { Settings } from "@/pages/Settings";
import { Login } from "@/pages/Login";
import { Signup } from "@/pages/Signup";

export const router = createBrowserRouter([
  // ── Public routes ──
  { path: "/login", Component: Login },
  { path: "/signup", Component: Signup },

  // ── Protected routes ──
  {
    Component: ProtectedRoute,
    children: [
      {
        path: "/",
        Component: MainLayout,
        children: [
          { index: true, Component: Dashboard },
          { path: "transactions", Component: Transactions },
          { path: "budgets", Component: Budgets },
          { path: "analytics", Component: Analytics },
          { path: "settings", Component: Settings },
        ],
      },
    ],
  },
]);
