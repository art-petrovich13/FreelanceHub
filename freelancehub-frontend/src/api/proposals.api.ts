import api from './axios'
import type { Proposal, CreateProposalData } from '../types/proposal.types'

export const proposalsApi = {
  /** GET /api/proposals/order/{orderId} — список откликов на заказ (для работодателя) */
  getByOrder: (orderId: string) =>
    api.get<Proposal[]>(`/proposals/order/${orderId}`),

  /** GET /api/proposals/my — мои отклики (для студента) */
  getMy: () =>
    api.get<Proposal[]>('/proposals/my'),

  /** POST /api/proposals — подать отклик */
  create: (data: CreateProposalData) =>
    api.post<{ id: string; message: string }>('/proposals', data),

  /** PUT /api/proposals/{id}/accept — принять отклик */
  accept: (id: string) =>
    api.put<{ message: string }>(`/proposals/${id}/accept`),

  /** PUT /api/proposals/{id}/reject — отклонить отклик */
  reject: (id: string) =>
    api.put<{ message: string }>(`/proposals/${id}/reject`),
}