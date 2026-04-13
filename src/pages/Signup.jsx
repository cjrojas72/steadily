import { useState, useMemo } from "react";
import { Link, Navigate } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import { UserPlus, CheckCircle, Mail } from "lucide-react";

export function Signup() {
  const { signup, isAuthenticated, loading, error, clearError } = useAuth();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [localError, setLocalError] = useState("");
  const [success, setSuccess] = useState(false);

  // If already authenticated, redirect to dashboard
  if (isAuthenticated) return <Navigate to="/" replace />;

  // Real-time validation hints
  const passwordTooShort = password.length > 0 && password.length < 6;
  const passwordsMatch = confirmPassword.length === 0 || password === confirmPassword;

  // Form validity for disabling the button
  const isFormValid = useMemo(() => {
    return (
      firstName.trim().length > 0 &&
      lastName.trim().length > 0 &&
      email.trim().length > 0 &&
      password.length >= 6 &&
      confirmPassword.length > 0 &&
      password === confirmPassword
    );
  }, [firstName, lastName, email, password, confirmPassword]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();
    setLocalError("");

    if (password !== confirmPassword) {
      setLocalError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setLocalError("Password must be at least 6 characters");
      return;
    }

    try {
      await signup({ email, password, firstName, lastName });
      setSuccess(true);
    } catch {
      // error is surfaced via context
    }
  };

  const displayError = localError || error;

  // Success state — show confirmation message
  if (success) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-primary text-3xl mb-2">Steadily</h1>
          </div>

          <div className="bg-card border border-border rounded-lg p-8 text-center space-y-4">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </div>

            <h2 className="text-xl font-semibold">Account Created!</h2>

            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <Mail className="w-5 h-5" />
              <p>A verification email has been sent to</p>
            </div>
            <p className="font-medium">{email}</p>

            <p className="text-sm text-muted-foreground">
              Please check your inbox and click the verification link to activate
              your account. Check your spam folder if you don't see it.
            </p>

            <div className="pt-4 space-y-3">
              <Link
                to="/login"
                className="block w-full bg-primary text-primary-foreground px-4 py-2 rounded-lg text-center hover:bg-primary/90 transition-colors"
              >
                Go to Login
              </Link>
              <p className="text-xs text-muted-foreground">
                Didn't receive the email?{" "}
                <button
                  onClick={() => setSuccess(false)}
                  className="text-primary hover:underline cursor-pointer"
                >
                  Try again
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-primary text-3xl mb-2">Steadily</h1>
          <p className="text-muted-foreground">
            Create your account to get started
          </p>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {displayError && (
              <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-lg p-3 text-sm text-red-700 dark:text-red-200">
                {displayError}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block mb-2">First Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="John"
                  required
                  className="w-full px-4 py-2 bg-input-background border border-border rounded-lg"
                />
              </div>
              <div>
                <label className="block mb-2">Last Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Doe"
                  required
                  className="w-full px-4 py-2 bg-input-background border border-border rounded-lg"
                />
              </div>
            </div>

            <div>
              <label className="block mb-2">Email <span className="text-red-500">*</span></label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full px-4 py-2 bg-input-background border border-border rounded-lg"
              />
            </div>

            <div>
              <label className="block mb-2">Password <span className="text-red-500">*</span></label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                required
                className="w-full px-4 py-2 bg-input-background border border-border rounded-lg"
              />
              {passwordTooShort && (
                <p className="text-xs text-amber-600 mt-1">
                  Password must be at least 6 characters
                </p>
              )}
            </div>

            <div>
              <label className="block mb-2">Confirm Password <span className="text-red-500">*</span></label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                required
                className={`w-full px-4 py-2 bg-input-background border rounded-lg ${
                  !passwordsMatch
                    ? "border-red-500"
                    : "border-border"
                }`}
              />
              {!passwordsMatch && (
                <p className="text-xs text-red-600 mt-1">
                  Passwords do not match
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || !isFormValid}
              className="w-full bg-primary text-primary-foreground px-4 py-2 rounded-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer hover:bg-primary/90 transition-colors"
            >
              <UserPlus className="w-4 h-4" />
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
