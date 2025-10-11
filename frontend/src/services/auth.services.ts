// =============================================================
// src/services/auth.service.ts — /auth endpoints
// =============================================================
import { api } from '../lib/axios'

export async function login(dto: { email: string; password: string }) { const { data } = await api.post('/auth/login', dto); return data as { token: string } }

export async function register(dto: { name: string; email: string; password: string }) { const { data } = await api.post('/auth/register', dto); return data }

export async function forgotPassword(email: string) { const { data } = await api.post('/auth/forgot-password', { email }); return data }

export async function resetPassword(token: string, password: string) { const { data } = await api.post('/auth/reset-password', { token, password }); return data }

export async function me() { const { data } = await api.get('/auth/me'); return data as { id:string; name:string; email:string; role:'guest'|'customer'|'sales'|'admin' } }