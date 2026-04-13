import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { 'Content-Type': 'application/json' },
})

// ── Request interceptor — добавляет JWT токен ──────────────────────────────
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// ── Response interceptor — обрабатывает глобальные ошибки ─────────────────
api.interceptors.response.use(
  // Успешный ответ — возвращаем как есть
  (response) => response,

  // Ошибка — анализируем статус
  (error) => {
    if (error.response?.status === 401) {
      // Токен истёк или невалидный → разлогиниваем и редиректим
      localStorage.removeItem('access_token')
      // Не редиректим здесь напрямую если мы уже на /login
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login'
      }
    }
    // Пробрасываем ошибку дальше — компоненты обрабатывают её сами
    return Promise.reject(error)
  }
)

export default api