// Тип статуса услуги
export type GigStatus = 'Pending' | 'Active' | 'Rejected' | 'Archived'

// Навык внутри услуги
export interface GigSkill {
  id: string
  name: string
}

// Элемент в списке услуг
export interface GigListItem {
  id: string
  title: string
  price: number
  deliveryDays: number
  categoryName: string
  studentId: string
  studentName: string
  studentRating: number
  status: GigStatus
  skills: string[]
  createdAt: string
}

// Полная информация об услуге
export interface GigDetail {
  id: string
  title: string
  description: string
  price: number
  deliveryDays: number
  status: GigStatus
  createdAt: string
  updatedAt: string
  categoryId: string
  categoryName: string
  studentId: string
  studentName: string
  studentAvatar?: string
  studentRating: number
  studentReviews: number
  studentBio?: string
  studentUniversity?: string
  skills: GigSkill[]
}

// Данные для создания услуги
export interface CreateGigData {
  title: string
  description: string
  categoryId: string
  price: number
  deliveryDays: number
  skillIds?: string[]
}

export interface UpdateGigData extends CreateGigData {}

export interface PagedResponse<T> {
  items: T[]
  totalCount: number
  page: number
  pageSize: number
  totalPages: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}