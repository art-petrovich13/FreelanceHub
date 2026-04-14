import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { reviewsApi } from '../api/reviews.api'
import type { CreateReviewData } from '../types/review.types'
import { useAuthStore } from '../store/authStore'
import toast from 'react-hot-toast'

// Отзывы на пользователя
export function useUserReviews(userId: string) {
  return useQuery({
    queryKey: ['reviews', 'user', userId],
    queryFn:  () => reviewsApi.getByUser(userId).then(r => r.data),
    enabled:  !!userId,
  })
}

// Проверка возможности оставить отзыв
export function useCanReview(orderId: string) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  return useQuery({
    queryKey: ['reviews', 'can', orderId],
    queryFn:  () => reviewsApi.canReview(orderId).then(r => r.data),
    enabled:  !!orderId && isAuthenticated(),
  })
}

// Создание отзыва
export function useCreateReview() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateReviewData) => reviewsApi.create(data),
    onSuccess: (_, variables) => {
      // Инвалидируем отзывы получателя и can-review
      qc.invalidateQueries({ queryKey: ['reviews', 'user', variables.revieweeId] })
      qc.invalidateQueries({ queryKey: ['reviews', 'can', variables.orderId] })
      // Инвалидируем профиль — рейтинг изменился
      qc.invalidateQueries({ queryKey: ['profile', variables.revieweeId] })
      toast.success('Отзыв опубликован!')
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message ?? 'Ошибка при публикации отзыва')
    },
  })
}