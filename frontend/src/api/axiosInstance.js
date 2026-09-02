import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080/api',
})

const AUTH_PATHS = {
  ADMIN_LOGIN: '/auth/admin/login',
  USER_LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  FORGOT_PASSWORD: '/auth/forgot-password',
  LOGOUT: '/auth/logout',
}

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Interceptor: kalau token expired/invalid (401) SAAT MENGAKSES DATA,
// otomatis logout & redirect. Tidak berlaku untuk endpoint login/register
// itu sendiri, supaya pesan error "password salah" sempat tampil dulu.
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const requestUrl = error.config?.url || ''
 
    const isAuthEndpoint =
      requestUrl.includes(AUTH_PATHS.ADMIN_LOGIN) ||
      requestUrl.includes(AUTH_PATHS.USER_LOGIN) ||
      requestUrl.includes(AUTH_PATHS.REGISTER)

    if (error.response?.status === 401 && !isAuthEndpoint) {
      // Cek role user yang tersimpan, supaya diarahkan ke halaman
      // login yang sesuai (admin -> /login, user biasa -> /user/login)
      const storedUser = localStorage.getItem('user')
      let redirectPath = '/login'

      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser)
          if (parsedUser?.role?.toUpperCase() === 'ADMIN') {
            redirectPath = '/admin/login'
          }
        } catch {
          // Kalau gagal parse, fallback ke /user/login
        }
      }

      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = redirectPath
    }

    return Promise.reject(error)
  }
)

export default axiosInstance