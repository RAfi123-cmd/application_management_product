import DashboardLayout from "../DashboardLayout"

const USER_NAV_ITEMS = [
    { to: '/dashboard', label: 'Ringkasan', icon: 'grid' },
    { to: '/dashboard/produk', label: 'Produk', icon: 'box' },
    { to: '/dashboard/riwayat', label: 'Riwayat', icon: 'chart' },
]

export default function UserDashboard() {
    return (
        <DashboardLayout title="Ringkasan" navItems={USER_NAV_ITEMS} brandLabel="Toko.ku">
            <p>Konten ringkasan khusus user ditaruh di sini.</p>
        </DashboardLayout>
    )
}