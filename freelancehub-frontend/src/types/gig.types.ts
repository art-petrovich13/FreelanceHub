// Тип статуса услуги (совпадает с backend enum GigStatus)
export type GigStatus = 'Pending' | 'Active' | 'Rejected' | 'Archived'

// Элемент в списке услуг (облегчённый DTO)
export interface GigListItem {
  id: string
  title: string
  price: number
  deliveryDays: number
  categoryName: string
  studentName: string
  studentRating: number
  skills: string[]
  status: GigStatus
  createdAt: string
}

// Полная информация об услуге (для страницы деталей)
export interface GigDetail extends GigListItem {
  description: string
  studentId: string
  categoryId: string
  updatedAt: string
}

// Данные для создания/редактирования услуги
export interface CreateGigData {
  title: string
  description: string
  categoryId: string
  price: number
  deliveryDays: number
  skillIds?: string[]
}