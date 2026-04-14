import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  adminApi,
  type AdminUsersParams,
  type AdminGigsParams,
  type AdminOrdersParams,
} from '../api/admin.api'
import toast from 'react-hot-toast'

export function useAdminStats() {
  return useQuery({
    queryKey: ['admin', 'stats'],
    queryFn:  () => adminApi.getStats().then(r => r.data),
    staleTime: 1000 * 30,   // Обновляем каждые 30 секунд
  })
}

export function useAdminUsers(params?: AdminUsersParams) {
  return useQuery({
    queryKey: ['admin', 'users', params],
    queryFn:  () => adminApi.getUsers(params).then(r => r.data),
  })
}

export function useSetBlock() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, isBlocked }: { id: string; isBlocked: boolean }) =>
      adminApi.setBlock(id, isBlocked),
    onSuccess: (_, { isBlocked }) => {
      qc.invalidateQueries({ queryKey: ['admin', 'users'] })
      toast.success(isBlocked ? 'Пользователь заблокирован' : 'Пользователь разблокирован')
    },
    onError: (err: any) =>
      toast.error(err.response?.data?.message ?? 'Ошибка'),
  })
}

export function useChangeRole() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, newRole }: { id: string; newRole: string }) =>
      adminApi.changeRole(id, newRole),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'users'] })
      toast.success('Роль изменена')
    },
    onError: (err: any) =>
      toast.error(err.response?.data?.message ?? 'Ошибка'),
  })
}

export function useDeleteUser() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => adminApi.deleteUser(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'users'] })
      qc.invalidateQueries({ queryKey: ['admin', 'stats'] })
      toast.success('Пользователь удалён')
    },
    onError: (err: any) =>
      toast.error(err.response?.data?.message ?? 'Ошибка'),
  })
}

export function useAdminGigs(params?: AdminGigsParams) {
  return useQuery({
    queryKey: ['admin', 'gigs', params],
    queryFn:  () => adminApi.getGigs(params).then(r => r.data),
  })
}

export function useChangeGigStatus() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, action, reason }: {
      id: string; action: string; reason?: string
    }) => adminApi.changeGigStatus(id, action, reason),
    onSuccess: (_, { action }) => {
      qc.invalidateQueries({ queryKey: ['admin', 'gigs'] })
      qc.invalidateQueries({ queryKey: ['admin', 'stats'] })
      qc.invalidateQueries({ queryKey: ['gigs'] })
      const labels: Record<string, string> = {
        approve: 'Услуга одобрена ✅',
        reject:  'Услуга отклонена',
        archive: 'Услуга архивирована',
      }
      toast.success(labels[action] ?? 'Статус изменён')
    },
    onError: (err: any) =>
      toast.error(err.response?.data?.message ?? 'Ошибка'),
  })
}

export function useAdminOrders(params?: AdminOrdersParams) {
  return useQuery({
    queryKey: ['admin', 'orders', params],
    queryFn:  () => adminApi.getOrders(params).then(r => r.data),
  })
}

export function useChangeOrderStatus() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, action }: { id: string; action: string }) =>
      adminApi.changeOrderStatus(id, action),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'orders'] })
      qc.invalidateQueries({ queryKey: ['admin', 'stats'] })
      toast.success('Статус заказа изменён')
    },
    onError: (err: any) =>
      toast.error(err.response?.data?.message ?? 'Ошибка'),
  })
}