import api from './axios'
import type { Notification, UnreadCountResponse } from '../types/notification.types'

export const notificationsApi = {
  /** GET /api/notifications */
  getAll: () =>
    api.get<Notification[]>('/notifications'),

  /** GET /api/notifications/unread-count */
  getUnreadCount: () =>
    api.get<UnreadCountResponse>('/notifications/unread-count'),

  /** PUT /api/notifications/{id}/read */
  markRead: (id: string) =>
    api.put<{ message: string }>(`/notifications/${id}/read`),

  /** PUT /api/notifications/read-all */
  markAllRead: () =>
    api.put<{ message: string }>('/notifications/read-all'),

  /** DELETE /api/notifications/{id} */
  remove: (id: string) =>
    api.delete(`/notifications/${id}`),
}