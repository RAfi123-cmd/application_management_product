import { useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";
import "./css/AdminStats.css";

function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}
 
function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2 4 5v6c0 5.25 3.4 9.74 8 11 4.6-1.26 8-5.75 8-11V5l-8-3Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  )
}

export default function AdminStats() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
    let ignore = false
 
    async function loadStats() {
      try {
        const res = await axiosInstance.get('/admin/users/stats')
        if (!ignore) setStats(res.data)
      } catch {
        if (!ignore) setError('Gagal memuat statistik')
      } finally {
        if (!ignore) setLoading(false)
      }
    }
 
    loadStats()
    return () => {
      ignore = true
    }
  }, [])
 
  if (error) {
    return <div className="stat-error">{error}</div>
  }
 
  return (
    <div className="stat-grid">
      <div className="stat-card stat-card-user">
        <div className="stat-icon">
          <UserIcon />
        </div>
        <div className="stat-body">
          <span className="stat-label">Total Pengguna</span>
          <strong className="stat-value">
            {loading ? <span className="stat-skeleton" /> : stats.totalUsers.toLocaleString('id-ID')}
          </strong>
          <span className="stat-caption">Akun dengan role USER</span>
        </div>
      </div>
 
      <div className="stat-card stat-card-admin">
        <div className="stat-icon">
          <ShieldIcon />
        </div>
        <div className="stat-body">
          <span className="stat-label">Total Admin</span>
          <strong className="stat-value">
            {loading ? <span className="stat-skeleton" /> : stats.totalAdmins.toLocaleString('id-ID')}
          </strong>
          <span className="stat-caption">Akun dengan role ADMIN</span>
        </div>
      </div>
    </div>
  )
}