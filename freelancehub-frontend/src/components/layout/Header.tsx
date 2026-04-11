import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'

/**
 * Шапка сайта — отображается на всех страницах через Layout.
 * Показывает навигацию и кнопки Login/Logout в зависимости от авторизации.
 * Полная реализация с аватаром, уведомлениями — на День 3 и День 8.
 */
export default function Header() {
  const { user, isAuthenticated, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Логотип */}
        <Link
          to="/"
          className="text-xl font-bold text-blue-600 hover:text-blue-700 transition-colors"
        >
          FreeLanceHub
        </Link>

        {/* Основная навигация */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            to="/gigs"
            className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
          >
            Услуги
          </Link>
          <Link
            to="/orders"
            className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
          >
            Заказы
          </Link>
        </nav>

        {/* Правая часть — авторизация */}
        <div className="flex items-center gap-3">
          {isAuthenticated() ? (
            <>
              {/* Имя пользователя */}
              <span className="text-sm text-gray-700 hidden sm:block">
                {user?.firstName} {user?.lastName}
              </span>

              {/* Значок роли */}
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium hidden sm:block ${
                user?.role === 'Admin'
                  ? 'bg-red-100 text-red-700'
                  : user?.role === 'Student'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-green-100 text-green-700'
              }`}>
                {user?.role}
              </span>

              {/* Кнопка выхода */}
              <button
                onClick={handleLogout}
                className="text-sm text-gray-500 hover:text-red-600 transition-colors"
              >
                Выйти
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm font-medium text-gray-600 hover:text-gray-900"
              >
                Войти
              </Link>
              <Link
                to="/register"
                className="text-sm font-medium bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Регистрация
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}