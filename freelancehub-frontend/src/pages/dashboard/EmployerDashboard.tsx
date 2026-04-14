import { Link } from 'react-router-dom'
import {
  Briefcase, Users, CheckCircle, Clock, Plus, ArrowRight, DollarSign,
} from 'lucide-react'
import { useEmployerDashboard } from '../../hooks/useDashboard'
import { useAuthStore } from '../../store/authStore'
import StatCard from '../../components/admin/StatCard'
import OrderCard from '../../components/orders/OrderCard'
import Spinner from '../../components/ui/Spinner'
import Badge from '../../components/ui/Badge'

export default function EmployerDashboard() {
  const user = useAuthStore((s) => s.user)
  const { data, isLoading } = useEmployerDashboard()

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
            Управляйте заказами и выбирайте исполнителей
          </p>
        </div>
        <Link
          to="/orders/create"
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2
            rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Новый заказ
        </Link>
      </div>

      {/* ── Виджеты ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Всего заказов"
          value={data.totalOrders}
          icon={Briefcase}
          color="blue"
          sub={`${data.openOrders} открытых`}
        />
        <StatCard
          label="В работе"
          value={data.inProgressOrders}
          icon={Clock}
          color="purple"
        />
        <StatCard
          label="Завершено"
          value={data.completedOrders}
          icon={CheckCircle}
          color="green"
        />
        <StatCard
          label="Потрачено (₽)"
          value={data.totalSpent}
          icon={DollarSign}
          color="orange"
          sub="На завершённые заказы"
        />
      </div>

      {/* Плашка с непрочитанными откликами */}
      {data.pendingProposals > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl px-5 py-4
          flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center
              justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="font-semibold text-blue-900">
                {data.pendingProposals} откликов ждут вашего решения
              </p>
              <p className="text-sm text-blue-600">
                Просмотрите и выберите исполнителя
              </p>
            </div>
          </div>
          <Link
            to="/orders"
            className="text-sm bg-blue-600 text-white px-4 py-2 rounded-xl
              hover:bg-blue-700 transition-colors font-semibold"
          >
            Смотреть →
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* ── Открытые заказы ── */}
        <section className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">
              Открытые заказы
              {data.openOrders > 0 && (
                <span className="ml-2 text-xs text-gray-400 font-normal">
                  ({data.openOrders})
                </span>
              )}
            </h2>
            <Link to="/orders/create"
              className="text-sm text-blue-600 hover:underline flex items-center gap-1">
              <Plus className="w-3.5 h-3.5" /> Создать
            </Link>
          </div>

          {data.openOrdersList.length === 0 ? (
            <div className="text-center py-8 text-sm text-gray-500">
              <Briefcase className="w-8 h-8 mx-auto mb-2 text-gray-300" />
              <p>Нет открытых заказов</p>
              <Link to="/orders/create"
                className="text-blue-600 hover:underline mt-1 inline-block">
                Создать заказ
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {data.openOrdersList.map((order) => (
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
                      {order.budget.toLocaleString('ru-RU')} ₽ ·{' '}
                      {order.proposalCount} откликов
                    </p>
                  </div>
                  <Badge variant="green" className="ml-3 shrink-0">Открыт</Badge>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* ── Заказы в работе ── */}
        <section className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">В работе</h2>
          </div>

          {data.inProgressOrdersList.length === 0 ? (
            <div className="text-center py-8 text-sm text-gray-500">
              Нет заказов в работе
            </div>
          ) : (
            <div className="space-y-3">
              {data.inProgressOrdersList.map((order) => (
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
                      {order.budget.toLocaleString('ru-RU')} ₽
                    </p>
                  </div>
                  <Badge variant="blue" className="ml-3 shrink-0">В работе</Badge>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* ── Последние отклики (ожидают решения) ── */}
        <section className="bg-white rounded-xl border border-gray-200 p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">
              Новые отклики
            </h2>
            <Link to="/orders"
              className="text-sm text-blue-600 hover:underline flex items-center gap-1">
              Все заказы <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {data.recentPendingProposals.length === 0 ? (
            <div className="text-center py-8 text-sm text-gray-500">
              Нет новых откликов
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-gray-500 border-b border-gray-100">
                    <th className="pb-2 font-medium">Студент</th>
                    <th className="pb-2 font-medium">Заказ</th>
                    <th className="pb-2 font-medium">Цена</th>
                    <th className="pb-2 font-medium">Срок</th>
                    <th className="pb-2 font-medium" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {data.recentPendingProposals.map((p) => (
                    <tr key={p.proposalId} className="hover:bg-gray-50">
                      <td className="py-2.5 pr-4 font-medium text-gray-900">
                        {p.studentName}
                      </td>
                      <td className="py-2.5 pr-4">
                        <Link to={`/orders/${p.orderId}`}
                          className="text-gray-600 hover:text-blue-600 line-clamp-1">
                          {p.orderTitle}
                        </Link>
                      </td>
                      <td className="py-2.5 pr-4 font-semibold text-gray-900">
                        {p.proposedPrice.toLocaleString('ru-RU')} ₽
                      </td>
                      <td className="py-2.5 pr-4 text-gray-500">
                        {p.proposedDays} дн.
                      </td>
                      <td className="py-2.5">
                        <Link to={`/orders/${p.orderId}`}
                          className="text-xs text-blue-600 hover:underline">
                          Смотреть →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

      </div>

    </div>
  )
}