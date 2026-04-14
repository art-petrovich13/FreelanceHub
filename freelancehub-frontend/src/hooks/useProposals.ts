import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { proposalsApi } from '../api/proposals.api'
import type { CreateProposalData } from '../types/proposal.types'
import toast from 'react-hot-toast'

export function useOrderProposals(orderId: string, enabled: boolean) {
  return useQuery({
    queryKey: ['proposals', 'order', orderId],
    queryFn:  () => proposalsApi.getByOrder(orderId).then(r => r.data),
    enabled:  !!orderId && enabled,
  })
}

export function useMyProposals() {
  return useQuery({
    queryKey: ['proposals', 'my'],
    queryFn:  () => proposalsApi.getMy().then(r => r.data),
  })
}

export function useCreateProposal() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateProposalData) => proposalsApi.create(data),
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: ['proposals', 'order', variables.orderId] })
      qc.invalidateQueries({ queryKey: ['proposals', 'my'] })
      toast.success('Отклик успешно подан!')
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message ?? 'Ошибка при подаче отклика')
    },
  })
}

export function useAcceptProposal() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => proposalsApi.accept(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['proposals'] })
      qc.invalidateQueries({ queryKey: ['orders'] })
      qc.invalidateQueries({ queryKey: ['order'] })
      toast.success('Исполнитель выбран! Заказ в работе.')
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message ?? 'Ошибка')
    },
  })
}

export function useRejectProposal() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => proposalsApi.reject(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['proposals'] })
      toast.success('Отклик отклонён')
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message ?? 'Ошибка')
    },
  })
}