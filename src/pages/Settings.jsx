import { useState } from "react";
import { User, Bell, Lock, Globe, Moon, Sun, ChevronRight } from "lucide-react";
import { Card } from "@/components/Card";
import { Toggle } from "@/components/Toggle";
import { PageHeader } from "@/components/PageHeader";

export function Settings() {
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    budgetAlerts: true,
    weeklyReports: true,
  });

  const [darkMode, setDarkMode] = useState(false);

  const toggleNotification = (key) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const notificationItems = [
    { key: "email", label: "Email Notifications", description: "Receive updates via email" },
    { key: "push", label: "Push Notifications", description: "Receive push notifications" },
    { key: "budgetAlerts", label: "Budget Alerts", description: "Get notified when approaching budget limits" },
    { key: "weeklyReports", label: "Weekly Reports", description: "Receive weekly spending summaries" },
  ];

  const securityItems = [
    "Change Password",
    "Two-Factor Authentication",
    "Connected Accounts",
  ];

  return (
    <div className="space-y-6 max-w-4xl">
      <PageHeader
        title="Settings"
        description="Manage your account and preferences"
      />

      {/* Profile */}
      <Card>
        <div className="flex items-center gap-3 mb-6">
          <User className="w-5 h-5 text-muted-foreground" />
          <h3>Profile</h3>
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block mb-2">First Name</label>
              <input
                type="text"
                defaultValue="John"
                className="w-full px-4 py-2 bg-input-background border border-border rounded-lg"
              />
            </div>
            <div>
              <label className="block mb-2">Last Name</label>
              <input
                type="text"
                defaultValue="Doe"
                className="w-full px-4 py-2 bg-input-background border border-border rounded-lg"
              />
            </div>
          </div>
          <div>
            <label className="block mb-2">Email</label>
            <input
              type="email"
              defaultValue="john.doe@example.com"
              className="w-full px-4 py-2 bg-input-background border border-border rounded-lg"
            />
          </div>
          <div>
            <label className="block mb-2">Phone Number</label>
            <input
              type="tel"
              defaultValue="+1 (555) 123-4567"
              className="w-full px-4 py-2 bg-input-background border border-border rounded-lg"
            />
          </div>
          <button className="bg-primary text-primary-foreground px-6 py-2 rounded-lg cursor-pointer hover:bg-primary/90 transition-colors">
            Save Changes
          </button>
        </div>
      </Card>

      {/* Notifications */}
      <Card>
        <div className="flex items-center gap-3 mb-6">
          <Bell className="w-5 h-5 text-muted-foreground" />
          <h3>Notifications</h3>
        </div>
        <div className="space-y-4">
          {notificationItems.map((item, index) => (
            <div
              key={item.key}
              className={`flex items-center justify-between py-3 ${
                index < notificationItems.length - 1
                  ? "border-b border-border"
                  : ""
              }`}
            >
              <div>
                <p>{item.label}</p>
                <p className="text-sm text-muted-foreground">
                  {item.description}
                </p>
              </div>
              <Toggle
                enabled={notifications[item.key]}
                onChange={() => toggleNotification(item.key)}
              />
            </div>
          ))}
        </div>
      </Card>

      {/* Security */}
      <Card>
        <div className="flex items-center gap-3 mb-6">
          <Lock className="w-5 h-5 text-muted-foreground" />
          <h3>Security</h3>
        </div>
        <div className="space-y-3">
          {securityItems.map((label) => (
            <button
              key={label}
              className="w-full flex items-center justify-between p-4 hover:bg-accent rounded-lg cursor-pointer transition-colors"
            >
              <span>{label}</span>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
          ))}
        </div>
      </Card>

      {/* Preferences */}
      <Card>
        <div className="flex items-center gap-3 mb-6">
          <Globe className="w-5 h-5 text-muted-foreground" />
          <h3>Preferences</h3>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block mb-2">Currency</label>
            <select className="w-full px-4 py-2 bg-input-background border border-border rounded-lg">
              <option>USD ($)</option>
              <option>EUR</option>
              <option>GBP</option>
              <option>JPY</option>
            </select>
          </div>
          <div>
            <label className="block mb-2">Language</label>
            <select className="w-full px-4 py-2 bg-input-background border border-border rounded-lg">
              <option>English</option>
              <option>Spanish</option>
              <option>French</option>
              <option>German</option>
            </select>
          </div>
          <div>
            <label className="block mb-2">Date Format</label>
            <select className="w-full px-4 py-2 bg-input-background border border-border rounded-lg">
              <option>MM/DD/YYYY</option>
              <option>DD/MM/YYYY</option>
              <option>YYYY-MM-DD</option>
            </select>
          </div>
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-2">
              {darkMode ? (
                <Moon className="w-5 h-5" />
              ) : (
                <Sun className="w-5 h-5" />
              )}
              <div>
                <p>Dark Mode</p>
                <p className="text-sm text-muted-foreground">
                  Toggle dark mode theme
                </p>
              </div>
            </div>
            <Toggle enabled={darkMode} onChange={() => setDarkMode(!darkMode)} />
          </div>
        </div>
      </Card>

      {/* Danger Zone */}
      <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-lg p-6">
        <h3 className="text-red-900 dark:text-red-100 mb-4">Danger Zone</h3>
        <div className="space-y-3">
          <button className="w-full px-4 py-2 border border-red-300 dark:border-red-800 text-red-700 dark:text-red-200 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/50 cursor-pointer transition-colors">
            Export All Data
          </button>
          <button className="w-full px-4 py-2 border border-red-300 dark:border-red-800 text-red-700 dark:text-red-200 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/50 cursor-pointer transition-colors">
            Delete All Transactions
          </button>
          <button className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 cursor-pointer transition-colors">
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}
