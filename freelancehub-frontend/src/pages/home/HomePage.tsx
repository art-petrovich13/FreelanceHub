import { Link } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'

export default function HomePage() {
  const { isAuthenticated, user } = useAuthStore()

  return (
    <div className="max-w-7xl mx-auto px-4">

      {/* ── Hero секция ── */}
      <section className="py-16 text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          FreeLanceHub
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Биржа фриланс-услуг для студентов.
          Найди заказчика или исполнителя прямо в своём университете.
        </p>

        {/* Кнопки в зависимости от авторизации */}
        {isAuthenticated() ? (
          <div className="flex items-center justify-center gap-4">
            <Link
              to="/gigs"
              className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold
                hover:bg-blue-700 transition-colors"
            >
              Смотреть услуги
            </Link>
            <Link
              to="/orders"
              className="bg-white text-gray-900 px-6 py-3 rounded-xl font-semibold
                border border-gray-300 hover:bg-gray-50 transition-colors"
            >
              Смотреть заказы
            </Link>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-4">
            <Link
              to="/register"
              className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold
                hover:bg-blue-700 transition-colors"
            >
              Начать бесплатно
            </Link>
            <Link
              to="/login"
              className="bg-white text-gray-900 px-6 py-3 rounded-xl font-semibold
                border border-gray-300 hover:bg-gray-50 transition-colors"
            >
              Войти
            </Link>
          </div>
        )}
      </section>

      {/* ── Карточки ролей ── */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-16">
        <div className="bg-blue-50 rounded-2xl p-8 border border-blue-100">
          <div className="text-4xl mb-4">🎓</div>
          <h2 className="text-xl font-bold text-blue-900 mb-2">Для студентов</h2>
          <p className="text-blue-700 text-sm leading-relaxed">
            Создавай портфолио, публикуй услуги, откликайся на заказы и зарабатывай
            на своих навыках ещё во время учёбы.
          </p>
        </div>
        <div className="bg-green-50 rounded-2xl p-8 border border-green-100">
          <div className="text-4xl mb-4">💼</div>
          <h2 className="text-xl font-bold text-green-900 mb-2">Для работодателей</h2>
          <p className="text-green-700 text-sm leading-relaxed">
            Публикуй задания, выбирай из студентов-исполнителей, получай качественную
            работу по студенческим ценам.
          </p>
        </div>
      </section>

    </div>
  )
}