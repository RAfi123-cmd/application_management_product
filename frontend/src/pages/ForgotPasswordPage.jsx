import { useState } from 'react'
import { Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom'
import axiosInstance from '../api/axiosInstance'
import './css/Auth.css'

export default function ForgotPasswordPage() {
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const isAdmin = location.state?.isAdmin === 'ADMIN' || searchParams.get('from') === 'admin'
  const navigate = useNavigate()

  const [step, setStep] = useState(1) // 1 = input email, 2 = buat password baru
  const [email, setEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const loginPath = isAdmin ? '/admin/login' : '/login'

  const handleCheckEmail = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await axiosInstance.post('/auth/forgot-password', { email })
      // Email ditemukan -> langsung lanjut ke form password baru
      setStep(2)
    } catch (err) {
      if (err.response) {
        setError(err.response.data?.message || 'Email tidak ditemukan')
      } else if (err.request) {
        setError('Tidak bisa terhubung ke server. Pastikan backend sedang berjalan.')
      } else {
        setError('Terjadi kesalahan, coba lagi')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async (e) => {
    e.preventDefault()
    setError('')

    if (newPassword !== confirmPassword) {
      setError('Konfirmasi password tidak cocok')
      return
    }

    setLoading(true)

    try {
      await axiosInstance.post('/auth/reset-password', {
        email,
        newPassword,
        confirmPassword,
      })
      navigate(loginPath, { state: { toast: 'Password berhasil diperbarui, silakan login' } })
    } catch (err) {
      if (err.response) {
        setError(err.response.data?.message || 'Gagal memperbarui password')
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

        {step === 1 ? (
          <>
            <div className="auth-card-header">
              <h2>Lupa password?</h2>
              <p>Masukkan email akunmu untuk mulai atur ulang password.</p>
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

            <form onSubmit={handleCheckEmail} noValidate>
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
                {loading ? 'Memeriksa...' : 'Lanjutkan'}
              </button>
            </form>
          </>
        ) : (
          <>
            <div className="auth-card-header">
              <h2>Buat password baru</h2>
              <p>Email <strong>{email}</strong> ditemukan. Masukkan password barumu.</p>
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

            <form onSubmit={handleResetPassword} noValidate>
              <div className="auth-field">
                <label htmlFor="newPassword">Password baru</label>
                <input
                  id="newPassword"
                  type="password"
                  name="newPassword"
                  placeholder="Minimal 6 karakter"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  autoComplete="new-password"
                  required
                />
              </div>

              <div className="auth-field">
                <label htmlFor="confirmPassword">Konfirmasi password</label>
                <input
                  id="confirmPassword"
                  type="password"
                  name="confirmPassword"
                  placeholder="Ulangi password baru"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  autoComplete="new-password"
                  required
                />
              </div>

              <button type="submit" className="auth-submit" disabled={loading}>
                {loading ? 'Menyimpan...' : 'Simpan password baru'}
              </button>
            </form>
          </>
        )}

        <p className="auth-switch">
          Sudah ingat password? <Link to={loginPath}>Kembali ke login</Link>
        </p>
      </div>
    </div>
  )
}