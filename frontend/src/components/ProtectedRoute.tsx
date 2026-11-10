import { Navigate, Outlet } from "react-router";
import { useAuth } from "@/contexts/useAuth";
import { ROLE_HOME, type Role } from "@/contexts/AuthContext";

export default function ProtectedRoute({ allowedRoles }: { allowedRoles?: Role[] }) {
  const { isAuthenticated, role } = useAuth();

  if (!isAuthenticated || !role) return <Navigate to="/" replace />;
  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to={ROLE_HOME[role]} replace />;
  }
  return <Outlet />;
}
