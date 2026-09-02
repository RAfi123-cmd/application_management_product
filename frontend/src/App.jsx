import { Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage.jsx'
import RegisterPage from './pages/RegisterPage.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import DashboardLayout from './pages/DashboardLayout.jsx'
import UserLoginPage from './pages/UserLoginpage.jsx'

function DashboardHome() {
  return (
    <DashboardLayout title="Ringkasan">
      <p>Konten ringkasan dashboard ditaruh di sini.</p>
    </DashboardLayout>
  )
}

function ProductsPage() {
  return (
    <DashboardLayout title="Produk">
      {/* Taruh komponen ProductList & ProductForm di sini */}
      <p>Konten manajemen produk ditaruh di sini.</p>
    </DashboardLayout>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<UserLoginPage />} />
      <Route path="/admin/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardHome />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/produk"
        element={
          <ProtectedRoute>
            <ProductsPage />
          </ProtectedRoute>
        }
      />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}