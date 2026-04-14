export interface Notification {
  id:        string
  title:     string
  message:   string
  isRead:    boolean
  createdAt: string
}

export interface UnreadCountResponse {
  count: number
}