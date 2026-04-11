import { Link } from 'react-router-dom'

/**
 * Подвал сайта.
 * Полная реализация — на День 9 (полировка UI).
 */
export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Логотип */}
          <div>
            <span className="text-lg font-bold text-blue-600">FreeLanceHub</span>
            <p className="text-xs text-gray-500 mt-1">
              Биржа фриланс-услуг для студентов
            </p>
          </div>

          {/* Ссылки */}
          <nav className="flex items-center gap-6">
            <Link
              to="/gigs"
              className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
            >
              Услуги
            </Link>
            <Link
              to="/orders"
              className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
            >
              Заказы
            </Link>
          </nav>

          {/* Копирайт */}
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} FreeLanceHub
          </p>
        </div>
      </div>
    </footer>
  )
}