import { useParams, Link } from 'react-router-dom'
import { Calendar, DollarSign, ArrowLeft, Users } from 'lucide-react'
import { useOrder, useCompleteOrder, useConfirmOrder } from '../../hooks/useOrders'
import { useOrderProposals, useAcceptProposal, useRejectProposal } from '../../hooks/useProposals'
import { useAuthStore } from '../../store/authStore'
import Spinner from '../../components/ui/Spinner'
import Badge from '../../components/ui/Badge'
import ProposalCard from '../../components/orders/ProposalCard'
import ProposalForm from '../../components/orders/ProposalForm'
import ReviewForm from '../../components/reviews/ReviewForm'

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>()
  const user = useAuthStore((s) => s.user)

  const { data: order, isLoading, isError } = useOrder(id!)

  // Определяем роль текущего пользователя относительно заказа
  const isEmployer = user?.id === order?.employerId
  const isStudent = user?.role === 'Student'
  const isSelectedStudent = user?.id === order?.selectedStudentId

  // Загружаем отклики только если пользователь — владелец заказа
  const { data: proposals } = useOrderProposals(id!, isEmployer)

  const completeOrder = useCompleteOrder()
  const confirmOrder = useConfirmOrder()
  const acceptProposal = useAcceptProposal()
  const rejectProposal = useRejectProposal()

  // ── Загрузка ──
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    )
  }

  // ── Ошибка ──
  if (isError || !order) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="text-5xl mb-4">😕</div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Заказ не найден</h2>
        <Link to="/orders" className="text-blue-600 hover:underline text-sm">
          ← Вернуться к списку заказов
        </Link>
      </div>
    )
  }

  // Форматируем дедлайн
  const deadlineStr = new Date(order.deadline).toLocaleDateString('ru-RU', {
    day: 'numeric', month: 'long', year: 'numeric'
  })

  // Лейбл статуса
  const statusLabels: Record<string, string> = {
    Open: 'Открыт', InProgress: 'В работе',
    Completed: 'Завершён', Cancelled: 'Отменён', Rejected: 'Отклонён',
  }
  const statusVariants: Record<string, any> = {
    Open: 'green', InProgress: 'blue',
    Completed: 'gray', Cancelled: 'red', Rejected: 'red',
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">

      {/* Назад */}
      <Link to="/orders"
        className="inline-flex items-center gap-2 text-sm text-gray-500
          hover:text-gray-900 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Все заказы
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ── Основная информация ── */}
        <div className="lg:col-span-2 space-y-6">

          {/* Заголовок */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <Badge variant="blue">{order.categoryName}</Badge>
              <Badge variant={statusVariants[order.status]}>
                {statusLabels[order.status]}
              </Badge>
            </div>

            <h1 className="text-2xl font-bold text-gray-900 mb-4 leading-snug">
              {order.title}
            </h1>

            {/* Навыки */}
            {order.skills.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {order.skills.map((skill) => (
                  <span key={skill.id}
                    className="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
                    {skill.name}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Описание */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Описание задания
            </h2>
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {order.description}
            </p>
          </div>

          {/* Выбранный исполнитель (если заказ в работе) */}
          {order.selectedStudentId && order.status !== 'Open' && (
            <div className="bg-blue-50 rounded-xl border border-blue-100 p-5">
              <p className="text-sm text-blue-700 font-medium mb-1">
                ✓ Выбранный исполнитель
              </p>
              <Link
                to={`/profile/${order.selectedStudentId}`}
                className="font-semibold text-blue-900 hover:underline"
              >
                {order.selectedStudentName}
              </Link>
            </div>
          )}

          {/* Секция откликов — только для работодателя */}
          {isEmployer && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-5">
                <Users className="w-5 h-5 text-gray-400" />
                <h2 className="text-lg font-semibold text-gray-900">
                  Отклики
                </h2>
                <span className="text-sm text-gray-400">
                  ({proposals?.length ?? 0})
                </span>
              </div>

              {!proposals || proposals.length === 0 ? (
                <div className="text-center py-8 text-gray-500 text-sm">
                  Пока нет откликов на этот заказ
                </div>
              ) : (
                <div className="space-y-4">
                  {proposals.map((proposal) => (
                    <ProposalCard
                      key={proposal.id}
                      proposal={proposal}
                      isEmployer={isEmployer}
                      onAccept={(pid) => acceptProposal.mutate(pid)}
                      onReject={(pid) => rejectProposal.mutate(pid)}
                      isAccepting={acceptProposal.isPending}
                      isRejecting={rejectProposal.isPending}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Форма отклика — только для студента и только если заказ открыт */}
          {isStudent && !isEmployer && order.status === 'Open' && (
            <ProposalForm orderId={id!} orderBudget={order.budget} />
          )}

          {order.status === 'Completed' && (
            <ReviewForm orderId={id!} />
          )}

        </div>



        {/* ── Боковая панель ── */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-24">

            {/* Бюджет */}
            <div className="mb-4">
              <p className="text-xs text-gray-500 mb-1">Бюджет</p>
              <div className="flex items-center gap-1">
                <DollarSign className="w-5 h-5 text-green-500" />
                <span className="text-2xl font-bold text-gray-900">
                  {order.budget.toLocaleString('ru-RU')} ₽
                </span>
              </div>
            </div>

            {/* Дедлайн */}
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-4
              pb-4 border-b border-gray-100">
              <Calendar className="w-4 h-4 text-gray-400" />
              <div>
                <p className="text-xs text-gray-400">Дедлайн</p>
                <p className="font-medium">{deadlineStr}</p>
              </div>
            </div>

            {/* Количество откликов */}
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-5">
              <Users className="w-4 h-4 text-gray-400" />
              <span>{order.proposalCount} откликов</span>
            </div>

            {/* Кнопки действий */}

            {/* Работодатель: завершить/отменить */}
            {isEmployer && order.status === 'Completed' && (
              <button
                onClick={() => confirmOrder.mutate(id!)}
                disabled={confirmOrder.isPending}
                className="w-full py-3 bg-green-600 text-white rounded-xl text-sm
                  font-semibold hover:bg-green-700 disabled:opacity-60 transition-colors mb-2"
              >
                {confirmOrder.isPending ? 'Подтверждаем...' : '✓ Подтвердить завершение'}
              </button>
            )}

            {isEmployer && (order.status === 'Open' || order.status === 'InProgress') && (
              <button
                onClick={() => { if (confirm('Отменить заказ?')) confirmOrder.mutate(id!) }}
                className="w-full py-2.5 border border-red-300 text-red-600 rounded-xl
                  text-sm font-semibold hover:bg-red-50 transition-colors mt-2"
              >
                Отменить заказ
              </button>
            )}

            {/* Студент-исполнитель: завершить */}
            {isSelectedStudent && order.status === 'InProgress' && (
              <button
                onClick={() => completeOrder.mutate(id!)}
                disabled={completeOrder.isPending}
                className="w-full py-3 bg-blue-600 text-white rounded-xl text-sm
                  font-semibold hover:bg-blue-700 disabled:opacity-60 transition-colors"
              >
                {completeOrder.isPending ? 'Отправляем...' : '✓ Работа выполнена'}
              </button>
            )}

            {/* Ссылка на профиль работодателя */}
            <Link
              to={`/profile/${order.employerId}`}
              className="block mt-4 text-center text-sm text-blue-600 hover:underline"
            >
              Профиль заказчика: {order.employerName}
            </Link>

          </div>
        </div>

      </div>

    </div>
  )
}