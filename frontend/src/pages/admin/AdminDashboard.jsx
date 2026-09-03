import DashboardLayout from "../DashboardLayout"

export const ADMIN_NAV_ITEMS = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: 'grid' },
  { to: '/admin/dashboard/pengguna', label: 'Pengguna', icon: 'box' },
  { to: '/admin/dashboard/admin', label: 'Data Admin', icon: 'box' },
]

export default function AdminDashboard() {
  return (
    <DashboardLayout navItems={ADMIN_NAV_ITEMS} brandLabel="Toko.ku Admin">
      <h2>Dashboard Admin</h2>
      <p>Konten ringkasan khusus admin ditaruh di sini (mis. total produk, total pengguna, grafik penjualan).</p>
    </DashboardLayout>
  )
}