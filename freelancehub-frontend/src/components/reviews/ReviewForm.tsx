import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useCanReview, useCreateReview } from '../../hooks/useReviews'
import StarRating from '../ui/StarRating'

const reviewSchema = z.object({
  comment: z
    .string()
    .min(10, 'Минимум 10 символов')
    .max(1000, 'Максимум 1000 символов'),
})

type ReviewFormData = z.infer<typeof reviewSchema>

interface ReviewFormProps {
  orderId: string
}

export default function ReviewForm({ orderId }: ReviewFormProps) {
  const [rating, setRating]   = useState(0)
  const [ratingError, setRatingError] = useState<string | null>(null)

  const { data: canReviewData, isLoading } = useCanReview(orderId)
  const createReview = useCreateReview()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ReviewFormData>({ resolver: zodResolver(reviewSchema) })

  // Компонент не рендерится если нельзя оставить отзыв
  if (isLoading) return null
  if (!canReviewData?.canReview || !canReviewData.targetUserId) return null

  const onSubmit = async (data: ReviewFormData) => {
    if (rating === 0) {
      setRatingError('Пожалуйста, поставьте оценку')
      return
    }
    setRatingError(null)

    try {
      await createReview.mutateAsync({
        orderId,
        revieweeId: canReviewData.targetUserId!,
        rating,
        comment: data.comment,
      })
      reset()
      setRating(0)
    } catch {
      // ошибка обработана в хуке
    }
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-1">
        Оставить отзыв
      </h2>
      <p className="text-sm text-gray-500 mb-5">
        Поделитесь вашим опытом работы
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

        {/* Выбор рейтинга */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Оценка <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center gap-3">
            <StarRating
              value={rating}
              size="lg"
              onChange={(v) => { setRating(v); setRatingError(null) }}
            />
            {rating > 0 && (
              <span className="text-sm font-medium text-gray-700">
                {rating} из 5
              </span>
            )}
          </div>
          {ratingError && (
            <p className="text-red-500 text-xs mt-1">{ratingError}</p>
          )}
        </div>

        {/* Текст отзыва */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Комментарий <span className="text-red-500">*</span>
          </label>
          <textarea
            {...register('comment')}
            rows={4}
            placeholder="Расскажите о вашем опыте сотрудничества..."
            className={`w-full border rounded-lg px-3 py-2.5 text-sm outline-none
              transition focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none
              ${errors.comment ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}
          />
          {errors.comment && (
            <p className="text-red-500 text-xs mt-1">{errors.comment.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={createReview.isPending}
          className="w-full py-3 bg-blue-600 text-white rounded-xl text-sm
            font-semibold hover:bg-blue-700 disabled:opacity-60
            disabled:cursor-not-allowed transition-colors"
        >
          {createReview.isPending ? 'Публикуем...' : 'Опубликовать отзыв'}
        </button>

      </form>
    </div>
  )
}