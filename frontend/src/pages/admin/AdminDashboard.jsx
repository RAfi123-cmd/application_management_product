import DashboardLayout from "../DashboardLayout"
import AdminStats from "../AdminStats"

export const ADMIN_NAV_ITEMS = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: 'grid' },
  { to: '/admin/dashboard/pengguna', label: 'Pengguna', icon: 'box' },
  { to: '/admin/dashboard/admin', label: 'Data Admin', icon: 'box' },
]

export default function AdminDashboard() {
  const loggedInUser = JSON.parse(localStorage.getItem("user") || "{}")
  const adminName =
    loggedInUser.name ||
    loggedInUser.nama ||
    loggedInUser.username ||
    "Admin"
  return (
    <DashboardLayout navItems={ADMIN_NAV_ITEMS} brandLabel="Toko.ku Admin">
      <h1>Dashboard</h1>
          <p>
            Kelola data toko, pantau aktivitas pengguna, dan lihat performa
            bisnis Anda melalui dashboard admin.
          </p>
          <AdminStats />
      <section className="admin-dashboard-header">
        <div>
          <h2>Selamat Datang di Dashboard {adminName}!</h2>
          <p>
            Kelola data toko, pantau aktivitas pengguna, dan lihat performa
            bisnis Anda melalui dashboard admin.
          </p>
        </div>
      </section>
      
    </DashboardLayout>
  )
}