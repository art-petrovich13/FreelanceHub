import { Link } from 'react-router-dom'
import { Calendar, DollarSign, Users } from 'lucide-react'
import type { OrderListItem } from '../../types/order.types'
import Badge from '../ui/Badge'

interface OrderCardProps {
  order: OrderListItem
}

// Цвет бейджа статуса
function statusBadge(status: string) {
  const map: Record<string, 'green' | 'blue' | 'gray' | 'yellow' | 'red'> = {
    Open:       'green',
    InProgress: 'blue',
    Completed:  'gray',
    Cancelled:  'red',
    Rejected:   'red',
  }
  const labels: Record<string, string> = {
    Open:       'Открыт',
    InProgress: 'В работе',
    Completed:  'Завершён',
    Cancelled:  'Отменён',
    Rejected:   'Отклонён',
  }
  return { variant: map[status] ?? 'gray', label: labels[status] ?? status }
}

export default function OrderCard({ order }: OrderCardProps) {
  const { variant, label } = statusBadge(order.status)

  // Форматируем дедлайн
  const deadlineDate = new Date(order.deadline)
  const deadlineStr  = deadlineDate.toLocaleDateString('ru-RU', {
    day: 'numeric', month: 'short', year: 'numeric'
  })
  // Подсвечиваем если дедлайн скоро
  const daysLeft = Math.ceil(
    (deadlineDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  )
  const isUrgent = daysLeft <= 3 && daysLeft >= 0
  const isExpired = daysLeft < 0

  return (
    <Link
      to={`/orders/${order.id}`}
      className="block bg-white rounded-xl border border-gray-200 p-5
        hover:shadow-md hover:border-blue-200 transition-all duration-200 group"
    >
      {/* Заголовок + статус */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <h3 className="font-semibold text-gray-900 line-clamp-2
          group-hover:text-blue-600 transition-colors leading-snug flex-1">
          {order.title}
        </h3>
        <Badge variant={variant} className="shrink-0">{label}</Badge>
      </div>

      {/* Категория */}
      <div className="mb-3">
        <Badge variant="blue">{order.categoryName}</Badge>
      </div>

      {/* Навыки */}
      {order.skills.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {order.skills.slice(0, 3).map((skill) => (
            <span key={skill}
              className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md">
              {skill}
            </span>
          ))}
          {order.skills.length > 3 && (
            <span className="text-xs text-gray-400 px-1 py-0.5">
              +{order.skills.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Нижняя строка: бюджет, дедлайн, отклики */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100 gap-2 flex-wrap">
        {/* Бюджет */}
        <div className="flex items-center gap-1 text-sm font-semibold text-green-600">
          <DollarSign className="w-3.5 h-3.5" />
          {order.budget.toLocaleString('ru-RU')} ₽
        </div>

        {/* Дедлайн */}
        <div className={`flex items-center gap-1 text-xs
          ${isExpired ? 'text-red-500' : isUrgent ? 'text-orange-500' : 'text-gray-500'}`}>
          <Calendar className="w-3.5 h-3.5" />
          {isExpired
            ? 'Истёк'
            : isUrgent
            ? `Осталось ${daysLeft} дн.`
            : deadlineStr}
        </div>

        {/* Количество откликов */}
        <div className="flex items-center gap-1 text-xs text-gray-400">
          <Users className="w-3.5 h-3.5" />
          {order.proposalCount} откл.
        </div>
      </div>

    </Link>
  )
}