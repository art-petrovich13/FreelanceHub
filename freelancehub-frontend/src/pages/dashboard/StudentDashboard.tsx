import { Link } from 'react-router-dom'
import {
  Briefcase, Star, TrendingUp, CheckCircle,
  Clock, Plus, ArrowRight,
} from 'lucide-react'
import { useStudentDashboard } from '../../hooks/useDashboard'
import { useAuthStore } from '../../store/authStore'
import StatCard from '../../components/admin/StatCard'
import GigCard from '../../components/gigs/GigCard'
import OrderCard from '../../components/orders/OrderCard'
import Spinner from '../../components/ui/Spinner'
import Badge from '../../components/ui/Badge'

// Лейбл статуса отклика
const proposalStatusBadge = (status: string) => {
  const map: Record<string, any> = {
    Pending:  { variant: 'yellow', label: 'На рассмотрении' },
    Accepted: { variant: 'green',  label: 'Принят ✓' },
    Rejected: { variant: 'red',    label: 'Отклонён' },
  }
  return map[status] ?? { variant: 'gray', label: status }
}

export default function StudentDashboard() {
  const user = useAuthStore((s) => s.user)
  const { data, isLoading } = useStudentDashboard()

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    )
  }

  if (!data) return null

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">

      {/* Приветствие */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Привет, {user?.firstName}! 👋
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Вот что происходит с твоими услугами и заказами
          </p>
        </div>
        <Link
          to="/gigs/create"
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2
            rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Новая услуга
        </Link>
      </div>

      {/* ── Виджеты статистики ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Мои услуги"
          value={data.totalGigs}
          icon={Star}
          color="blue"
          sub={`${data.activeGigs} активных · ${data.pendingGigs} на модерации`}
        />
        <StatCard
          label="Мои отклики"
          value={data.totalProposals}
          icon={TrendingUp}
          color="purple"
          sub={`${data.acceptedProposals} принято`}
        />
        <StatCard
          label="В работе"
          value={data.activeOrders}
          icon={Clock}
          color="yellow"
          sub={`${data.completedOrders} завершено`}
        />
        <StatCard
          label="Заработано"
          value={data.totalEarned}
          icon={CheckCircle}
          color="green"
          sub="По завершённым заказам (₽)"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* ── Мои услуги ── */}
        <section className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Мои услуги</h2>
            <Link
              to="/gigs"
              className="text-sm text-blue-600 hover:underline flex items-center gap-1"
            >
              Все <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {data.recentGigs.length === 0 ? (
            <div className="text-center py-8 text-sm text-gray-500">
              <Star className="w-8 h-8 mx-auto mb-2 text-gray-300" />
              <p>У вас пока нет услуг</p>
              <Link to="/gigs/create"
                className="text-blue-600 hover:underline mt-1 inline-block">
                Создать первую услугу
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {data.recentGigs.map((gig) => (
                <Link
                  key={gig.id}
                  to={`/gigs/${gig.id}`}
                  className="flex items-center justify-between p-3 rounded-lg
                    hover:bg-gray-50 transition-colors group"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate
                      group-hover:text-blue-600">
                      {gig.title}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {gig.price.toLocaleString('ru-RU')} ₽ · {gig.categoryName}
                    </p>
                  </div>
                  <Badge
                    variant={gig.status === 'Active'
                      ? 'green'
                      : gig.status === 'Pending'
                      ? 'yellow'
                      : 'red'}
                    className="ml-3 shrink-0"
                  >
                    {gig.status === 'Active' ? 'Активна'
                     : gig.status === 'Pending' ? 'Модерация'
                     : gig.status}
                  </Badge>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* ── Активные заказы (студент — исполнитель) ── */}
        <section className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Мои активные заказы</h2>
            <Link to="/orders"
              className="text-sm text-blue-600 hover:underline flex items-center gap-1">
              Все <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {data.activeOrdersList.length === 0 ? (
            <div className="text-center py-8 text-sm text-gray-500">
              <Briefcase className="w-8 h-8 mx-auto mb-2 text-gray-300" />
              <p>Нет активных заказов</p>
              <Link to="/orders"
                className="text-blue-600 hover:underline mt-1 inline-block">
                Найти заказ
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {data.activeOrdersList.map((order) => (
                <Link
                  key={order.id}
                  to={`/orders/${order.id}`}
                  className="flex items-center justify-between p-3 rounded-lg
                    hover:bg-gray-50 transition-colors group"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate
                      group-hover:text-blue-600">
                      {order.title}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {order.budget.toLocaleString('ru-RU')} ₽ · {order.employerName}
                    </p>
                  </div>
                  <Badge variant="blue" className="ml-3 shrink-0">В работе</Badge>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* ── Мои отклики ── */}
        <section className="bg-white rounded-xl border border-gray-200 p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Последние отклики</h2>
          </div>

          {data.recentProposals.length === 0 ? (
            <div className="text-center py-8 text-sm text-gray-500">
              Вы ещё не откликались на заказы
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-gray-500 border-b border-gray-100">
                    <th className="pb-2 font-medium">Заказ</th>
                    <th className="pb-2 font-medium">Ваша цена</th>
                    <th className="pb-2 font-medium">Срок</th>
                    <th className="pb-2 font-medium">Статус</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {data.recentProposals.map((proposal) => {
                    const { variant, label } = proposalStatusBadge(proposal.status)
                    return (
                      <tr key={proposal.id} className="hover:bg-gray-50">
                        <td className="py-2.5 pr-4">
                          <Link to={`/orders/${proposal.orderId}`}
                            className="text-gray-900 hover:text-blue-600 font-medium
                              line-clamp-1">
                            Заказ #{proposal.orderId.slice(0, 8)}...
                          </Link>
                        </td>
                        <td className="py-2.5 pr-4 font-semibold text-gray-900">
                          {proposal.proposedPrice.toLocaleString('ru-RU')} ₽
                        </td>
                        <td className="py-2.5 pr-4 text-gray-500">
                          {proposal.proposedDays} дней
                        </td>
                        <td className="py-2.5">
                          <Badge variant={variant}>{label}</Badge>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>

      </div>

    </div>
  )
}