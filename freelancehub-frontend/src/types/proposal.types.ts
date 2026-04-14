export type ProposalStatus = 'Pending' | 'Accepted' | 'Rejected'

export interface Proposal {
  id: string
  orderId: string
  studentId: string
  studentName: string
  studentAvatar?: string
  studentRating: number
  studentReviews: number
  studentUniversity?: string
  coverLetter: string
  proposedPrice: number
  proposedDays: number
  status: ProposalStatus
  createdAt: string
}

export interface CreateProposalData {
  orderId: string
  coverLetter: string
  proposedPrice: number
  proposedDays: number
}