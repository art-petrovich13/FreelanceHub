import api from './axios'
import type { AuthResponse, LoginData, RegisterData } from '../types/auth.types'

/**
 * Функции для работы с Auth API.
 * Каждая функция возвращает Promise с типизированными данными.
 * Axios автоматически бросает исключение при статусах 4xx/5xx.
 */
export const authApi = {
  /**
   * POST /api/auth/register
   * Регистрация нового пользователя.
   * @returns AuthResponse с токеном и данными пользователя
   */
  register: (data: RegisterData) =>
    api.post<AuthResponse>('/auth/register', data),

  /**
   * POST /api/auth/login
   * Вход в систему.
   * @returns AuthResponse с токеном и данными пользователя
   */
  login: (data: LoginData) =>
    api.post<AuthResponse>('/auth/login', data),

  /**
   * GET /api/auth/me
   * Получить данные текущего авторизованного пользователя.
   * Требует Authorization: Bearer <token> заголовок (добавляет Axios interceptor).
   */
  me: () =>
    api.get<{
      id: string
      email: string
      role: string
      firstName: string
      lastName: string
    }>('/auth/me'),
}