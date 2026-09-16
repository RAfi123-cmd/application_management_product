import { startTransition, useCallback, useEffect, useState } from 'react'
import axiosInstance from '../../api/axiosInstance'
import '../css/Product.css'

const PRODUCT_PATH = '/admin/product' 

const CATEGORY_OPTIONS = [
  'Grains & Pulses',
  'Beverages',
  'Fruits & Vegetables',
  'Oils & Fats',
  'Dairy',
  'Bakery',
]

const STATUS_OPTIONS = ['Active', 'Discontinued', 'Backordered']

const initialForm = {
  productId: '',
  productName: '',
  category: '',
  supplierId: '',
  supplierName: '',
  stockQuantity: '',
  reorderLevel: '',
  reorderQuantity: '',
  unitPrice: '',
  dateReceived: '',
  lastOrderDate: '',
  expirationDate: '',
  warehouseLocation: '',
  salesVolume: '',
  inventoryTurnoverRate: '',
  status: '',
}

const mapResponseToProduct = (item) => ({
  ...item,
  category: item.catagory,
})

const mapPayloadToRequest = (payload) => {
  const { category, ...rest } = payload
  return {
    ...rest,
    catagory: category,
  }
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

  // State pagination, mengikuti bentuk Page dari Spring Data
  const [page, setPage] = useState(0) // halaman aktif, 0-based
  const [size] = useState(10) // jumlah baris per halaman
  const [totalPages, setTotalPages] = useState(0)
  const [totalElements, setTotalElements] = useState(0)

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
  }

  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => setToast(null), 3000)
    return () => clearTimeout(timer)
  }, [toast])

  const loadProducts = useCallback(async (pageToLoad = page) => {
    try {
      setLoading(true)
      setError('')
      const response = await axiosInstance.get(PRODUCT_PATH, {
        params: {
          page: pageToLoad,
          size,
          sortBy: 'productName',
          direction: 'asc',
        },
      })

      // response.data berbentuk Page: { content, totalPages, totalElements, number, ... }
      const pageData = response.data
      setProducts((pageData.content || []).map(mapResponseToProduct))
      setTotalPages(pageData.totalPages ?? 0)
      setTotalElements(pageData.totalElements ?? 0)
      setPage(pageData.number ?? pageToLoad)
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal mengambil data produk')
    } finally {
      setLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size])

  useEffect(() => {
    startTransition(() => {
      loadProducts(0)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const goToPage = (targetPage) => {
    if (targetPage < 0 || targetPage >= totalPages || targetPage === page) return
    loadProducts(targetPage)
  }

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
      productId: product.productId || '',
      productName: product.productName || '',
      category: product.category || '',
      supplierId: product.supplierId || '',
      supplierName: product.supplierName || '',
      stockQuantity: product.stockQuantity ?? '',
      reorderLevel: product.reorderLevel ?? '',
      reorderQuantity: product.reorderQuantity ?? '',
      unitPrice: product.unitPrice ?? '',
      dateReceived: product.dateReceived || '',
      lastOrderDate: product.lastOrderDate || '',
      expirationDate: product.expirationDate || '',
      warehouseLocation: product.warehouseLocation || '',
      salesVolume: product.salesVolume ?? '',
      inventoryTurnoverRate: product.inventoryTurnoverRate ?? '',
      status: product.status || '',
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
      productId: form.productId,
      productName: form.productName,
      category: form.category,
      supplierId: form.supplierId,
      supplierName: form.supplierName,
      stockQuantity: Number(form.stockQuantity),
      reorderLevel: Number(form.reorderLevel),
      reorderQuantity: Number(form.reorderQuantity),
      unitPrice: Number(form.unitPrice),
      dateReceived: form.dateReceived,
      lastOrderDate: form.lastOrderDate,
      expirationDate: form.expirationDate,
      warehouseLocation: form.warehouseLocation,
      salesVolume: Number(form.salesVolume),
      inventoryTurnoverRate: Number(form.inventoryTurnoverRate),
      status: form.status,
    }

    const requestBody = mapPayloadToRequest(payload)

    try {
      if (editingId) {
        await axiosInstance.put(`${PRODUCT_PATH}/edit/${editingId}`, requestBody)
        showToast('Produk berhasil diperbarui')
      } else {
        await axiosInstance.post(`${PRODUCT_PATH}/add`, requestBody)
        showToast('Produk berhasil ditambahkan')
      }

      closeForm()
      await loadProducts(page)
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

      // Kalau ini item terakhir di halaman terakhir, mundur satu halaman
      const isLastItemOnPage = products.length === 1 && page > 0
      await loadProducts(isLastItemOnPage ? page - 1 : page)
    } catch (err) {
      const message = err.response?.data?.message || 'Gagal menghapus produk'
      setError(message)
      showToast(message, 'error')
    }
  }

  const formatCurrency = (value) =>
    `Rp ${Number(value || 0).toLocaleString('id-ID')}`

  const statusBadgeClass = (status) => {
    const key = (status || '').toLowerCase()
    return `status-badge status-badge--${key}`
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
                  <th>No</th>
                  <th>ID Produk</th>
                  <th>Nama Produk</th>
                  <th>Kategori</th>
                  <th>Supplier</th>
                  <th>Stok</th>
                  <th>Harga Satuan</th>
                  <th>Status</th>
                  <th>Aksi</th>
                </tr>
              </thead>

              <tbody>
                {products.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="empty-product">
                      Belum ada data produk.
                    </td>
                  </tr>
                ) : (
                  products.map((product, index) => (
                    <tr key={product.productId}>
                      <td>{page * size + index + 1}</td>
                      <td>{product.productId}</td>
                      <td>{product.productName}</td>
                      <td>{product.category}</td>
                      <td>{product.supplierName}</td>
                      <td>{product.stockQuantity}</td>
                      <td>{formatCurrency(product.unitPrice)}</td>
                      <td>
                        <span className={statusBadgeClass(product.status)}>
                          {product.status}
                        </span>
                      </td>
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

        {!loading && totalPages > 0 && (
          <div className="product-pagination">
            <span className="product-pagination-info">
              Halaman {page + 1} dari {totalPages} ({totalElements} produk)
            </span>

            <div className="product-pagination-controls">
              <button
                type="button"
                onClick={() => goToPage(0)}
                disabled={page === 0}
              >
                « Awal
              </button>
              <button
                type="button"
                onClick={() => goToPage(page - 1)}
                disabled={page === 0}
              >
                ‹ Sebelumnya
              </button>
              <button
                type="button"
                onClick={() => goToPage(page + 1)}
                disabled={page >= totalPages - 1}
              >
                Berikutnya ›
              </button>
              <button
                type="button"
                onClick={() => goToPage(totalPages - 1)}
                disabled={page >= totalPages - 1}
              >
                Akhir »
              </button>
            </div>
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
              ID Produk
              <input value={viewingProduct.productId} disabled readOnly />
            </label>

            <label>
              Nama Produk
              <input value={viewingProduct.productName} disabled readOnly />
            </label>

            <label>
              Kategori
              <input value={viewingProduct.category || '-'} disabled readOnly />
            </label>

            <label>
              Supplier ID
              <input value={viewingProduct.supplierId || '-'} disabled readOnly />
            </label>

            <label>
              Nama Supplier
              <input value={viewingProduct.supplierName || '-'} disabled readOnly />
            </label>

            <label>
              Stok
              <input value={viewingProduct.stockQuantity} disabled readOnly />
            </label>

            <label>
              Reorder Level
              <input value={viewingProduct.reorderLevel} disabled readOnly />
            </label>

            <label>
              Reorder Quantity
              <input value={viewingProduct.reorderQuantity ?? '-'} disabled readOnly />
            </label>

            <label>
              Harga Satuan
              <input value={formatCurrency(viewingProduct.unitPrice)} disabled readOnly />
            </label>

            <label>
              Tanggal Diterima
              <input value={viewingProduct.dateReceived || '-'} disabled readOnly />
            </label>

            <label>
              Tanggal Order Terakhir
              <input value={viewingProduct.lastOrderDate || '-'} disabled readOnly />
            </label>

            <label>
              Tanggal Kadaluarsa
              <input value={viewingProduct.expirationDate || '-'} disabled readOnly />
            </label>

            <label>
              Lokasi Gudang
              <input value={viewingProduct.warehouseLocation || '-'} disabled readOnly />
            </label>

            <label>
              Volume Penjualan
              <input value={viewingProduct.salesVolume ?? '-'} disabled readOnly />
            </label>

            <label>
              Inventory Turnover Rate
              <input value={viewingProduct.inventoryTurnoverRate ?? '-'} disabled readOnly />
            </label>

            <label>
              Status
              <input value={viewingProduct.status || '-'} disabled readOnly />
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
              ID Produk
              <input
                name="productId"
                value={form.productId}
                onChange={handleChange}
                disabled={Boolean(editingId)}
                required
              />
            </label>

            <label>
              Nama Produk
              <input
                name="productName"
                value={form.productName}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Kategori
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                required
              >
                <option value="" disabled>
                  Pilih kategori
                </option>
                {CATEGORY_OPTIONS.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Supplier ID
              <input
                name="supplierId"
                value={form.supplierId}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Nama Supplier
              <input
                name="supplierName"
                value={form.supplierName}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Stok
              <input
                type="number"
                min="0"
                name="stockQuantity"
                value={form.stockQuantity}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Reorder Level
              <input
                type="number"
                min="0"
                name="reorderLevel"
                value={form.reorderLevel}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Reorder Quantity
              <input
                type="number"
                min="0"
                name="reorderQuantity"
                value={form.reorderQuantity}
                onChange={handleChange}
              />
            </label>

            <label>
              Harga Satuan
              <input
                type="number"
                min="0"
                step="0.01"
                name="unitPrice"
                value={form.unitPrice}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Tanggal Diterima
              <input
                type="date"
                name="dateReceived"
                value={form.dateReceived}
                onChange={handleChange}
              />
            </label>

            <label>
              Tanggal Order Terakhir
              <input
                type="date"
                name="lastOrderDate"
                value={form.lastOrderDate}
                onChange={handleChange}
              />
            </label>

            <label>
              Tanggal Kadaluarsa
              <input
                type="date"
                name="expirationDate"
                value={form.expirationDate}
                onChange={handleChange}
              />
            </label>

            <label>
              Lokasi Gudang
              <input
                name="warehouseLocation"
                value={form.warehouseLocation}
                onChange={handleChange}
              />
            </label>

            <label>
              Volume Penjualan
              <input
                type="number"
                min="0"
                name="salesVolume"
                value={form.salesVolume}
                onChange={handleChange}
              />
            </label>

            <label>
              Inventory Turnover Rate
              <input
                type="number"
                min="0"
                name="inventoryTurnoverRate"
                value={form.inventoryTurnoverRate}
                onChange={handleChange}
              />
            </label>

            <label>
              Status
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                required
              >
                <option value="" disabled>
                  Pilih status
                </option>
                {STATUS_OPTIONS.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
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