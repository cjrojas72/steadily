import { Navigate, Outlet } from "react-router";
import { useAuth } from "@/hooks/useAuth";

/**
 * Route wrapper that redirects to /login when no JWT is present.
 * Wrap any route group that requires authentication.
 */
export function ProtectedRoute() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
