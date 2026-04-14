import api from './axios'
import type { UserProfile, MeProfile, UpdateProfileData } from '../types/user.types'

export const usersApi = {
  /**
   * GET /api/users/me
   * Мой расширенный профиль (навыки, рейтинг, роль).
   * Требует авторизации.
   */
  getMe: () =>
    api.get<MeProfile>('/users/me'),

  /**
   * GET /api/users/{id}
   * Публичный профиль любого пользователя.
   */
  getById: (id: string) =>
    api.get<UserProfile>(`/users/${id}`),

  /**
   * PUT /api/users/me
   * Обновить свой профиль.
   */
  updateMe: (data: UpdateProfileData) =>
    api.put<{ message: string }>('/users/me', data),
}