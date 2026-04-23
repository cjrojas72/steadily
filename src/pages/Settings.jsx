import { useEffect, useState } from "react";
import { toast } from "sonner";
import { User, Bell, Lock, Globe, Moon, Sun, ChevronRight, Construction } from "lucide-react";
import { Card } from "@/components/Card";
import { Toggle } from "@/components/Toggle";
import { PageHeader } from "@/components/PageHeader";
import { Spinner } from "@/components/Spinner";
import { getProfile, updateProfile } from "@/services/profileService";

/**
 * Wrapper that adds an "Under Construction" overlay to a Card.
 */
function ComingSoonCard({ children }) {
  return (
    <div className="relative">
      <Card className="pointer-events-none select-none">
        {children}
      </Card>
      <div className="absolute inset-0 bg-background/70 backdrop-blur-[2px] rounded-lg flex flex-col items-center justify-center gap-2">
        <Construction className="w-8 h-8 text-muted-foreground" />
        <p className="text-sm font-medium text-muted-foreground">Under Construction</p>
      </div>
    </div>
  );
}

/**
 * Profile card — reads & updates first_name / last_name / phone1 on the
 * profiles table. Email is read-only (managed by Supabase auth).
 */
function ProfileCard() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const p = await getProfile();
        if (!cancelled && p) {
          setForm({
            firstName: p.firstName || "",
            lastName: p.lastName || "",
            email: p.email || "",
            phone: p.phone || "",
          });
        }
      } catch (err) {
        if (!cancelled) setError(err.message || "Failed to load profile");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSave = async () => {
    setError("");
    setSaving(true);
    try {
      const updated = await updateProfile({
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        phone: form.phone.trim(),
      });
      if (updated) {
        setForm((prev) => ({
          ...prev,
          firstName: updated.firstName || "",
          lastName: updated.lastName || "",
          phone: updated.phone || "",
        }));
      }
      toast.success("Profile updated");
    } catch (err) {
      const msg = err.message || "Failed to update profile";
      setError(msg);
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card>
      <div className="flex items-center gap-3 mb-6">
        <User className="w-5 h-5 text-muted-foreground" />
        <h3>Profile</h3>
      </div>
      {loading ? (
        <div className="flex items-center gap-2 text-muted-foreground text-sm">
          <Spinner size="w-4 h-4" inline />
          Loading profile...
        </div>
      ) : (
        <div className="space-y-4">
          {error && (
            <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-lg p-3 text-sm text-red-700 dark:text-red-200">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block mb-2">First Name</label>
              <input
                type="text"
                value={form.firstName}
                onChange={handleChange("firstName")}
                className="w-full px-4 py-2 bg-input-background border border-border rounded-lg"
              />
            </div>
            <div>
              <label className="block mb-2">Last Name</label>
              <input
                type="text"
                value={form.lastName}
                onChange={handleChange("lastName")}
                className="w-full px-4 py-2 bg-input-background border border-border rounded-lg"
              />
            </div>
          </div>
          <div>
            <label className="block mb-2">Email</label>
            <input
              type="email"
              value={form.email}
              readOnly
              className="w-full px-4 py-2 bg-input-background border border-border rounded-lg opacity-70 cursor-not-allowed"
            />
            <p className="mt-1 text-xs text-muted-foreground">
              Email is managed by your login provider and can't be changed here.
            </p>
          </div>
          <div>
            <label className="block mb-2">Phone Number</label>
            <input
              type="tel"
              value={form.phone}
              onChange={handleChange("phone")}
              placeholder="+1 (555) 123-4567"
              className="w-full px-4 py-2 bg-input-background border border-border rounded-lg"
            />
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-primary text-primary-foreground px-6 py-2 rounded-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer hover:bg-primary/90 transition-colors"
          >
            {saving ? (
              <>
                <Spinner size="w-4 h-4" inline />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      )}
    </Card>
  );
}

export function Settings() {
  const [notifications] = useState({
    email: true,
    push: false,
    budgetAlerts: true,
    weeklyReports: true,
  });

  const [darkMode] = useState(false);

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
      <ProfileCard />

      {/* Notifications */}
      <ComingSoonCard>
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
                onChange={() => {}}
              />
            </div>
          ))}
        </div>
      </ComingSoonCard>

      {/* Security */}
      <ComingSoonCard>
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
      </ComingSoonCard>

      {/* Preferences */}
      <ComingSoonCard>
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
            <Toggle enabled={darkMode} onChange={() => {}} />
          </div>
        </div>
      </ComingSoonCard>

      {/* Danger Zone */}
      <div className="relative">
        <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-lg p-6 pointer-events-none select-none">
          <h3 className="text-red-900 dark:text-red-100 mb-4">Danger Zone</h3>
          <div className="space-y-3">
            <button className="w-full px-4 py-2 border border-red-300 dark:border-red-800 text-red-700 dark:text-red-200 rounded-lg">
              Export All Data
            </button>
            <button className="w-full px-4 py-2 border border-red-300 dark:border-red-800 text-red-700 dark:text-red-200 rounded-lg">
              Delete All Transactions
            </button>
            <button className="w-full px-4 py-2 bg-red-600 text-white rounded-lg">
              Delete Account
            </button>
          </div>
        </div>
        <div className="absolute inset-0 bg-background/70 backdrop-blur-[2px] rounded-lg flex flex-col items-center justify-center gap-2">
          <Construction className="w-8 h-8 text-muted-foreground" />
          <p className="text-sm font-medium text-muted-foreground">Under Construction</p>
        </div>
      </div>
    </div>
  );
}
