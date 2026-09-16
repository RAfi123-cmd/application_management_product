import { Routes, Route, Navigate } from 'react-router-dom'
import AdminLoginPage from './pages/LoginPage.jsx'
import RegisterPage from './pages/RegisterPage.jsx'
import ForgotPasswordPage from './pages/ForgotPasswordPage.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import UserDashboard from './pages/user/UserDashboard.jsx'
import UserAccountPage from './pages/admin/UserAccountPage.jsx'
import AdminAccountsPage from './pages/admin/AdminAccountPage.jsx'
import UserLoginPage from './pages/UserLoginPage.jsx'
import ProductPage from './pages/admin/ProductPage.jsx'
import DashboardLayout from './pages/DashboardLayout.jsx'
import AdminDashboard from './pages/admin/AdminDashboard.jsx'
import { ADMIN_NAV_ITEMS } from './pages/js/adminNavItems.js'

export default function App() {
  return (
    <Routes>
      {/* Halaman publik */}
      <Route path="/login" element={<UserLoginPage />} />
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />

      {/* Dashboard USER biasa */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute role="USER">
            <UserDashboard />
          </ProtectedRoute>
        }
      />
      {/* <Route
        path="/dashboard/produk"
        element={
          <ProtectedRoute role="USER">
            <UserProductPage />
          </ProtectedRoute>
        }
      /> */}

      {/* Dashboard ADMIN — CRUD Pengguna & Admin */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute role="ADMIN">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/produk"
        element={
          <ProtectedRoute role="ADMIN">
            <DashboardLayout navItems={ADMIN_NAV_ITEMS} brandLabel="Toko.ku Admin">
              <ProductPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/dashboard/pengguna"
        element={
          <ProtectedRoute role="ADMIN">
            <UserAccountPage role="USER" title="User" />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/dashboard/admin"
        element={
          <ProtectedRoute role="ADMIN">
            <AdminAccountsPage role="ADMIN" title="Admin" />
          </ProtectedRoute>
        }
      />

      <Route path="/" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}