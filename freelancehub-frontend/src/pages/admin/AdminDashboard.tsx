import { Link } from 'react-router-dom'
import {
  Users, Briefcase, Star, TrendingUp,
  Clock, CheckCircle, AlertTriangle, ShieldOff,
} from 'lucide-react'
import { useAdminStats } from '../../hooks/useAdmin'
import StatCard from '../../components/admin/StatCard'
import Spinner from '../../components/ui/Spinner'

export default function AdminDashboard() {
  const { data: stats, isLoading } = useAdminStats()

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    )
  }

  if (!stats) return null

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">

      {/* Заголовок */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Панель администратора</h1>
        <p className="text-sm text-gray-500 mt-1">
          Общая статистика и управление платформой FreeLanceHub
        </p>
      </div>

      {/* ── Быстрые ссылки ── */}
      <section>
        <h2 className="text-sm font-semibold text-gray-500 uppercase
          tracking-wide mb-4">
          Быстрые действия
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          <Link
            to="/admin/users"
            className="bg-white rounded-xl border border-gray-200 p-5
              hover:shadow-sm hover:border-blue-200 transition-all"
          >
            <Users className="w-8 h-8 text-blue-500 mb-3" />
            <p className="font-semibold text-gray-900">Пользователи</p>
            <p className="text-sm text-gray-500 mt-1">
              Блокировка, смена ролей
            </p>
          </Link>
          <Link
            to="/admin/gigs"
            className="bg-white rounded-xl border border-gray-200 p-5
              hover:shadow-sm hover:border-orange-200 transition-all relative"
          >
            {stats.pendingGigs > 0 && (
              <span className="absolute top-3 right-3 bg-orange-500 text-white
                text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
                {stats.pendingGigs}
              </span>
            )}
            <Star className="w-8 h-8 text-orange-500 mb-3" />
            <p className="font-semibold text-gray-900">Модерация услуг</p>
            <p className="text-sm text-gray-500 mt-1">
              Одобрить или отклонить
            </p>
          </Link>
          <Link
            to="/admin/orders"
            className="bg-white rounded-xl border border-gray-200 p-5
              hover:shadow-sm hover:border-purple-200 transition-all"
          >
            <Briefcase className="w-8 h-8 text-purple-500 mb-3" />
            <p className="font-semibold text-gray-900">Заказы</p>
            <p className="text-sm text-gray-500 mt-1">
              Управление и статусы
            </p>
          </Link>
        </div>
      </section>

      {/* ── Блок 1: Пользователи ── */}
      <section className="mb-8">
        <h2 className="text-sm font-semibold text-gray-500 uppercase
          tracking-wide mb-4">
          Пользователи
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Всего пользователей"
            value={stats.totalUsers}
            icon={Users}
            color="blue"
            trend={stats.newUsersThisWeek}
          />
          <StatCard
            label="Студентов"
            value={stats.totalStudents}
            icon={TrendingUp}
            color="green"
            sub="Фрилансеров на платформе"
          />
          <StatCard
            label="Работодателей"
            value={stats.totalEmployers}
            icon={Briefcase}
            color="purple"
            sub="Заказчиков на платформе"
          />
          <StatCard
            label="Заблокированных"
            value={stats.blockedUsers}
            icon={ShieldOff}
            color="red"
            sub="Нарушителей правил"
          />
        </div>
      </section>

      {/* ── Блок 2: Заказы ── */}
      <section className="mb-8">
        <h2 className="text-sm font-semibold text-gray-500 uppercase
          tracking-wide mb-4">
          Заказы
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Всего заказов"
            value={stats.totalOrders}
            icon={Briefcase}
            color="blue"
            trend={stats.newOrdersThisWeek}
          />
          <StatCard
            label="Открытых"
            value={stats.openOrders}
            icon={Clock}
            color="yellow"
            sub="Принимают отклики"
          />
          <StatCard
            label="В работе"
            value={stats.inProgressOrders}
            icon={TrendingUp}
            color="purple"
            sub="Исполнитель назначен"
          />
          <StatCard
            label="Завершённых"
            value={stats.completedOrders}
            icon={CheckCircle}
            color="green"
            sub="Успешно выполнено"
          />
        </div>
      </section>

      {/* ── Блок 3: Услуги ── */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
            Услуги
          </h2>
          {stats.pendingGigs > 0 && (
            <Link
              to="/admin/gigs"
              className="flex items-center gap-1.5 text-sm text-orange-600
                bg-orange-50 px-3 py-1.5 rounded-lg hover:bg-orange-100 transition-colors"
            >
              <AlertTriangle className="w-4 h-4" />
              {stats.pendingGigs} ждут модерации
            </Link>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Всего услуг"
            value={stats.totalGigs}
            icon={Star}
            color="blue"
            trend={stats.newGigsThisWeek}
          />
          <StatCard
            label="Активных"
            value={stats.activeGigs}
            icon={CheckCircle}
            color="green"
          />
          <StatCard
            label="На модерации"
            value={stats.pendingGigs}
            icon={Clock}
            color="yellow"
          />
          <StatCard
            label="Отклонённых"
            value={stats.rejectedGigs}
            icon={AlertTriangle}
            color="red"
          />
        </div>
      </section>



    </div>
  )
}