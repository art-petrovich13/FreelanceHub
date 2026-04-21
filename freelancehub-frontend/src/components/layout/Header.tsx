import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import toast from 'react-hot-toast'
import Avatar from '../ui/Avatar'
import NotificationBell from './NotificationBell'
import { LayoutDashboard, User, LogOut, ChevronDown } from 'lucide-react'

export default function Header() {
  const { user, isAuthenticated, logout } = useAuthStore()
  const navigate = useNavigate()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Закрываем дропдаун при клике вне него
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = () => {
    setDropdownOpen(false)
    logout()
    toast.success('Вы вышли из аккаунта')
    navigate('/login')
  }

  const dashboardPath =
    user?.role === 'Admin'
      ? '/admin'
      : user?.role === 'Student'
        ? '/dashboard/student'
        : '/dashboard/employer'

  const dashboardLabel =
    user?.role === 'Admin'
      ? 'Панель администратора'
      : 'Мой кабинет'

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

          {isAuthenticated() && (
            <>
              {user?.role === 'Student' && (
                <Link
                  to="/gigs/create"
                  className="px-3 py-2 rounded-lg text-sm font-medium text-gray-600
                    hover:text-gray-900 hover:bg-gray-100 transition-colors"
                >
                  + Услуга
                </Link>
              )}

              {user?.role === 'Employer' && (
                <Link
                  to="/orders/create"
                  className="px-3 py-2 rounded-lg text-sm font-medium text-gray-600
                    hover:text-gray-900 hover:bg-gray-100 transition-colors"
                >
                  + Заказ
                </Link>
              )}

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
              {/* Уведомления */}
              <NotificationBell />

              {/* Аватар + дропдаун */}
              <div className="relative" ref={dropdownRef}>

                {/* Кнопка-триггер */}
                <button
                  onClick={() => setDropdownOpen((o) => !o)}
                  className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl
                    hover:bg-gray-100 transition-colors"
                >
                  <Avatar
                    src={null}
                    name={`${user?.firstName ?? ''} ${user?.lastName ?? ''}`}
                    size="sm"
                  />
                  <div className="hidden lg:block text-left">
                    <p className="text-sm font-medium text-gray-900 leading-tight">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${roleBadgeClass}`}>
                      {user?.role}
                    </span>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-gray-400 hidden lg:block transition-transform duration-200
                      ${dropdownOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                {/* Дропдаун меню */}
                {dropdownOpen && (
                  <div className="absolute right-0 top-16 w-52 bg-white rounded-2xl
                    shadow-xl border border-gray-200 z-50 overflow-hidden py-1">

                    {/* Шапка дропдауна — имя и роль */}
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {user?.firstName} {user?.lastName}
                      </p>
                      <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                    </div>

                    {/* Ссылки */}
                    <div className="py-1">

                      {/* Мой кабинет / Панель администратора */}
                      <Link
                        to={dashboardPath}
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700
                          hover:bg-gray-50 transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4 text-gray-400" />
                        {dashboardLabel}
                      </Link>

                      {/* Мой профиль */}
                      <Link
                        to={`/profile/${user?.id}`}
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700
                          hover:bg-gray-50 transition-colors"
                      >
                        <User className="w-4 h-4 text-gray-400" />
                        Мой профиль
                      </Link>

                    </div>

                    {/* Разделитель */}
                    <div className="border-t border-gray-100 py-1">
                      {/* Выйти */}
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm
                          text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Выйти
                      </button>
                    </div>

                  </div>
                )}

              </div>

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