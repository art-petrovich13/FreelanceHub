import api from './axios'
import type {
  AdminUser,
  AdminGig,
  AdminOrder,
  PlatformStats,
  AdminPagedResponse,
} from '../types/admin.types'

export interface AdminUsersParams {
  page?:     number
  pageSize?: number
  search?:   string
  role?:     string
  blocked?:  boolean
}

export interface AdminGigsParams {
  page?:     number
  pageSize?: number
  status?:   string
  search?:   string
}

export interface AdminOrdersParams {
  page?:     number
  pageSize?: number
  status?:   string
  search?:   string
}

export const adminApi = {
  /** GET /api/admin/stats */
  getStats: () =>
    api.get<PlatformStats>('/admin/stats'),

  /** GET /api/admin/users */
  getUsers: (params?: AdminUsersParams) =>
    api.get<AdminPagedResponse<AdminUser>>('/admin/users', { params }),

  /** PUT /api/admin/users/{id}/block */
  setBlock: (id: string, isBlocked: boolean) =>
    api.put<{ message: string }>(`/admin/users/${id}/block`, isBlocked, {
      headers: { 'Content-Type': 'application/json' },
    }),

  /** PUT /api/admin/users/{id}/role */
  changeRole: (id: string, newRole: string) =>
    api.put<{ message: string }>(`/admin/users/${id}/role`, { newRole }),

  /** DELETE /api/admin/users/{id} */
  deleteUser: (id: string) =>
    api.delete<{ message: string }>(`/admin/users/${id}`),

  /** GET /api/admin/gigs */
  getGigs: (params?: AdminGigsParams) =>
    api.get<AdminPagedResponse<AdminGig>>('/admin/gigs', { params }),

  /** PUT /api/admin/gigs/{id}/status */
  changeGigStatus: (id: string, action: string, reason?: string) =>
    api.put<{ message: string }>(`/admin/gigs/${id}/status`, { action, reason }),

  /** GET /api/admin/orders */
  getOrders: (params?: AdminOrdersParams) =>
    api.get<AdminPagedResponse<AdminOrder>>('/admin/orders', { params }),

  /** PUT /api/admin/orders/{id}/status */
  changeOrderStatus: (id: string, action: string) =>
    api.put<{ message: string }>(`/admin/orders/${id}/status`, JSON.stringify(action), {
      headers: { 'Content-Type': 'application/json' },
    }),

  /** DELETE /api/admin/reviews/{id} */
  deleteReview: (id: string) =>
    api.delete<{ message: string }>(`/admin/reviews/${id}`),
}