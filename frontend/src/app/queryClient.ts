// =============================================================
// src/app/queryClient.ts — TanStack Query
// =============================================================
import { QueryClient } from '@tanstack/react-query'
export const queryClient = new QueryClient({ defaultOptions: { queries: { refetchOnWindowFocus:false, retry:1, staleTime:30000 }, mutations: { retry:0 } } })