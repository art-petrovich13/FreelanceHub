import api from './axios'
import type {
  GigListItem,
  GigDetail,
  CreateGigData,
  UpdateGigData,
  PagedResponse,
} from '../types/gig.types'

// Параметры для получения списка услуг
export interface GetGigsParams {
  page?:       number
  pageSize?:   number
  categoryId?: string
  search?:     string
  sortBy?:     string
}

export const gigsApi = {
  /**
   * GET /api/gigs
   * Список активных услуг с пагинацией и фильтрами.
   */
  getAll: (params?: GetGigsParams) =>
    api.get<PagedResponse<GigListItem>>('/gigs', { params }),

  /**
   * GET /api/gigs/{id}
   * Полная информация об услуге.
   */
  getById: (id: string) =>
    api.get<GigDetail>(`/gigs/${id}`),

  /**
   * GET /api/gigs/my
   * Мои услуги (все статусы). Требует авторизации.
   */
  getMy: () =>
    api.get<GigListItem[]>('/gigs/my'),

  /**
   * GET /api/gigs/student/{studentId}
   * Активные услуги конкретного студента (для его профиля).
   */
  getByStudent: (studentId: string) =>
    api.get<GigListItem[]>(`/gigs/student/${studentId}`),

  /**
   * POST /api/gigs
   * Создать новую услугу. Только для студентов.
   */
  create: (data: CreateGigData) =>
    api.post<{ id: string; message: string }>('/gigs', data),

  /**
   * PUT /api/gigs/{id}
   * Обновить услугу.
   */
  update: (id: string, data: UpdateGigData) =>
    api.put(`/gigs/${id}`, data),

  /**
   * DELETE /api/gigs/{id}
   * Архивировать услугу.
   */
  remove: (id: string) =>
    api.delete(`/gigs/${id}`),
}