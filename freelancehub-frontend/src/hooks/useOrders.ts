import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from '@tanstack/react-query'
import { ordersApi, type GetOrdersParams } from '../api/orders.api'
import toast from 'react-hot-toast'

export function useOrders(params?: GetOrdersParams) {
  return useQuery({
    queryKey: ['orders', params],
    queryFn:  () => ordersApi.getAll(params).then(r => r.data),
    staleTime: 1000 * 60,
    placeholderData: keepPreviousData,
  })
}

export function useOrder(id: string) {
  return useQuery({
    queryKey: ['order', id],
    queryFn:  () => ordersApi.getById(id).then(r => r.data),
    enabled:  !!id,
  })
}

export function useMyOrders() {
  return useQuery({
    queryKey: ['orders', 'my'],
    queryFn:  () => ordersApi.getMy().then(r => r.data),
  })
}

export function useActiveOrders() {
  return useQuery({
    queryKey: ['orders', 'active'],
    queryFn:  () => ordersApi.getActive().then(r => r.data),
  })
}

export function useCreateOrder() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ordersApi.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['orders'] })
      toast.success('Заказ опубликован!')
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message ?? 'Ошибка при создании заказа')
    },
  })
}

export function useCompleteOrder() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => ordersApi.complete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['orders'] })
      qc.invalidateQueries({ queryKey: ['order'] })
      toast.success('Работа отмечена как выполненная!')
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message ?? 'Ошибка')
    },
  })
}

export function useConfirmOrder() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => ordersApi.confirm(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['orders'] })
      qc.invalidateQueries({ queryKey: ['order'] })
      toast.success('Завершение подтверждено!')
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message ?? 'Ошибка')
    },
  })
}

export function useCancelOrder() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => ordersApi.cancel(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['orders'] })
      toast.success('Заказ отменён')
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message ?? 'Ошибка')
    },
  })
}