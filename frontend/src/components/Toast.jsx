import { useEffect } from 'react'
import '../Toast.css'

export default function Toast({ message, type = 'success', onClose, duration = 3500 }) {
  useEffect(() => {
    if (!message) return
    const timer = setTimeout(() => {
      onClose?.()
    }, duration)
    return () => clearTimeout(timer)
  }, [message, duration, onClose])

  if (!message) return null

  return (
    <div className={`toast toast-${type}`} role="status">
      <span className="toast-icon">{type === 'success' ? '✓' : '!'}</span>
      <span className="toast-text">{message}</span>
      <button
        type="button"
        className="toast-close"
        onClick={onClose}
        aria-label="Tutup notifikasi"
      >
        ×
      </button>
    </div>
  )
}