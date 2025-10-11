// =============================================================
// src/app/rbac.ts — role helpers
// =============================================================
import type { Role } from './types'
export function hasRole(userRole: Role | undefined, needed?: Role | Role[]) {
if (!needed) return true
if (!userRole) return false
const arr = Array.isArray(needed) ? needed : [needed]
return arr.includes(userRole)
}