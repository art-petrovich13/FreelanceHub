// Тип статуса заказа (совпадает с backend enum OrderStatus)
export type OrderStatus = 'Open' | 'InProgress' | 'Completed' | 'Cancelled' | 'Rejected'

// Элемент в списке заказов
export interface OrderListItem {
  id: string
  title: string
  budget: number
  deadline: string
  categoryName: string
  employerName: string
  status: OrderStatus
  skillsRequired: string[]
  createdAt: string
}

// Полная информация о заказе
export interface OrderDetail extends OrderListItem {
  description: string
  employerId: string
  categoryId: string
  selectedStudentId?: string
  updatedAt: string
}

// Данные для создания заказа
export interface CreateOrderData {
  title: string
  description: string
  categoryId: string
  budget: number
  deadline: string  // ISO date string: "2024-12-31"
  skillIds?: string[]
}