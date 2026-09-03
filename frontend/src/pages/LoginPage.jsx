import { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import axiosInstance from '../api/axiosInstance'
import { useAuth } from '../context/useAuth'
import Toast from '../components/Toast.jsx'
import './css/Auth.css'

export default function LoginPage() {
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [toast, setToast] = useState(location.state?.toast || '')

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await axiosInstance.post('/auth/admin/login', form)
      login(res.data)
      navigate('/admin/dashboard', { state: { toast: 'Berhasil Login' } })
    } catch (err) {
      if (err.response) {
        setError(err.response.data?.message || 'Username atau password salah')
      } else if (err.request) {
        setError('Tidak bisa terhubung ke server. Pastikan backend sedang berjalan.')
      } else {
        setError('Terjadi kesalahan, coba lagi')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-shell">
      <Toast
        message={toast}
        type="success"
        onClose={() => {
          setToast('')
          window.history.replaceState({}, document.title)
        }}
      />

      <div className="auth-card">
        <div className="auth-mark">Toko.ku Admin</div>

        <div className="auth-card-header">
          <h2>Masuk sebagai admin</h2>
          <p>Isi username dan password akun admin untuk melanjutkan.</p>
        </div>

        {error && (
          <div className="auth-error" role="alert">
            <span>{error}</span>
            <button
              type="button"
              className="auth-error-close"
              onClick={() => setError('')}
              aria-label="Tutup notifikasi"
            >
              ×
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="auth-field">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              name="username"
              placeholder="Masukkan username"
              value={form.username}
              onChange={handleChange}
              autoComplete="username"
              required
            />
          </div>

          <div className="auth-field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              name="password"
              placeholder="Masukkan password"
              value={form.password}
              onChange={handleChange}
              autoComplete="current-password"
              required
            />
          </div>

          <div className="auth-field-row">
            <span />
            <Link to="/forgot-password?from=admin" className="auth-forgot-link">Lupa password?</Link>
          </div>

          <button type="submit" className="auth-submit" disabled={loading}>
            {loading ? 'Memproses...' : 'Masuk'}
          </button>
        </form>
      </div>
    </div>
  )
}