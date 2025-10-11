// =============================================================
// src/components/layout/RouteGuard.tsx — guard by role
// =============================================================
import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../../app/store'
import type { Role } from '../../app/types'
import { hasRole } from '../../app/rbac'


export default function RouteGuard({ role, children }: { role?: Role|Role[]; children: React.ReactNode }){
const user = useAuthStore((s) => s.user)
if (!user) return <Navigate to="/login" replace />
if (role && !hasRole(user.role, role)) return <Navigate to="/unauthorized" replace />
return <>{children}</>
}