// Публичный профиль пользователя (для просмотра чужого профиля)
export interface UserProfile {
  id: string
  email: string
  firstName: string
  lastName: string
  university?: string
  specialty?: string
  bio?: string
  avatarUrl?: string
  rating: number
  reviewCount: number
  isBlocked: boolean
  createdAt: string
  role?: string
}

// Данные для обновления своего профиля
export interface UpdateProfileData {
  firstName: string
  lastName: string
  university?: string
  specialty?: string
  bio?: string
  avatarUrl?: string
  skillIds?: string[]
}