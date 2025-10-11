// =============================================================
// src/app/routes.tsx — route map with guards
// =============================================================
import { lazy } from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'
import AppShell from '../components/layout/AppShell'
import RouteGuard from '../components/layout/RouteGuard'
import Unauthorized from '../pages/system/Unauthorized'


const Login = lazy(()=>import('../pages/auth/Login'))
const ForgotPassword = lazy(()=>import('../pages/auth/ForgotPassword'))
const ResetPassword = lazy(()=>import('../pages/auth/ResetPassword'))
const Register = lazy(()=>import('../pages/auth/Register'))
const Dashboard = lazy(()=>import('../pages/dashboard/Dashboard'))


export default function AppRoutes(){
return (
<Routes>
<Route path="/login" element={<Login/>} />
<Route path="/forgot-password" element={<ForgotPassword/>} />
<Route path="/reset-password" element={<ResetPassword/>} />
<Route path="/register" element={<Register/>} />
<Route path="/unauthorized" element={<Unauthorized/>} />


{/* Authenticated shell */}
<Route path="/" element={<RouteGuard><AppShell/></RouteGuard>}>
<Route index element={<Navigate to="/dashboard" replace />} />
<Route path="/dashboard" element={<Dashboard/>} />
{/* Phase 2+ placeholders */}
<Route path="/products" element={<div className="card">Products (Phase 2)</div>} />
<Route path="/orders" element={<div className="card">Orders (Phase 3)</div>} />
<Route path="/checkout" element={<div className="card">Checkout (Phase 3)</div>} />
<Route path="/customers" element={<div className="card">Customers (Phase 4)</div>} />
<Route path="/admin" element={<div className="card">Admin Home (Phase 5)</div>} />
<Route path="/admin/price-contracts" element={<div className="card">Price Contracts (Phase 5)</div>} />
<Route path="/reports" element={<div className="card">Reports (Phase 6)</div>} />
</Route>


<Route path="*" element={<Navigate to="/dashboard" replace />} />
</Routes>
)
}