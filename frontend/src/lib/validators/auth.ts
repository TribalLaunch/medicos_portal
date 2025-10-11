// =============================================================
// src/lib/validators/auth.ts — Zod schemas
// =============================================================
import { z } from 'zod'
export const LoginSchema = z.object({ email: z.string().email(), password: z.string().min(6) })

export type LoginDto = z.infer<typeof LoginSchema>

export const RegisterSchema = z.object({ name: z.string().min(2), email: z.string().email(), password: z.string().min(6) })

export type RegisterDto = z.infer<typeof RegisterSchema>