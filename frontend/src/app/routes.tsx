// =============================================================
// src/app/routes.tsx — route map with guards
// =============================================================
import { lazy } from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'
import PublicShell from '../components/layout/PublicShell'
import AppShell from '../components/layout/AppShell'
import RouteGuard from '../components/layout/RouteGuard'
import Unauthorized from '../pages/system/Unauthorized'

// Public pages
const Home = lazy(()=>import('../pages/home/Home'))
const Login = lazy(()=>import('../pages/auth/Login'))
const ForgotPassword = lazy(()=>import('../pages/auth/ForgotPassword'))
const ResetPassword = lazy(()=>import('../pages/auth/ResetPassword'))
const Register = lazy(()=>import('../pages/auth/Register'))
const ProductsList = lazy(()=>import('../pages/products/ProductList'))
const ProductDetail = lazy(()=>import('../pages/products/ProductDetail'))
const ImageDebug = lazy(()=>import('../pages/debug/ImageDebug'));
const Checkout = lazy(() => import("../pages/checkout/Checkout"))
const CheckoutSuccess = lazy(() => import("../pages/checkout/CheckoutSuccess"));
const CheckoutCancel = lazy(() => import("../pages/checkout/checkoutCancel"));
const MyOrders = lazy(() => import("../pages/orders/MyOrders"));
const OrderDetail = lazy(() => import("../pages/orders/OrderDetail"));

// Authenticated pages
const Dashboard = lazy(()=>import('../pages/dashboard/Dashboard'))
const AdminProducts = lazy(()=>import('../pages/admin/AdminProducts'))
const AdminOrders = lazy(() => import("../pages/admin/AdminOrders"));

export default function AppRoutes(){
  return (
    <Routes>
      {/* PUBLIC */}
      <Route element={<PublicShell/>}>
        <Route index element={<Home/>} />
        <Route path="/products" element={<ProductsList/>} />
        <Route path="/products/:sku" element={<ProductDetail/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Register/>} />
        <Route path="/forgot-password" element={<ForgotPassword/>} />
        <Route path="/reset-password" element={<ResetPassword/>} />
        <Route path="/debug/images" element={<ImageDebug/>} />
        <Route path="/checkout" element={<Checkout/>} />
        <Route path="/checkout/success" element={<CheckoutSuccess />} />
        <Route path="/checkout/cancel" element={<CheckoutCancel />} />
        <Route path="/orders" element={<MyOrders />} />
        <Route path="/orders/:id" element={<OrderDetail />} />
      </Route>

      {/* AUTH-ONLY */}
      <Route element={<RouteGuard><AppShell/></RouteGuard>}>
        <Route path="/dashboard" element={<Dashboard/>} />
        <Route path="/admin/products" element={<RouteGuard role="admin"><AdminProducts/></RouteGuard>} />
        <Route path="/customers" element={<div className="card">Customers (Phase 4)</div>} />
        <Route path="/orders" element={<div className="card">Orders (Phase 3)</div>} />
        <Route path="/admin" element={<div className="card">Admin Home (Phase 5)</div>} />
        <Route path="/admin/price-contracts" element={<div className="card">Price Contracts (Phase 5)</div>} />
        <Route path="/reports" element={<div className="card">Reports (Phase 6)</div>} />
        <Route path="/admin/orders" element={<RouteGuard role="admin"><AdminOrders/></RouteGuard>} />
      </Route>

      <Route path="/unauthorized" element={<Unauthorized/>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}





// import { lazy } from 'react'
// import { Route, Routes, Navigate } from 'react-router-dom'
// import AppShell from '../components/layout/AppShell'
// import RouteGuard from '../components/layout/RouteGuard'
// import Unauthorized from '../pages/system/Unauthorized'


// const Login = lazy(()=>import('../pages/auth/Login'))
// const ForgotPassword = lazy(()=>import('../pages/auth/ForgotPassword'))
// const ResetPassword = lazy(()=>import('../pages/auth/ResetPassword'))
// const Register = lazy(()=>import('../pages/auth/Register'))
// const Dashboard = lazy(()=>import('../pages/dashboard/Dashboard'))


// export default function AppRoutes(){
// return (
// <Routes>
// <Route path="/login" element={<Login/>} />
// <Route path="/forgot-password" element={<ForgotPassword/>} />
// <Route path="/reset-password" element={<ResetPassword/>} />
// <Route path="/register" element={<Register/>} />
// <Route path="/unauthorized" element={<Unauthorized/>} />


// {/* Authenticated shell */}
// <Route path="/" element={<RouteGuard><AppShell/></RouteGuard>}>
// <Route index element={<Navigate to="/dashboard" replace />} />
// <Route path="/dashboard" element={<Dashboard/>} />
// {/* Phase 2+ placeholders */}
// <Route path="/products" element={<div className="card">Products (Phase 2)</div>} />
// <Route path="/orders" element={<div className="card">Orders (Phase 3)</div>} />
// <Route path="/checkout" element={<div className="card">Checkout (Phase 3)</div>} />
// <Route path="/customers" element={<div className="card">Customers (Phase 4)</div>} />
// <Route path="/admin" element={<div className="card">Admin Home (Phase 5)</div>} />
// <Route path="/admin/price-contracts" element={<div className="card">Price Contracts (Phase 5)</div>} />
// <Route path="/reports" element={<div className="card">Reports (Phase 6)</div>} />
// </Route>


// <Route path="*" element={<Navigate to="/dashboard" replace />} />
// </Routes>
// )
// }