import type { PagedResponse } from './gig.types'

export type OrderStatus =
  | 'Open'
  | 'InProgress'
  | 'Completed'
  | 'Cancelled'
  | 'Rejected'

// Навык требуемый в заказе
export interface OrderSkill {
  id: string
  name: string
}

// Элемент в списке заказов
export interface OrderListItem {
  id: string
  title: string
  budget: number
  deadline: string       // DateOnly из бэкенда → строка "2025-03-01"
  categoryName: string
  employerId: string
  employerName: string
  status: OrderStatus
  proposalCount: number
  skills: string[]
  createdAt: string
}

// Полная информация о заказе
export interface OrderDetail {
  id: string
  title: string
  description: string
  budget: number
  deadline: string
  status: OrderStatus
  createdAt: string
  updatedAt: string
  categoryId: string
  categoryName: string
  employerId: string
  employerName: string
  employerAvatar?: string
  selectedStudentId?: string
  selectedStudentName?: string
  skills: OrderSkill[]
  proposalCount: number
}

// Данные для создания заказа
export interface CreateOrderData {
  title: string
  description: string
  categoryId: string
  budget: number
  deadline: string     // ISO date string: "2025-03-01"
  skillIds?: string[]
}

// Реэкспорт PagedResponse если нужен
export type { PagedResponse }