// Пользователь в Admin-таблице
export interface AdminUser {
  id:          string
  email:       string
  firstName:   string
  lastName:    string
  university?: string
  rating:      number
  reviewCount: number
  isBlocked:   boolean
  createdAt:   string
  role:        string
  gigsCount:   number
  ordersCount: number
}

// Услуга в Admin-таблице
export interface AdminGig {
  id:           string
  title:        string
  price:        number
  deliveryDays: number
  status:       string
  categoryName: string
  studentId:    string
  studentName:  string
  studentEmail: string
  createdAt:    string
  updatedAt:    string
}

// Заказ в Admin-таблице
export interface AdminOrder {
  id:                  string
  title:               string
  budget:              number
  status:              string
  categoryName:        string
  employerId:          string
  employerName:        string
  employerEmail:       string
  selectedStudentName: string | null
  proposalCount:       number
  createdAt:           string
  deadline:            string
}

// Статистика платформы
export interface PlatformStats {
  totalUsers:       number
  totalStudents:    number
  totalEmployers:   number
  blockedUsers:     number
  totalGigs:        number
  activeGigs:       number
  pendingGigs:      number
  rejectedGigs:     number
  totalOrders:      number
  openOrders:       number
  inProgressOrders: number
  completedOrders:  number
  totalProposals:   number
  totalReviews:     number
  newUsersThisWeek:  number
  newOrdersThisWeek: number
  newGigsThisWeek:   number
}

// Пагинированный ответ для Admin
export interface AdminPagedResponse<T> {
  items:      T[]
  totalCount: number
  page:       number
  pageSize:   number
  totalPages: number
}