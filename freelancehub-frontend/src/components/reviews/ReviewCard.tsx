import { Link } from 'react-router-dom'
import type { Review } from '../../types/review.types'
import StarRating from '../ui/StarRating'
import Avatar from '../ui/Avatar'

interface ReviewCardProps {
  review: Review
}

export default function ReviewCard({ review }: ReviewCardProps) {
  // Форматируем дату
  const dateStr = new Date(review.createdAt).toLocaleDateString('ru-RU', {
    day: 'numeric', month: 'long', year: 'numeric',
  })

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">

      {/* Шапка: автор + дата */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <Avatar
            src={review.reviewerAvatar}
            name={review.reviewerName}
            size="sm"
          />
          <div>
            <Link
              to={`/profile/${review.reviewerId}`}
              className="text-sm font-semibold text-gray-900
                hover:text-blue-600 transition-colors"
            >
              {review.reviewerName}
            </Link>
            <p className="text-xs text-gray-400 mt-0.5">{dateStr}</p>
          </div>
        </div>

        {/* Оценка */}
        <StarRating value={review.rating} size="sm" />
      </div>

      {/* Ссылка на заказ */}
      <Link
        to={`/orders/${review.orderId}`}
        className="inline-block text-xs text-blue-500 hover:underline mb-2"
      >
        Заказ: {review.orderTitle}
      </Link>

      {/* Текст отзыва */}
      <p className="text-sm text-gray-700 leading-relaxed">
        {review.comment}
      </p>

    </div>
  )
}