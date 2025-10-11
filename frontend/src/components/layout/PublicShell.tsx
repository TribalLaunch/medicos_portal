import { Link, Outlet, useLocation } from 'react-router-dom'
import { useAuthStore } from '../../app/store'
import { useLogout } from '../../hooks/useAuth'

export default function PublicShell(){
  const { user } = useAuthStore()
  const logout = useLogout()
  const loc = useLocation()
  const nav = [
    { to: '/', label: 'Home', exact: true },
    { to: '/products', label: 'Products' },
    { to: '/checkout', label: 'Checkout' },
  ]
  const isActive = (to: string, exact?: boolean) =>
    exact ? loc.pathname === to : loc.pathname.startsWith(to)

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="sticky top-0 z-40 border-b bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/50">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="h-8 w-8 rounded-xl" style={{ background:'var(--brand-primary)' }} />
            <div className="font-semibold">Medicos Portal</div>
          </div>
          <nav className="ml-6 hidden gap-2 md:flex">
            {nav.map(n => (
              <Link key={n.to} to={n.to}
                className={`text-sm px-2 py-1 rounded-xl ${isActive(n.to, n.exact)?'bg-sky-50 text-sky-700 border border-sky-200':'hover:bg-gray-100'}`}>
                {n.label}
              </Link>
            ))}
          </nav>
          <div className="ml-auto flex gap-2">
            {user ? (
              <>
                <Link to="/dashboard" className="btn-outline">Dashboard</Link>
                <button onClick={logout} className="btn-outline">Sign out</button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-outline">Sign in</Link>
                <Link to="/register" className="btn-primary">Register</Link>
              </>
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
