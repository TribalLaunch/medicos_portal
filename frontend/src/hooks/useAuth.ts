// =============================================================
// src/hooks/useAuth.ts — auth hooks
// =============================================================
import { useEffect } from 'react'
import { useMutation } from '@tanstack/react-query'
import * as auth from '../services/auth.services'
import { useAuthStore } from '../app/store'
import type { SessionUser } from '../app/types'
import { LoginSchema, type LoginDto } from '../lib/validators/auth'


export function useHydrateUser() {
const setAuth = useAuthStore((s) => s.setAuth)
useEffect(() => {
const token = sessionStorage.getItem('medicos_token')
if (!token) return
auth.me().then((u) => setAuth(token, u as SessionUser)).catch(() => sessionStorage.removeItem('medicos_token'))
}, [setAuth])
}


export function useLogin() {
const setAuth = useAuthStore((s) => s.setAuth)
return useMutation({
mutationFn: async (dto: LoginDto) => {
const parsed = LoginSchema.parse(dto)
const { token } = await auth.login(parsed)
sessionStorage.setItem('medicos_token', token)
const u = await auth.me()
setAuth(token, u as SessionUser)
return u
},
})
}


export function useLogout() { const clearAuth = useAuthStore((s) => s.clearAuth); return () => { sessionStorage.removeItem('medicos_token'); clearAuth() } }