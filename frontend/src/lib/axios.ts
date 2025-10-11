// =============================================================
// src/lib/axios.ts — axios instance
// =============================================================
import axios from 'axios'
import { useAuthStore } from '../app/store'
export const apiBase = import.meta.env.VITE_API_BASE_URL as string
export const api = axios.create({ baseURL: apiBase, headers: { 'Content-Type': 'application/json' }})
api.interceptors.request.use((config) => { const t = useAuthStore.getState().token; if (t) config.headers.Authorization = `Bearer ${t}`; return config })
api.interceptors.response.use((r) => r, (err) => Promise.reject(new Error(err?.response?.data?.message ?? err.message)))