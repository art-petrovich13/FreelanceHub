import type { GigListItem } from './gig.types'
import type { OrderListItem } from './order.types'
import type { Proposal } from './proposal.types'

// Отклик с заголовком заказа (для виджета Employer)
export interface RecentProposalWithOrder {
  proposalId:    string
  orderTitle:    string
  orderId:       string
  studentName:   string
  proposedPrice: number
  proposedDays:  number
  createdAt:     string
}

// Дашборд студента
export interface StudentDashboardData {
  totalGigs:           number
  activeGigs:          number
  pendingGigs:         number
  totalProposals:      number
  acceptedProposals:   number
  activeOrders:        number
  completedOrders:     number
  unreadNotifications: number
  totalEarned:         number
  recentGigs:          GigListItem[]
  activeOrdersList:    OrderListItem[]
  recentProposals:     Proposal[]
}

// Дашборд работодателя
export interface EmployerDashboardData {
  totalOrders:              number
  openOrders:               number
  inProgressOrders:         number
  completedOrders:          number
  totalProposalsReceived:   number
  pendingProposals:         number
  unreadNotifications:      number
  totalSpent:               number
  openOrdersList:           OrderListItem[]
  inProgressOrdersList:     OrderListItem[]
  recentPendingProposals:   RecentProposalWithOrder[]
}