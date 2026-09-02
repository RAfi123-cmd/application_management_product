import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import Toast from '../components/Toast.jsx'
import './css/DashboardLayout.css'

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Ringkasan', icon: 'grid' },
  { to: '/dashboard/produk', label: 'Produk', icon: 'box' },
  { to: '/dashboard/kategori', label: 'Kategori', icon: 'tag' },
  { to: '/dashboard/laporan', label: 'Laporan', icon: 'chart' },
]

function Icon({ name }) {
  const paths = {
    grid: 'M4 4h6v6H4V4Zm10 0h6v6h-6V4ZM4 14h6v6H4v-6Zm10 0h6v6h-6v-6Z',
    box: 'M3 7l9-4 9 4-9 4-9-4Zm0 0v10l9 4m0-14v14m0-14l9 4v10l-9-4',
    tag: 'M20 12l-8 8-9-9V4h7l9 9Zm-11-5.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Z',
    chart: 'M4 20V10m6 10V4m6 16v-7',
    logout: 'M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4m7 14 5-5-5-5m5 5H9',
    menu: 'M4 6h16M4 12h16M4 18h16',
    close: 'M6 6l12 12M18 6 6 18',
  }

  return (
    <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d={paths[name]} />
    </svg>
  )
}

export default function DashboardLayout({ children, title }) {
  const { user, logout } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const [toast, setToast] = useState(location.state?.toast || '')

  return (
    <div className="dash-shell">
      <Toast
        message={toast}
        type="success"
        onClose={() => {
          setToast('')
          window.history.replaceState({}, document.title)
        }}
      />

      {/* Overlay saat sidebar dibuka di mobile */}
      {mobileOpen && <div className="dash-overlay" onClick={() => setMobileOpen(false)} />}

      <aside className={`dash-sidebar ${mobileOpen ? 'is-open' : ''}`}>
        <div className="dash-sidebar-top">
          <span className="dash-brand">Toko.ku</span>
          <button
            className="dash-sidebar-close"
            onClick={() => setMobileOpen(false)}
            aria-label="Tutup menu"
          >
            <Icon name="close" />
          </button>
        </div>

        <nav className="dash-nav">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/dashboard'}
              className={({ isActive }) => `dash-nav-link ${isActive ? 'is-active' : ''}`}
              onClick={() => setMobileOpen(false)}
            >
              <Icon name={item.icon} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="dash-sidebar-bottom">
          <div className="dash-user">
            <div className="dash-user-avatar">{user?.username?.[0]?.toUpperCase() || '?'}</div>
            <div className="dash-user-info">
              <strong>{user?.username}</strong>
              <span>{user?.role}</span>
            </div>
          </div>
          <button className="dash-logout" onClick={logout}>
            <Icon name="logout" />
            <span>Keluar</span>
          </button>
        </div>
      </aside>

      <div className="dash-main">
        <header className="dash-topbar">
          <button
            className="dash-menu-toggle"
            onClick={() => setMobileOpen(true)}
            aria-label="Buka menu"
          >
            <Icon name="menu" />
          </button>
          <h1>{title}</h1>
        </header>

        <main className="dash-content">{children}</main>
      </div>
    </div>
  )
}