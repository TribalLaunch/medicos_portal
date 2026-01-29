// =============================================================
// src/components/layout/RouteGuard.tsx — guard by role
// =============================================================
/**
 * RouteGuard
 * - Allows access if user exists and role matches
 * - If user is missing but token exists, attempts /api/auth/me once
 * - Avoids redirecting to /login during that check (prevents the “always kicks me out” bug)
 */
import { useEffect, useState, useMemo } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../../app/store";

type Role = "guest" | "customer" | "admin" | "sales";

type Props = {
  role?: Role;        // single-role support
  roles?: Role[];     // multi-role support
  children: React.ReactNode;
};

export default function RouteGuard({ role, roles, children }: Props) {
  const location = useLocation();
  const user = useAuthStore((s) => s.user);

  const allowedRoles = useMemo<Role[]>(() => {
    if (roles && roles.length > 0) return roles;
    if (role) return [role];
    return [];
  }, [role, roles]);

  // Give useHydrateUser() time to populate user on refresh
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 50);
    return () => clearTimeout(t);
  }, []);

  // Wait for hydration
  if (!ready) {
    return (
      <div className="p-4">
        <div className="card">Loading session…</div>
      </div>
    );
  }

  const token = sessionStorage.getItem("medicos_token");

  // Token exists but user not hydrated yet → keep waiting
  if (!user && token) {
    return (
      <div className="p-4">
        <div className="card">Loading session…</div>
      </div>
    );
  }

  // Not authenticated
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Role enforcement
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}