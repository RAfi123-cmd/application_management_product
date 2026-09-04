import DashboardLayout from "../DashboardLayout"

const USER_NAV_ITEMS = [
    { to: "/dashboard", label: "Ringkasan", icon: "grid" },
    { to: "/dashboard/produk", label: "Produk", icon: "box" },
    { to: "/dashboard/riwayat", label: "Riwayat", icon: "chart" },
]

const salesData = [
    { month: "Jan", value: 45 },
    { month: "Feb", value: 65 },
    { month: "Mar", value: 50 },
    { month: "Apr", value: 80 },
    { month: "Mei", value: 70 },
    { month: "Jun", value: 95 },
]

const cardStyle = {
    background: "#ffffff",
    borderRadius: "12px",
    padding: "20px",
    boxShadow: "0 4px 14px rgba(0, 0, 0, 0.08)",
}

export default function UserDashboard() {
    return (
        <DashboardLayout navItems={USER_NAV_ITEMS} brandLabel="Toko.ku">
            <div style={{ padding: "24px" }}>
                <h2 style={{ marginBottom: "8px" }}>Dashboard</h2>
                <p style={{ color: "#6b7280", marginBottom: "24px" }}>
                    Ringkasan aktivitas dan penjualan Anda.
                </p>

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                        gap: "16px",
                        marginBottom: "24px",
                    }}
                >
                    <div style={cardStyle}>
                        <p>Total Produk</p>
                        <h3>128</h3>
                        <small style={{ color: "#16a34a" }}>+12% bulan ini</small>
                    </div>

                    <div style={cardStyle}>
                        <p>Total Pesanan</p>
                        <h3>356</h3>
                        <small style={{ color: "#16a34a" }}>+8% bulan ini</small>
                    </div>

                    <div style={cardStyle}>
                        <p>Total Pendapatan</p>
                        <h3>Rp24.500.000</h3>
                        <small style={{ color: "#16a34a" }}>+15% bulan ini</small>
                    </div>

                    <div style={cardStyle}>
                        <p>Pesanan Selesai</p>
                        <h3>312</h3>
                        <small style={{ color: "#2563eb" }}>87,6% dari total</small>
                    </div>
                </div>

                <div style={cardStyle}>
                    <h3>Diagram Penjualan</h3>
                    <p style={{ color: "#6b7280" }}>Performa penjualan 6 bulan terakhir</p>

                    <div
                        style={{
                            height: "260px",
                            display: "flex",
                            alignItems: "end",
                            gap: "24px",
                            padding: "24px 12px 0",
                            borderBottom: "1px solid #e5e7eb",
                        }}
                    >
                        {salesData.map((item) => (
                            <div
                                key={item.month}
                                style={{
                                    flex: 1,
                                    height: "100%",
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "end",
                                    alignItems: "center",
                                    gap: "8px",
                                }}
                            >
                                <span style={{ fontSize: "12px", color: "#6b7280" }}>
                                    {item.value}
                                </span>

                                <div
                                    title={`${item.month}: ${item.value} pesanan`}
                                    style={{
                                        width: "100%",
                                        maxWidth: "48px",
                                        height: `${item.value * 2}px`,
                                        background: "linear-gradient(180deg, #2563eb, #60a5fa)",
                                        borderRadius: "8px 8px 0 0",
                                    }}
                                />

                                <span style={{ fontSize: "13px", color: "#374151" }}>
                                    {item.month}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    )
}