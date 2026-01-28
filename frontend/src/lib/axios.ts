// =============================================================
// src/lib/axios.ts — axios instance
// =============================================================
import axios from 'axios'
import { useAuthStore } from '../app/store'

const fallback = '/api'; // <-- default to /api so Vite proxy forwards to backend
export const apiBase =
  (import.meta.env.VITE_API_BASE_URL as string | undefined) || fallback;

export const api = axios.create({
  baseURL: apiBase,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true
})

// Attach token from store OR sessionStorage (handles first call after login)
api.interceptors.request.use((config) => {
  const storeToken = useAuthStore.getState().token;
  const ssToken = typeof window !== 'undefined' ? sessionStorage.getItem('medicos_token') : null;
  const token = storeToken || ssToken;
  if (token) {
    config.headers = config.headers ?? {};
    (config.headers as any).Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (r) => r,
  (err) => Promise.reject(new Error(err?.response?.data?.message ?? err.message))
)
