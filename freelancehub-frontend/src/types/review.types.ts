export interface Review {
  id: string
  orderId: string
  reviewerId: string
  reviewerName: string
  revieweeId: string
  rating: number
  comment: string
  createdAt: string
}

// Данные для создания отзыва
export interface CreateReviewData {
  orderId: string
  revieweeId: string
  rating: number
  comment: string
}