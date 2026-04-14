import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { usersApi } from '../api/users.api'
import type { UpdateProfileData } from '../types/user.types'
import { useAuthStore } from '../store/authStore'
import toast from 'react-hot-toast'

// Мой профиль (авторизован)
export function useMyProfile() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  return useQuery({
    queryKey: ['profile', 'me'],
    queryFn:  () => usersApi.getMe().then(r => r.data),
    enabled:  isAuthenticated(),
    staleTime: 1000 * 60 * 5,   // Кэш 5 минут
  })
}

// Публичный профиль пользователя по ID
export function useUserProfile(id: string) {
  return useQuery({
    queryKey: ['profile', id],
    queryFn:  () => usersApi.getById(id).then(r => r.data),
    enabled:  !!id,
  })
}

// Обновление своего профиля
export function useUpdateProfile() {
  const qc      = useQueryClient()
  const setAuth = useAuthStore((s) => s.setAuth)
  const user    = useAuthStore((s) => s.user)
  const token   = useAuthStore((s) => s.token)

  return useMutation({
    mutationFn: (data: UpdateProfileData) => usersApi.updateMe(data),
    onSuccess: async () => {
      // Инвалидируем кэш профиля
      await qc.invalidateQueries({ queryKey: ['profile', 'me'] })
      // Обновляем имя в Zustand если изменилось
      const updated = await usersApi.getMe()
      if (user && token) {
        setAuth(
          {
            ...user,
            firstName: updated.data.firstName,
            lastName:  updated.data.lastName,
          },
          token
        )
      }
      toast.success('Профиль успешно обновлён!')
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message ?? 'Ошибка при обновлении профиля')
    },
  })
}