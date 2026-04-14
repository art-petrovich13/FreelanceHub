export interface Review {
  id: string
  orderId: string
  orderTitle: string
  reviewerId: string
  reviewerName: string
  reviewerAvatar?: string
  revieweeId: string
  rating: number
  comment: string
  createdAt: string
}

export interface CreateReviewData {
  orderId: string
  revieweeId: string
  rating: number
  comment: string
}

// Ответ на запрос "можно ли оставить отзыв"
export interface CanReviewResponse {
  canReview: boolean
  targetUserId: string | null
}