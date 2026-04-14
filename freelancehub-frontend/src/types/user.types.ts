// Навык пользователя
export interface UserSkill {
  id: string
  name: string
}

// Полный публичный профиль пользователя (для ProfilePage)
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
  role: string
  skills: UserSkill[]
}

// Мой профиль (для EditProfilePage и authStore дополнения)
export interface MeProfile {
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
  role: string
  skills: UserSkill[]
}

// Данные для обновления профиля
export interface UpdateProfileData {
  firstName: string
  lastName: string
  university?: string
  specialty?: string
  bio?: string
  avatarUrl?: string
  skillIds?: string[]
}