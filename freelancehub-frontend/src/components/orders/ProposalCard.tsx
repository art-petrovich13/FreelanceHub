import { Star, Clock, DollarSign } from 'lucide-react'
import type { Proposal } from '../../types/proposal.types'
import Badge from '../ui/Badge'
import { Link } from 'react-router-dom'

interface ProposalCardProps {
  proposal: Proposal
  isEmployer: boolean              // Работодатель видит кнопки принятия
  onAccept?: (id: string) => void
  onReject?: (id: string) => void
  isAccepting?: boolean
  isRejecting?: boolean
}

function statusBadge(status: string) {
  const map: Record<string, 'yellow' | 'green' | 'red'> = {
    Pending:  'yellow',
    Accepted: 'green',
    Rejected: 'red',
  }
  const labels: Record<string, string> = {
    Pending:  'На рассмотрении',
    Accepted: 'Принят',
    Rejected: 'Отклонён',
  }
  return { variant: map[status] ?? 'gray', label: labels[status] ?? status }
}

export default function ProposalCard({
  proposal,
  isEmployer,
  onAccept,
  onReject,
  isAccepting,
  isRejecting,
}: ProposalCardProps) {
  const { variant, label } = statusBadge(proposal.status)

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">

      {/* Шапка: информация о студенте */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          {/* Аватар */}
          <Link to={`/profile/${proposal.studentId}`}>
            <div className="w-11 h-11 rounded-full bg-blue-100 flex items-center
              justify-center text-blue-600 font-bold shrink-0 hover:opacity-80 transition-opacity">
              {proposal.studentAvatar
                ? <img src={proposal.studentAvatar} alt={proposal.studentName}
                    className="w-11 h-11 rounded-full object-cover" />
                : proposal.studentName.split(' ').map(n => n[0]).join('').slice(0, 2)
              }
            </div>
          </Link>

          {/* Имя и инфо */}
          <div>
            <Link
              to={`/profile/${proposal.studentId}`}
              className="font-semibold text-gray-900 hover:text-blue-600 transition-colors text-sm"
            >
              {proposal.studentName}
            </Link>
            {proposal.studentUniversity && (
              <p className="text-xs text-gray-500">{proposal.studentUniversity}</p>
            )}
            <div className="flex items-center gap-1 mt-0.5">
              <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
              <span className="text-xs text-gray-600">
                {proposal.studentRating > 0
                  ? proposal.studentRating.toFixed(1)
                  : 'Нет оценок'}
              </span>
              {proposal.studentReviews > 0 && (
                <span className="text-xs text-gray-400">
                  ({proposal.studentReviews})
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Статус отклика */}
        <Badge variant={variant as any}>{label}</Badge>
      </div>

      {/* Предложение по цене и срокам */}
      <div className="flex items-center gap-4 mb-4 p-3 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-1.5">
          <DollarSign className="w-4 h-4 text-green-500" />
          <div>
            <p className="text-xs text-gray-500">Предложенная цена</p>
            <p className="font-semibold text-gray-900 text-sm">
              {proposal.proposedPrice.toLocaleString('ru-RU')} ₽
            </p>
          </div>
        </div>
        <div className="w-px h-8 bg-gray-200" />
        <div className="flex items-center gap-1.5">
          <Clock className="w-4 h-4 text-blue-500" />
          <div>
            <p className="text-xs text-gray-500">Срок выполнения</p>
            <p className="font-semibold text-gray-900 text-sm">
              {proposal.proposedDays} дней
            </p>
          </div>
        </div>
      </div>

      {/* Сопроводительное письмо */}
      <div className="mb-4">
        <p className="text-xs font-medium text-gray-500 mb-1">Сопроводительное письмо</p>
        <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap line-clamp-4">
          {proposal.coverLetter}
        </p>
      </div>

      {/* Кнопки (только для работодателя и только для Pending откликов) */}
      {isEmployer && proposal.status === 'Pending' && (
        <div className="flex gap-2 pt-3 border-t border-gray-100">
          <button
            onClick={() => onAccept?.(proposal.id)}
            disabled={isAccepting}
            className="flex-1 py-2 bg-green-600 text-white rounded-lg text-sm
              font-semibold hover:bg-green-700 disabled:opacity-60
              disabled:cursor-not-allowed transition-colors"
          >
            {isAccepting ? 'Принимаем...' : '✓ Принять'}
          </button>
          <button
            onClick={() => onReject?.(proposal.id)}
            disabled={isRejecting}
            className="flex-1 py-2 bg-white text-gray-700 border border-gray-300
              rounded-lg text-sm font-semibold hover:bg-gray-50
              disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
          >
            {isRejecting ? 'Отклоняем...' : '✕ Отклонить'}
          </button>
        </div>
      )}

    </div>
  )
}