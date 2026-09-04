import { useCallback, useEffect, useState } from 'react'
import DashboardLayout from '../DashboardLayout.jsx'
import axiosInstance from '../../api/axiosInstance.js'
import { ADMIN_NAV_ITEMS } from './AdminDashboard.jsx'
import '../css/AdminAccount.css'

const EMPTY_FORM = {
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  role: 'USER',
}

export default function AdminAccountsPage({ role, title }) {
  const [accounts, setAccounts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [deletingId, setDeletingId] = useState(null)
  const [form, setForm] = useState({ ...EMPTY_FORM, role })

  const loadAccounts = useCallback(async () => {
    setLoading(true)
    setError('')

    try {
      const response = await axiosInstance.get('/admin/users', {
        params: { role },
      })

      const data = Array.isArray(response.data)
        ? response.data
        : response.data?.data || []

      setAccounts(data)
    } catch (err) {
      setError(
        err.response?.data?.message || 'Gagal memuat data akun',
      )
    } finally {
      setLoading(false)
    }
  }, [role])

  useEffect(() => {
    setForm((previous) => ({
      ...previous,
      role,
    }))

    loadAccounts()
  }, [role, loadAccounts])

  const openCreateForm = () => {
    setEditingId(null)
    setForm({
      ...EMPTY_FORM,
      role,
    })
    setError('')
    setShowForm(true)
  }

  const openEditForm = (account) => {
    setEditingId(account.id)
    setForm({
      username: account.username || '',
      email: account.email || '',
      password: '',
      role: account.role || role,
    })
    setError('')
    setShowForm(true)
  }

  const closeForm = () => {
    if (submitting) return

    setShowForm(false)
    setEditingId(null)
    setForm({
      ...EMPTY_FORM,
      role,
    })
  }

  const handleChange = (event) => {
    const { name, value } = event.target

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setSubmitting(true)

    try {
      if (editingId !== null) {
        const payload = {
          username: form.username,
          email: form.email,
          role: form.role,
        }

        if (form.password.trim()) {
          payload.password = form.password
        }

        await axiosInstance.put(
          `/admin/users/edit/${editingId}`,
          payload,
        )
      } else {
        await axiosInstance.post('/admin/users/add', {
          username: form.username,
          email: form.email,
          password: form.password,
          role: form.role,
        })
      }

      closeForm()
      await loadAccounts()
    } catch (err) {
      setError(
        err.response?.data?.message || 'Gagal menyimpan data akun',
      )
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (account) => {
    const confirmed = window.confirm(
      `Hapus akun "${account.username}"?`,
    )

    if (!confirmed) return

    setError('')
    setDeletingId(account.id)

    try {
      await axiosInstance.delete(
        `/admin/users/delete/${account.id}`,
      )

      await loadAccounts()
    } catch (err) {
      if (err.response?.status === 403) {
        setError(
          err.response?.data?.message ||
            'Anda tidak memiliki izin menghapus akun ini atau tidak dapat menghapus akun sendiri.',
        )
      } else {
        setError(
          err.response?.data?.message || 'Gagal menghapus akun',
        )
      }
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <DashboardLayout
      navItems={ADMIN_NAV_ITEMS}
      brandLabel="Toko.ku Admin"
    >
      <h2>Data {title}</h2>
      <p>
        Kelola akun dengan role{' '}
        {role === 'ADMIN' ? 'Admin' : 'Pengguna'}.
      </p>

      <div className="acc-header">
        <button
          type="button"
          className="acc-btn-primary"
          onClick={openCreateForm}
        >
          + Tambah {role === 'ADMIN' ? 'Admin' : 'Pengguna'}
        </button>
      </div>

      {error && <div className="acc-error">{error}</div>}

      {showForm && (
        <div
          className="acc-modal-overlay"
          onClick={closeForm}
        >
          <div
            className="acc-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <h3>{editingId !== null ? 'Edit Akun' : 'Tambah Akun'}</h3>

            <form onSubmit={handleSubmit}>
              <div className="acc-field">
                <label htmlFor="username">Username</label>
                <input
                  id="username"
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="acc-field">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="acc-field">
                <label htmlFor="password">
                  {editingId !== null
                    ? 'Password baru (opsional)'
                    : 'Password'}
                </label>
                <input
                  id="password"
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required={editingId === null}
                />
              </div>

              <div className="acc-field">
                <label htmlFor="role">Role</label>
                <select
                  id="role"
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                >
                  <option value="USER">USER</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </div>

              <div className="acc-modal-actions">
                <button
                  type="button"
                  className="acc-btn-secondary"
                  onClick={closeForm}
                  disabled={submitting}
                >
                  Batal
                </button>

                <button
                  type="submit"
                  className="acc-btn-primary"
                  disabled={submitting}
                >
                  {submitting ? 'Menyimpan...' : 'Simpan'}
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
              {accounts.map((account) => (
                <tr key={account.id}>
                  <td>{account.username}</td>
                  <td>{account.email}</td>
                  <td>
                    <span
                      className={`acc-badge acc-badge-${String(
                        account.role,
                      ).toLowerCase()}`}
                    >
                      {account.role}
                    </span>
                  </td>
                  <td>
                    {account.createdAt
                      ? new Date(
                          account.createdAt,
                        ).toLocaleDateString('id-ID')
                      : '-'}
                  </td>
                  <td>
                    <button
                      type="button"
                      className="acc-btn-link"
                      onClick={() => openEditForm(account)}
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      className="acc-btn-link acc-btn-danger"
                      onClick={() => handleDelete(account)}
                      disabled={deletingId === account.id}
                    >
                      {deletingId === account.id
                        ? 'Menghapus...'
                        : 'Hapus'}
                    </button>
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