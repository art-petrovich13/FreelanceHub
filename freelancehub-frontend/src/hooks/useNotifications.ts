import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { notificationsApi } from '../api/notifications.api'
import { useAuthStore } from '../store/authStore'
import toast from 'react-hot-toast'

// Все уведомления
export function useNotifications() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  return useQuery({
    queryKey: ['notifications'],
    queryFn:  () => notificationsApi.getAll().then(r => r.data),
    enabled:  isAuthenticated(),
    staleTime: 1000 * 30,
  })
}

// Количество непрочитанных — для бейджа, автообновление
export function useUnreadCount() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  return useQuery({
    queryKey: ['notifications', 'unread-count'],
    queryFn:  () => notificationsApi.getUnreadCount().then(r => r.data),
    enabled:  isAuthenticated(),
    // Автообновление каждые 30 секунд
    refetchInterval:      1000 * 30,
    refetchOnWindowFocus: true,
  })
}

// Прочитать одно уведомление
export function useMarkRead() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => notificationsApi.markRead(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['notifications'] })
    },
  })
}

// Прочитать все
export function useMarkAllRead() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: notificationsApi.markAllRead,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['notifications'] })
      toast.success('Все уведомления прочитаны')
    },
  })
}

// Удалить уведомление
export function useDeleteNotification() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => notificationsApi.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['notifications'] })
    },
  })
}