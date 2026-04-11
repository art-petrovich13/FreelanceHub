import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

// Данные о текущем вошедшем пользователе
interface UserInfo {
  id: string
  email: string
  firstName: string
  lastName: string
  role: string  // 'Student' | 'Employer' | 'Admin'
}

// Интерфейс стора — поля и методы
interface AuthStore {
  user: UserInfo | null
  token: string | null

  // Методы
  setAuth: (user: UserInfo, token: string) => void
  logout: () => void
  isAuthenticated: () => boolean
  hasRole: (role: string) => boolean
}

export const useAuthStore = create<AuthStore>()(
  // persist — сохраняет состояние в localStorage
  // При перезагрузке страницы пользователь останется авторизованным
  persist(
    (set, get) => ({
      user: null,
      token: null,

      setAuth: (user, token) => {
        // Сохраняем токен отдельно для Axios интерцептора
        localStorage.setItem('access_token', token)
        set({ user, token })
      },

      logout: () => {
        localStorage.removeItem('access_token')
        set({ user: null, token: null })
      },

      isAuthenticated: () => get().token !== null,

      hasRole: (role: string) => get().user?.role === role,
    }),
    {
      name: 'auth-storage',          // ключ в localStorage
      storage: createJSONStorage(() => localStorage),
      // Сохраняем только user и token, не сохраняем функции
      partialize: (state) => ({ user: state.user, token: state.token }),
    }
  )
)