// =============================================================
// src/components/layout/AppShell.tsx — QuickBooks-style frame
// =============================================================
import { Link, Outlet, useLocation } from 'react-router-dom'
import { useAuthStore } from '../../app/store'
import type { Role } from '../../app/types'
import { useLogout } from '../../hooks/useAuth'


const NAV: Record<Role, { label: string; to: string }[]> = {
admin: [
{ label: 'Dashboard', to: '/dashboard' },
{ label: 'Orders', to: '/orders' },
{ label: 'Checkout', to: '/checkout' },
{ label: 'Products', to: '/products' },
{ label: 'Customers', to: '/customers' },
{ label: 'Price Contracts', to: '/admin/price-contracts' },
{ label: 'Reports', to: '/reports' },
{ label: 'Admin', to: '/admin' },
],
sales: [
{ label: 'Dashboard', to: '/dashboard' },
{ label: 'Orders', to: '/orders' },
{ label: 'Checkout', to: '/checkout' },
{ label: 'Customers', to: '/customers' },
{ label: 'Reports', to: '/reports' },
],
customer: [
{ label: 'Dashboard', to: '/dashboard' },
{ label: 'Products', to: '/products' },
{ label: 'Checkout', to: '/checkout' },
{ label: 'Orders', to: '/orders' },
],
guest: [
{ label: 'Products', to: '/products' },
{ label: 'Checkout', to: '/checkout' },
],
}


export default function AppShell(){
const { user } = useAuthStore()
const role: Role = user?.role ?? 'guest'
const location = useLocation()
const logout = useLogout()


return (
<div className="min-h-screen bg-gray-50 text-gray-900">
    <header className="sticky top-0 z-40 border-b bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/50">
    <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3">
        <div className="flex items-center gap-2">
            <span className="h-8 w-8 rounded-xl" style={{ background:'var(--brand-primary)' }} />
            <div className="font-semibold">Medicos Portal</div>
            <span className="ml-2 rounded bg-gray-100 px-2 py-0.5 text-xs">MVP</span>
        </div>
        <nav className="ml-auto hidden gap-3 md:flex">
        {NAV[role].map(({label,to}) => (
        <Link key={to} to={to} className={`text-sm px-2 py-1 rounded-xl ${location.pathname.startsWith(to)?'bg-sky-50 text-sky-700 border border-sky-200':'hover:bg-gray-100'}`}>{label}</Link>
        ))}
        </nav>
        <div className="ml-2">
        {user ? (
            <button onClick={logout} className="btn-outline">Sign out</button>
        ) : (
            <Link to="/login" className="btn-primary">Sign in</Link>
        )}
        </div>
    </div>
    </header>
    <main className="mx-auto max-w-7xl px-4 py-6">
    <Outlet />
    </main>
</div>
)
}