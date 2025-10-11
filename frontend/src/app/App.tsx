// =============================================================
// src/app/App.tsx — root app: providers + routes
// =============================================================
import { Suspense } from 'react'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './queryClient'
import AppRoutes from './routes'
import { useHydrateUser } from '../hooks/useAuth'


export default function App(){
useHydrateUser()
return (
<QueryClientProvider client={queryClient}>
<Suspense fallback={<div className="p-6 text-sm text-gray-600">Loading…</div>}>
<AppRoutes />
</Suspense>
</QueryClientProvider>
)
}
