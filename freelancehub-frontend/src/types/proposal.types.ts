// Тип статуса отклика (совпадает с backend enum ProposalStatus)
export type ProposalStatus = 'Pending' | 'Accepted' | 'Rejected'

export interface Proposal {
  id: string
  orderId: string
  studentId: string
  studentName: string
  studentRating: number
  coverLetter: string
  proposedPrice: number
  proposedDays: number
  status: ProposalStatus
  createdAt: string
}

// Данные для подачи отклика
export interface CreateProposalData {
  orderId: string
  coverLetter: string
  proposedPrice: number
  proposedDays: number
}