import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import "./css/AdminStats.css";

function StatIcon({ children }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="22"
      height="22"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </svg>
  );
}

const initialStats = {
  totalUsers: 0,
  totalAdmins: 0,
  totalProducts: 0,
  activeProducts: 0,
  discontinuedProducts: 0,
  backorderedProducts: 0,
};

export default function AdminStats() {
  const [stats, setStats] = useState(initialStats);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    let ignore = false;

    async function loadStats() {
      try {
        const [userResponse, productResponse] = await Promise.all([
          axiosInstance.get("/admin/users/stats"),
          axiosInstance.get("/admin/users/product-stats"),
        ]);

        if (!ignore) {
          setStats({
            ...userResponse.data,
            ...productResponse.data,
          });
        }
      } catch {
        if (!ignore) {
          setError("Gagal memuat statistik");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadStats();

    return () => {
      ignore = true;
    };
  }, []);

  if (error) {
    return <div className="stat-error">{error}</div>;
  }

  const cards = [
    {
      title: "Total Pengguna",
      value: stats.totalUsers,
      caption: "Akun dengan role USER",
      className: "stat-card-user",
      path: "/admin/dashboard/pengguna",
      icon: (
        <>
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </>
      ),
    },
    {
      title: "Total Admin",
      value: stats.totalAdmins,
      caption: "Akun dengan role ADMIN",
      className: "stat-card-admin",
      path: "/admin/dashboard/admin",
      icon: (
        <>
          <path d="M12 2 4 5v6c0 5.25 3.4 9.74 8 11 4.6-1.26 8-5.75 8-11V5l-8-3Z" />
          <path d="m9 12 2 2 4-4" />
        </>
      ),
    },
    {
      title: "Total Product",
      value: stats.totalProducts,
      caption: "Seluruh Produk",
      className: "stat-card-total-product",
      path: "/admin/produk",
      icon: (
        <>
          <rect x="3" y="4" width="18" height="16" rx="2"/>
          <path d="M3 9h18M16 4v4M16 4v4" />
        </>
      )
    },
    {
      title: "Produk Active",
      value: stats.activeProducts,
      caption: "Produk yang tersedia",
      className: "stat-card-active",
      path: "/admin/produk?status=Active",
      icon: <path d="m5 12 4 4L19 6" />,
    },
    {
      title: "Produk Discontinued",
      value: stats.discontinuedProducts,
      caption: "Produk dihentikan",
      className: "stat-card-discontinued",
      path: "/admin/produk?status=Discontinued",
      icon: (
        <>
          <circle cx="12" cy="12" r="9" />
          <path d="m8 8 8 8M16 8l-8 8" />
        </>
      ),
    },
    {
      title: "Produk Backordered",
      value: stats.backorderedProducts,
      caption: "Produk dalam pesanan",
      className: "stat-card-backordered",
      path: "/admin/produk?status=Backordered",
      icon: (
        <>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 2" />
        </>
      ),
    },
  ];

  return (
    <div className="stat-grid">
      {cards.map((card) => (
        <div
          className={`stat-card ${card.className}`}
          key={card.title}
          role="button"
          tabIndex={0}
          onClick={() => navigate(card.path)}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              navigate(card.path);
            }
          }}
        >
          <div className="stat-icon">
            <StatIcon>{card.icon}</StatIcon>
          </div>

          <div className="stat-body">
            <span className="stat-label">{card.title}</span>

            <strong className="stat-value">
              {loading ? (
                <span className="stat-skeleton" />
              ) : (
                card.value.toLocaleString("id-ID")
              )}
            </strong>

            <span className="stat-caption">{card.caption}</span>
          </div>
        </div>
      ))}
    </div>
  );
}