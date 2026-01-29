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



// import { useEffect, useMemo, useState } from "react";
// import { Navigate, useLocation } from "react-router-dom";
// import { api } from "../../lib/axios"; // uses your configured axios instance (with token interceptor)
// import { useAuthStore } from "../../app/store"; // adjust path if different

// type Role = "guest" | "customer" | "admin" | "sales";

// type Props = {
//   role?: Role;            // keeps your current API: <RouteGuard role="admin">
//   roles?: Role[];         // optional future use
//   children: React.ReactNode;
// };

// /**
//  * RouteGuard
//  * - Allows access if user exists and role matches
//  * - If user is missing but token exists, attempts /api/auth/me once
//  * - Avoids redirecting to /login during that check (prevents the “always kicks me out” bug)
//  */
// export default function RouteGuard({ role, roles, children }: Props) {
//   const location = useLocation();
//   const storeUser = useAuthStore((s) => s.user);

//   // local hydration state
//   const [checking, setChecking] = useState(false);
//   const [checked, setChecked] = useState(false);
//   const [resolvedUser, setResolvedUser] = useState<any>(null);

//   const allowedRoles = useMemo(() => {
//     if (roles?.length) return roles;
//     if (role) return [role];
//     return [];
//   }, [role, roles]);

//   // Determine whether we should attempt to fetch /auth/me
//   const token = useMemo(() => localStorage.getItem("token"), []);

//   useEffect(() => {
//     let mounted = true;

//     async function run() {
//       // If we already have a user in store, we’re good; no need to fetch.
//       if (storeUser) {
//         setResolvedUser(storeUser);
//         setChecked(true);
//         return;
//       }

//       // If no token, we can’t be logged in
//       if (!token) {
//         setResolvedUser(null);
//         setChecked(true);
//         return;
//       }

//       // Otherwise, we have a token but no user in memory (common after refresh).
//       // Fetch /api/auth/me once to re-hydrate.
//       try {
//         setChecking(true);
//         const res = await api.get("/auth/me");
//         // backend commonly returns { data: user } or { user }
//         const u = res.data?.data ?? res.data?.user ?? res.data;

//         if (!mounted) return;

//         setResolvedUser(u);

//         // If your auth store has a setter, set it (without requiring TS to know it exists)
//         try {
//           (useAuthStore.getState() as any).setUser?.(u);
//         } catch {
//           // ignore
//         }
//       } catch {
//         if (!mounted) return;
//         setResolvedUser(null);
//       } finally {
//         if (!mounted) return;
//         setChecking(false);
//         setChecked(true);
//       }
//     }

//     run();
//     return () => {
//       mounted = false;
//     };
//   }, [storeUser, token]);

//   // While we’re checking /auth/me, show a lightweight loading state (don’t redirect)
//   if (!checked || checking) {
//     return (
//       <div className="p-4">
//         <div className="card">Loading session…</div>
//       </div>
//     );
//   }

//   const user = storeUser ?? resolvedUser;

//   // Not logged in
//   if (!user) {
//     return <Navigate to="/login" state={{ from: location }} replace />;
//   }

//   // If a role is required, enforce it
//   if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
//     return <Navigate to="/" replace />;
//   }

//   return <>{children}</>;
// }



// // import { Navigate } from 'react-router-dom'
// // import { useAuthStore } from '../../app/store'
// // import type { Role } from '../../app/types'
// // import { hasRole } from '../../app/rbac'


// // export default function RouteGuard({ role, children }: { role?: Role|Role[]; children: React.ReactNode }){
// // const user = useAuthStore((s) => s.user)
// // if (!user) return <Navigate to="/login" replace />
// // if (role && !hasRole(user.role, role)) return <Navigate to="/unauthorized" replace />
// // return <>{children}</>
// // }