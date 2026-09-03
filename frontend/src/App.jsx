import { Routes, Route, Navigate } from 'react-router-dom'
import AdminLoginPage from './pages/LoginPage.jsx'
import RegisterPage from './pages/RegisterPage.jsx'
import ForgotPasswordPage from './pages/ForgotPasswordPage.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import UserDashboard from './pages/user/UserDashboard.jsx'
// import UserProductsPage from './pages/UserProductsPage.jsx'
import AdminDashboard from './pages/admin/AdminDashboard.jsx'
import AdminUsersPage from './pages/admin/AdminUsersPage.jsx'
import AdminPage from './pages/admin/AdminPage.jsx'
import UserLoginPage from './pages/UserLoginpage.jsx'

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
            <UserProductsPage />
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
        path="/admin/dashboard/pengguna"
        element={
          <ProtectedRoute role="ADMIN">
            <AdminUsersPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/dashboard/admin"
        element={
          <ProtectedRoute role="ADMIN">
            <AdminPage />
          </ProtectedRoute>
        }
      />

      <Route path="/" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}