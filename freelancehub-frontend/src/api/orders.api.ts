import api from './axios'
import type { OrderListItem, OrderDetail, CreateOrderData } from '../types/order.types'
import type { PagedResponse } from '../types/gig.types'

export interface GetOrdersParams {
    page?: number
    pageSize?: number
    categoryId?: string
    search?: string
    sortBy?: string
}

export const ordersApi = {
    /** GET /api/orders — публичный список открытых заказов */
    getAll: (params?: GetOrdersParams) =>
        api.get<PagedResponse<OrderListItem>>('/orders', { params }),

    /** GET /api/orders/{id} — детали заказа */
    getById: (id: string) =>
        api.get<OrderDetail>(`/orders/${id}`),

    /** GET /api/orders/my — мои заказы (для работодателя) */
    getMy: () =>
        api.get<OrderListItem[]>('/orders/my'),

    /** GET /api/orders/active — активные заказы (для студента-исполнителя) */
    getActive: () =>
        api.get<OrderListItem[]>('/orders/active'),

    /** POST /api/orders — создать заказ */
    create: (data: CreateOrderData) =>
        api.post<{ id: string; message: string }>('/orders', data),

    /** PUT /api/orders/{id}/complete — студент завершает работу */
    complete: (id: string) =>
        api.put<{ message: string }>(`/orders/${id}/complete`),

    /** PUT /api/orders/{id}/confirm — работодатель подтверждает завершение */
    confirm: (id: string) =>
        api.put<{ message: string }>(`/orders/${id}/confirm`),

    /** PUT /api/orders/{id}/cancel — отменить заказ */
    cancel: (id: string) =>
        api.put<{ message: string }>(`/orders/${id}/cancel`),
}