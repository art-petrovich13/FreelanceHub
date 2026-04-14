import api from './axios'
import type {
    Review,
    CreateReviewData,
    CanReviewResponse,
} from '../types/review.types'

export const reviewsApi = {
    /**
     * GET /api/reviews/user/{userId}
     * Отзывы на конкретного пользователя.
     */
    getByUser: (userId: string) =>
        api.get<Review[]>(`/reviews/user/${userId}`),

    /**
     * GET /api/reviews/by/{reviewerId}
     * Отзывы которые оставил пользователь.
     */
    getByReviewer: (reviewerId: string) =>
        api.get<Review[]>(`/reviews/by/${reviewerId}`),

    /**
     * GET /api/reviews/can/{orderId}
     * Может ли текущий пользователь оставить отзыв?
     */
    canReview: (orderId: string) =>
        api.get<CanReviewResponse>(`/reviews/can/${orderId}`),

    /**
     * POST /api/reviews
     * Создать отзыв.
     */
    create: (data: CreateReviewData) =>
        api.post<{ id: string; message: string }>('/reviews', data),
}