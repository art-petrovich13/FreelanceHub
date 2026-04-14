import { Link } from 'react-router-dom'
import { Star, Clock } from 'lucide-react'
import type { GigListItem } from '../../types/gig.types'
import Badge from '../ui/Badge'

interface GigCardProps {
  gig: GigListItem
}

export default function GigCard({ gig }: GigCardProps) {
  return (
    <Link
      to={`/gigs/${gig.id}`}
      className="block bg-white rounded-xl border border-gray-200 p-5
        hover:shadow-md hover:border-blue-200 transition-all duration-200 group"
    >
      {/* Категория */}
      <div className="flex items-center gap-2 mb-3">
        <Badge variant="blue">{gig.categoryName}</Badge>
      </div>

      {/* Заголовок */}
      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2
        group-hover:text-blue-600 transition-colors leading-snug">
        {gig.title}
      </h3>

      {/* Имя студента */}
      <p className="text-sm text-gray-500 mb-3">{gig.studentName}</p>

      {/* Рейтинг */}
      <div className="flex items-center gap-1 mb-3">
        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
        <span className="text-sm font-medium text-gray-700">
          {gig.studentRating > 0
            ? gig.studentRating.toFixed(1)
            : 'Нет оценок'}
        </span>
      </div>

      {/* Навыки */}
      {gig.skills.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-4">
          {gig.skills.slice(0, 3).map((skill) => (
            <span
              key={skill}
              className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md"
            >
              {skill}
            </span>
          ))}
          {gig.skills.length > 3 && (
            <span className="text-xs text-gray-400 px-1 py-0.5">
              +{gig.skills.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Нижняя строка: срок и цена */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <div className="flex items-center gap-1 text-sm text-gray-500">
          <Clock className="w-3.5 h-3.5" />
          <span>{gig.deliveryDays} дн.</span>
        </div>
        <div className="text-right">
          <span className="text-xs text-gray-400">от </span>
          <span className="font-bold text-blue-600">
            {gig.price.toLocaleString('ru-RU')} ₽
          </span>
        </div>
      </div>

    </Link>
  )
}