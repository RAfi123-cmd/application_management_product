import { useState } from 'react'
import { Link } from 'react-router-dom'
import axiosInstance from '../api/axiosInstance'
import './css/Auth.css'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Catatan: endpoint ini perlu dibuat di backend
      // (mis. POST /api/auth/forgot-password) yang mengirim
      // link/kode reset password ke email yang dimasukkan.
      await axiosInstance.post('/auth/forgot-password', { email })
      setSent(true)
    } catch (err) {
      if (err.response) {
        setError(err.response.data?.message || 'Gagal mengirim permintaan, coba lagi')
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
          <h2>Lupa password?</h2>
          <p>Masukkan email akunmu, kami akan kirim link untuk atur ulang password.</p>
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

        {sent ? (
          <div className="auth-success-box">
            <p>
              Kalau email <strong>{email}</strong> terdaftar, link atur ulang password
              sudah kami kirim. Silakan cek kotak masuk (atau folder spam) kamu.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate>
            <div className="auth-field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                name="email"
                placeholder="nama@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>

            <button type="submit" className="auth-submit" disabled={loading}>
              {loading ? 'Mengirim...' : 'Kirim link reset'}
            </button>
          </form>
        )}

        <p className="auth-switch">
          Sudah ingat password? <Link to="/login">Kembali ke login</Link>
        </p>
      </div>
    </div>
  )
}