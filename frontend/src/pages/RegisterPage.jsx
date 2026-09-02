import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axiosInstance from '../api/axiosInstance'
import './css/Auth.css'

export default function RegisterPage() {
  const [form, setForm] = useState({ username: '', password: '', email: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await axiosInstance.post('/auth/register', form)
      // Registrasi berhasil -> arahkan ke halaman login (user biasa)
      // dengan notifikasi, TANPA auto-login
      navigate('/login', { state: { toast: 'Registrasi berhasil, silakan login' } })
    } catch (err) {
      if (err.response) {
        setError(err.response.data?.message || 'Registrasi gagal, periksa data yang kamu isi')
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
      <div className="auth-card">
        <div className="auth-mark">Toko.ku</div>

        <div className="auth-card-header">
          <h2>Buat akun baru</h2>
          <p>Isi data di bawah untuk mulai kelola produk tokomu.</p>
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
              placeholder="Pilih username"
              value={form.username}
              onChange={handleChange}
              autoComplete="username"
              required
            />
          </div>

          <div className="auth-field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="nama@email.com"
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
              required
            />
          </div>

          <div className="auth-field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              name="password"
              placeholder="Minimal 6 karakter"
              value={form.password}
              onChange={handleChange}
              autoComplete="new-password"
              required
            />
          </div>

          <button type="submit" className="auth-submit" disabled={loading}>
            {loading ? 'Memproses...' : 'Daftar'}
          </button>
        </form>

        <p className="auth-switch">
          Sudah punya akun? <Link to="/login">Masuk di sini</Link>
        </p>
      </div>
    </div>
  )
}