// =============================================================
// src/app/types.ts — centralize shared types
// =============================================================
export type Role = 'guest' | 'customer' | 'sales' | 'admin'
export type SessionUser = { id: string; name: string; email: string; role: Role, customerId: string }