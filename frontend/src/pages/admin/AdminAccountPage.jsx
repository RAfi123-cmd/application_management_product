import { useState, useEffect, useCallback } from 'react'
import DashboardLayout from '../DashboardLayout.jsx'
import axiosInstance from '../../api/axiosInstance.js'
import { ADMIN_NAV_ITEMS } from './AdminDashboard.jsx'
import '../css/AdminAccount.css'

const EMPTY_FORM = { username: '', email: '', password: '', role: 'USER' }



export default function AdminAccountsPage({ role, title }) {
  const [accounts, setAccounts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState({ ...EMPTY_FORM, role })

  const loadAccounts = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const res = await axiosInstance.get(`/admin/users?role=${role}`)
      setAccounts(res.data)
    } catch {
      setError('Gagal memuat data akun')
    } finally {
      setLoading(false)
    }
  }, [role])

  useEffect(() => {
    let cancelled = false

    const fetchAccounts = async () => {
      try {
        const res = await axiosInstance.get(`/admin/users?role=${role}`)

        if (!cancelled) {
          setAccounts(res.data)
          setLoading(false)
        }
      } catch {
        if (!cancelled) {
          setError('Gagal memuat data akun')
          setLoading(false)
        }
      }
    }

    fetchAccounts()

    return () => {
      cancelled = true
    }
  }, [role])

  const openCreateForm = () => {
    setEditingId(null)
    setForm({ ...EMPTY_FORM, role })
    setShowForm(true)
    setError('')
  }

  const openEditForm = (account) => {
    setEditingId(account.id)
    setForm({
      username: account.username,
      email: account.email,
      password: '',
      role: account.role,
    })
    setShowForm(true)
    setError('')
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    try {
      if (editingId) {
        const payload = { username: form.username, email: form.email, role: form.role }
        if (form.password) payload.password = form.password
        await axiosInstance.put(`/admin/users/${editingId}`, payload)
      } else {
        await axiosInstance.post('/admin/users', form)
      }
      setShowForm(false)
      loadAccounts()
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal menyimpan data')
    }
  }

  const handleDelete = async (account) => {
    if (!confirm(`Hapus akun "${account.username}"?`)) return
    try {
      await axiosInstance.delete(`/admin/users/${account.id}`)
      loadAccounts()
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal menghapus akun')
    }
  }

  return (
    <DashboardLayout title={title} navItems={ADMIN_NAV_ITEMS} brandLabel="Toko.ku Admin">
      <div className="acc-header">
        <p className="acc-subtitle">Kelola akun dengan role {role === 'ADMIN' ? 'Admin' : 'Pengguna'}.</p>
        <button className="acc-btn-primary" onClick={openCreateForm}>
          + Tambah {role === 'ADMIN' ? 'Admin' : 'Pengguna'}
        </button>
      </div>

      {error && <div className="acc-error">{error}</div>}

      {showForm && (
        <div className="acc-modal-overlay" onClick={() => setShowForm(false)}>
          <div className="acc-modal" onClick={(e) => e.stopPropagation()}>
            <h3>{editingId ? 'Edit Akun' : 'Tambah Akun'}</h3>

            <form onSubmit={handleSubmit}>
              <div className="acc-field">
                <label>Username</label>
                <input name="username" value={form.username} onChange={handleChange} required />
              </div>

              <div className="acc-field">
                <label>Email</label>
                <input type="email" name="email" value={form.email} onChange={handleChange} required />
              </div>

              <div className="acc-field">
                <label>{editingId ? 'Password baru (kosongkan jika tidak diubah)' : 'Password'}</label>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required={!editingId}
                />
              </div>

              <div className="acc-field">
                <label>Role</label>
                <select name="role" value={form.role} onChange={handleChange}>
                  <option value="USER">USER</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </div>

              <div className="acc-modal-actions">
                <button type="button" className="acc-btn-secondary" onClick={() => setShowForm(false)}>
                  Batal
                </button>
                <button type="submit" className="acc-btn-primary">
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <p>Memuat data...</p>
      ) : accounts.length === 0 ? (
        <p>Belum ada akun dengan role ini.</p>
      ) : (
        <div className="acc-table-wrap">
          <table className="acc-table">
            <thead>
              <tr>
                <th>Username</th>
                <th>Email</th>
                <th>Role</th>
                <th>Dibuat</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {accounts.map((acc) => (
                <tr key={acc.id}>
                  <td>{acc.username}</td>
                  <td>{acc.email}</td>
                  <td><span className={`acc-badge acc-badge-${acc.role.toLowerCase()}`}>{acc.role}</span></td>
                  <td>{acc.createdAt ? new Date(acc.createdAt).toLocaleDateString('id-ID') : '-'}</td>
                  <td>
                    <button className="acc-btn-link" onClick={() => openEditForm(acc)}>Edit</button>
                    <button className="acc-btn-link acc-btn-danger" onClick={() => handleDelete(acc)}>Hapus</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </DashboardLayout>
  )
}