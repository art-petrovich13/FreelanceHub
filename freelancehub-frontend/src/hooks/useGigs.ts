import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from '@tanstack/react-query'
import { gigsApi, type GetGigsParams } from '../api/gigs.api'
import { catalogApi } from '../api/catalog.api'
import toast from 'react-hot-toast'

// ── Список услуг ──────────────────────────────────────────────────────────
export function useGigs(params?: GetGigsParams) {
  return useQuery({
    // queryKey включает params — при изменении фильтров/страницы автоматически рефетч
    queryKey: ['gigs', params],
    queryFn:  () => gigsApi.getAll(params).then(r => r.data),
    staleTime: 1000 * 60,                // Кэш 1 минута
    placeholderData: keepPreviousData,   // Показывать старые данные пока грузятся новые
  })
}

// ── Одна услуга ───────────────────────────────────────────────────────────
export function useGig(id: string) {
  return useQuery({
    queryKey: ['gig', id],
    queryFn:  () => gigsApi.getById(id).then(r => r.data),
    enabled:  !!id,   // Не запускать если id пустой
  })
}

// ── Мои услуги ────────────────────────────────────────────────────────────
export function useMyGigs() {
  return useQuery({
    queryKey: ['gigs', 'my'],
    queryFn:  () => gigsApi.getMy().then(r => r.data),
  })
}

// ── Услуги студента (для профиля) ─────────────────────────────────────────
export function useStudentGigs(studentId: string) {
  return useQuery({
    queryKey: ['gigs', 'student', studentId],
    queryFn:  () => gigsApi.getByStudent(studentId).then(r => r.data),
    enabled:  !!studentId,
  })
}

// ── Создать услугу ────────────────────────────────────────────────────────
export function useCreateGig() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: gigsApi.create,
    onSuccess: () => {
      // Инвалидируем кэш списка — следующее обращение заново запросит данные
      queryClient.invalidateQueries({ queryKey: ['gigs'] })
      toast.success('Услуга создана и отправлена на модерацию!')
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message ?? 'Ошибка при создании услуги')
    },
  })
}

// ── Удалить услугу ────────────────────────────────────────────────────────
export function useDeleteGig() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => gigsApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gigs'] })
      toast.success('Услуга удалена')
    },
    onError: () => toast.error('Ошибка при удалении услуги'),
  })
}

// ── Категории (для форм) ──────────────────────────────────────────────────
export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn:  () => catalogApi.getCategories().then(r => r.data),
    staleTime: Infinity,   // Категории не меняются — кэшируем навсегда
  })
}

// ── Навыки (для форм) ─────────────────────────────────────────────────────
export function useSkills() {
  return useQuery({
    queryKey: ['skills'],
    queryFn:  () => catalogApi.getSkills().then(r => r.data),
    staleTime: Infinity,
  })
}