// =============================================================
// src/app/store.ts — Zustand for auth/ui
// =============================================================
import { create } from 'zustand'
import { persist } from "zustand/middleware";
import type { SessionUser } from './types'


type AuthState = {
token: string | null
user: SessionUser | null
setAuth: (token: string, user: SessionUser) => void
clearAuth: () => void
}


type UiState = { sidebarOpen: boolean; setSidebarOpen: (v: boolean) => void }


// export const useAuthStore = create(
//   persist(
//     (set) => ({
//       user: null,
//       token: null,
//       setUser: (user: any) => set({ user }),
//       setToken: (token: string) => set({ token }),
//       logout: () => set({ user: null, token: null }),
//     }),
//     { name: "medicos_auth" }
//   )
// );

export const useAuthStore = create<AuthState>((set) => ({
token: null,
user: null,
setAuth: (token, user) => set({ token, user }),
clearAuth: () => set({ token: null, user: null }),
}))


export const useUiStore = create<UiState>((set) => ({ sidebarOpen: true, setSidebarOpen: (v) => set({ sidebarOpen: v }) }))