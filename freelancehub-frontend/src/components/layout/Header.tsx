import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import toast from 'react-hot-toast'
import Avatar from '../ui/Avatar'

export default function Header() {
  const { user, isAuthenticated, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    toast.success('Вы вышли из аккаунта')
    navigate('/login')
  }

  // Определяем куда вести кнопку "Мой кабинет" в зависимости от роли
  const dashboardPath =
    user?.role === 'Admin'
      ? '/admin'
      : user?.role === 'Student'
        ? '/dashboard/student'
        : '/dashboard/employer'

  // Цвет бейджа роли
  const roleBadgeClass =
    user?.role === 'Admin'
      ? 'bg-red-100 text-red-700'
      : user?.role === 'Student'
        ? 'bg-blue-100 text-blue-700'
        : 'bg-green-100 text-green-700'

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">

        {/* ── Логотип ── */}
        <Link
          to="/"
          className="text-xl font-bold text-blue-600 hover:text-blue-700 transition-colors shrink-0"
        >
          FreeLanceHub
        </Link>

        {/* ── Центральная навигация ── */}
        <nav className="hidden md:flex items-center gap-1">
          <Link
            to="/gigs"
            className="px-3 py-2 rounded-lg text-sm font-medium text-gray-600
              hover:text-gray-900 hover:bg-gray-100 transition-colors"
          >
            Услуги
          </Link>
          <Link
            to="/orders"
            className="px-3 py-2 rounded-lg text-sm font-medium text-gray-600
              hover:text-gray-900 hover:bg-gray-100 transition-colors"
          >
            Заказы
          </Link>

          {/* Кнопки только для авторизованных */}
          {isAuthenticated() && (
            <>
              {/* Создать услугу — только для студентов */}
              {user?.role === 'Student' && (
                <Link
                  to="/gigs/create"
                  className="px-3 py-2 rounded-lg text-sm font-medium text-gray-600
                    hover:text-gray-900 hover:bg-gray-100 transition-colors"
                >
                  + Услуга
                </Link>
              )}

              {/* Создать заказ — только для работодателей */}
              {user?.role === 'Employer' && (
                <Link
                  to="/orders/create"
                  className="px-3 py-2 rounded-lg text-sm font-medium text-gray-600
                    hover:text-gray-900 hover:bg-gray-100 transition-colors"
                >
                  + Заказ
                </Link>
              )}

              <Link
                to={`/profile/${user?.id}`}
                className="px-3 py-2 rounded-lg text-sm font-medium text-gray-600
    hover:text-gray-900 hover:bg-gray-100 transition-colors"
              >
                Мой профиль
              </Link>

              {user?.role === 'Admin' && (
                <Link
                  to="/admin"
                  className="px-3 py-2 rounded-lg text-sm font-medium text-red-600
      hover:text-red-700 hover:bg-red-50 transition-colors"
                >
                  Admin
                </Link>
              )}
            </>
          )}
        </nav>

        {/* ── Правая часть ── */}
        <div className="flex items-center gap-2 shrink-0">
          {isAuthenticated() ? (
            <>
              {/* Имя пользователя + роль */}
              <Link
                to={dashboardPath}
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg
                  hover:bg-gray-100 transition-colors"
              >
                {/* Аватар-заглушка с инициалами */}
                <Avatar
                  src={null}
                  name={`${user?.firstName ?? ''} ${user?.lastName ?? ''}`}
                  size="sm"
                />
                <div className="hidden lg:block">
                  <p className="text-sm font-medium text-gray-900 leading-tight">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${roleBadgeClass}`}>
                    {user?.role}
                  </span>
                </div>
              </Link>



              {/* Кнопка выхода */}
              <button
                onClick={handleLogout}
                className="text-sm text-gray-500 hover:text-red-600
                  hover:bg-red-50 px-3 py-2 rounded-lg transition-colors"
              >
                Выйти
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm font-medium text-gray-600 hover:text-gray-900
                  px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Войти
              </Link>
              <Link
                to="/register"
                className="text-sm font-semibold bg-blue-600 text-white px-4 py-2
                  rounded-lg hover:bg-blue-700 transition-colors"
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