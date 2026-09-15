import { useEffect, useState } from 'react'
import axiosInstance from '../../api/axiosInstance'
import '../css/Product.css'

const PRODUCT_PATH = '/admin/product' // baseURL axiosInstance sudah 'http://localhost:8080/api'

const KATEGORI_OPTIONS = [
  'Makanan',
  'Minuman',
  'Elektronik',
  'Pakaian',
  'Kesehatan & Kecantikan',
  'Rumah Tangga',
  'Aksesoris',
  'Lainnya',
]

const initialForm = {
  name: '',
  kategori: '',
  harga: '',
  stok: '',
  deskripsi: '',
}

export default function ProductPage() {
  const [products, setProducts] = useState([])
  const [form, setForm] = useState(initialForm)
  const [editingId, setEditingId] = useState(null)
  const [formOpen, setFormOpen] = useState(false)
  const [viewingProduct, setViewingProduct] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [toast, setToast] = useState(null) // { message: string, type: 'success' | 'error' }

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
  }

  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => setToast(null), 3000)
    return () => clearTimeout(timer)
  }, [toast])

  const loadProducts = async () => {
    try {
      setLoading(true)
      setError('')
      const response = await axiosInstance.get(PRODUCT_PATH)
      setProducts(response.data)
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal mengambil data produk')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProducts()
  }, [])

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({
      ...current,
      [name]: value,
    }))
  }

  const openCreateForm = () => {
    setEditingId(null)
    setForm(initialForm)
    setError('')
    setFormOpen(true)
  }

  const openViewModal = (product) => {
    setViewingProduct(product)
  }

  const closeViewModal = () => {
    setViewingProduct(null)
  }

  const openEditForm = (product) => {
    setEditingId(product.id)
    setForm({
      name: product.name || '',
      kategori: product.kategori || '',
      harga: product.harga || '',
      stok: product.stok || '',
      deskripsi: product.deskripsi || '',
    })
    setError('')
    setFormOpen(true)
  }

  const closeForm = () => {
    setFormOpen(false)
    setEditingId(null)
    setForm(initialForm)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    const payload = {
      name: form.name,
      kategori: form.kategori,
      harga: Number(form.harga),
      stok: Number(form.stok),
      deskripsi: form.deskripsi,
    }

    try {
      if (editingId) {
        await axiosInstance.put(`${PRODUCT_PATH}/edit/${editingId}`, payload)
        showToast('Produk berhasil diperbarui')
      } else {
        await axiosInstance.post(`${PRODUCT_PATH}/add`, payload)
        showToast('Produk berhasil ditambahkan')
      }

      closeForm()
      await loadProducts()
    } catch (err) {
      const message = err.response?.data?.message || 'Gagal menyimpan produk'
      setError(message)
      showToast(message, 'error')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus produk ini?')) {
      return
    }

    try {
      await axiosInstance.delete(`${PRODUCT_PATH}/delete/${id}`)
      showToast('Produk berhasil dihapus')
      await loadProducts()
    } catch (err) {
      const message = err.response?.data?.message || 'Gagal menghapus produk'
      setError(message)
      showToast(message, 'error')
    }
  }

  return (
    <section className="product-page">
      {toast && (
        <div className={`product-toast ${toast.type}`}>
          {toast.message}
        </div>
      )}

      <div className="product-header">
        <div>
          <h2>Data Produk</h2>
          <p>Kelola data produk toko.</p>
        </div>

        <button className="add-product-button" onClick={openCreateForm}>
          + Tambah Produk
        </button>
      </div>

      {error && <div className="product-alert error">{error}</div>}

      <div className="product-table-card">
        {loading ? (
          <p>Memuat data produk...</p>
        ) : (
          <div className="table-wrapper">
            <table className="product-table">
              <thead>
                <tr>
                  <th>Nama Produk</th>
                  <th>Kategori</th>
                  <th>Harga</th>
                  <th>Stok</th>
                  <th>Deskripsi</th>
                  <th>Aksi</th>
                </tr>
              </thead>

              <tbody>
                {products.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="empty-product">
                      Belum ada data produk.
                    </td>
                  </tr>
                ) : (
                  products.map((product) => (
                    <tr key={product.id}>
                      <td>{product.name}</td>
                      <td>{product.kategori}</td>
                      <td>
                        Rp {Number(product.harga).toLocaleString('id-ID')}
                      </td>
                      <td>{product.stok}</td>
                      <td>{product.deskripsi || '-'}</td>
                      <td className="product-actions">
                        <button
                          className="view-detail-button"
                          onClick={() => openViewModal(product)}
                        >
                          Lihat
                        </button>

                        <button
                          className="view-button"
                          onClick={() => openEditForm(product)}
                        >
                          Edit
                        </button>

                        <button
                          className="delete-button"
                          onClick={() => handleDelete(product.id)}
                        >
                          Hapus
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {viewingProduct && (
        <div className="product-modal-overlay">
          <div className="product-modal">
            <div className="modal-header">
              <h3>Detail Produk</h3>
              <button type="button" onClick={closeViewModal}>
                ×
              </button>
            </div>

            <label>
              Nama Produk
              <input value={viewingProduct.name} disabled readOnly />
            </label>

            <label>
              Kategori
              <input value={viewingProduct.kategori || '-'} disabled readOnly />
            </label>

            <label>
              Harga
              <input
                value={`Rp ${Number(viewingProduct.harga).toLocaleString('id-ID')}`}
                disabled
                readOnly
              />
            </label>

            <label>
              Stok
              <input value={viewingProduct.stok} disabled readOnly />
            </label>

            <label>
              Deskripsi
              <textarea
                value={viewingProduct.deskripsi || '-'}
                rows="4"
                disabled
                readOnly
              />
            </label>

            <div className="modal-actions">
              <button type="button" className="cancel-button" onClick={closeViewModal}>
                Tutup
              </button>
              <button
                type="button"
                className="save-button"
                onClick={() => {
                  closeViewModal()
                  openEditForm(viewingProduct)
                }}
              >
                Edit
              </button>
            </div>
          </div>
        </div>
      )}

      {formOpen && (
        <div className="product-modal-overlay">
          <form className="product-modal" onSubmit={handleSubmit}>
            <div className="modal-header">
              <h3>{editingId ? 'Edit Produk' : 'Tambah Produk'}</h3>
              <button type="button" onClick={closeForm}>
                ×
              </button>
            </div>

            <label>
              Nama Produk
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Kategori
              <select
                name="kategori"
                value={form.kategori}
                onChange={handleChange}
                required
              >
                <option value="" disabled>
                  Pilih kategori
                </option>
                {KATEGORI_OPTIONS.map((kategori) => (
                  <option key={kategori} value={kategori}>
                    {kategori}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Harga
              <input
                type="number"
                min="0"
                name="harga"
                value={form.harga}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Stok
              <input
                type="number"
                min="0"
                name="stok"
                value={form.stok}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Deskripsi
              <textarea
                name="deskripsi"
                value={form.deskripsi}
                onChange={handleChange}
                rows="4"
              />
            </label>

            <div className="modal-actions">
              <button type="button" className="cancel-button" onClick={closeForm}>
                Batal
              </button>
              <button type="submit" className="save-button">
                Simpan
              </button>
            </div>
          </form>
        </div>
      )}
    </section>
  )
}