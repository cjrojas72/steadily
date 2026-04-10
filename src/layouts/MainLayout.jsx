import { Outlet, NavLink, useNavigate } from "react-router";
import {
  LayoutDashboard,
  ArrowLeftRight,
  Target,
  BarChart3,
  Settings,
  Menu,
  X,
  LogOut,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/utils/cn";
import { useAuth } from "@/hooks/useAuth";

const navigation = [
  { name: "Dashboard", path: "/", icon: LayoutDashboard },
  { name: "Transactions", path: "/transactions", icon: ArrowLeftRight },
  { name: "Budgets", path: "/budgets", icon: Target },
  { name: "Analytics", path: "/analytics", icon: BarChart3 },
  { name: "Settings", path: "/settings", icon: Settings },
];

function NavItem({ item, onClick }) {
  return (
    <NavLink
      to={item.path}
      end={item.path === "/"}
      onClick={onClick}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
          isActive
            ? "bg-primary text-primary-foreground"
            : "text-muted-foreground hover:bg-accent"
        )
      }
    >
      <item.icon className="w-5 h-5" />
      {item.name}
    </NavLink>
  );
}

export function MainLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* ── Mobile header ── */}
      <div className="lg:hidden flex items-center justify-between p-4 border-b border-border bg-card">
        <h1 className="text-primary">Steadily</h1>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 cursor-pointer rounded-lg hover:bg-accent transition-colors">
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* ── Mobile menu overlay ── */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-background">
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h1 className="text-primary">Steadily</h1>
            <button onClick={() => setMobileMenuOpen(false)} className="p-2 cursor-pointer rounded-lg hover:bg-accent transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>
          <nav className="p-4 space-y-2 flex flex-col h-[calc(100%-65px)]">
            <div className="space-y-2 flex-1">
              {navigation.map((item) => (
                <NavItem
                  key={item.path}
                  item={item}
                  onClick={() => setMobileMenuOpen(false)}
                />
              ))}
            </div>
            <div className="border-t border-border pt-4 space-y-3">
              {user && (
                <p className="px-4 text-sm text-muted-foreground truncate">
                  {user.email}
                </p>
              )}
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-muted-foreground hover:bg-accent w-full cursor-pointer"
              >
                <LogOut className="w-5 h-5" />
                Sign Out
              </button>
            </div>
          </nav>
        </div>
      )}

      <div className="lg:flex lg:h-screen overflow-hidden">
        {/* ── Desktop sidebar ── */}
        <aside className="hidden lg:flex lg:flex-col w-64 border-r border-border bg-card max-h-screen overflow-y-auto">
          <div className="p-6">
            <h1 className="text-primary">Steadily</h1>
          </div>
          <nav className="px-4 space-y-2 flex-1">
            {navigation.map((item) => (
              <NavItem key={item.path} item={item} />
            ))}
          </nav>
          <div className="px-4 pb-6 border-t border-border pt-4 space-y-3">
            {user && (
              <p className="px-4 text-sm text-muted-foreground truncate">
                {user.email}
              </p>
            )}
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-white bg-primary hover:bg-red-100 hover:text-red-700 w-full cursor-pointer"
            >
              <LogOut className="w-5 h-5" />
              Sign Out
            </button>
          </div>
        </aside>

        {/* ── Main content ── */}
        <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
