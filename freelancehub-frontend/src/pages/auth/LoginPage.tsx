import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { authApi } from '../../api/auth.api'
import { useAuthStore } from '../../store/authStore'

// ── Схема валидации ────────────────────────────────────────────────────────
const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email обязателен')
    .email('Введите корректный email'),
  password: z
    .string()
    .min(6, 'Пароль должен содержать минимум 6 символов'),
})

// Тип данных формы автоматически выводится из схемы
type LoginForm = z.infer<typeof loginSchema>

// ── Компонент ──────────────────────────────────────────────────────────────
export default function LoginPage() {
  const navigate  = useNavigate()
  const location  = useLocation()
  const setAuth   = useAuthStore((s) => s.setAuth)
  const [serverError, setServerError] = useState<string | null>(null)

  // from — страница с которой пользователя перенаправили на /login
  // После входа возвращаем его туда
  const from = (location.state as any)?.from?.pathname ?? '/'

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginForm) => {
    setServerError(null)
    try {
      const res = await authApi.login(data)
      const { accessToken, userId, email, firstName, lastName, role } = res.data

      // Сохраняем токен и данные пользователя в Zustand (и localStorage)
      setAuth({ id: userId, email, firstName, lastName, role }, accessToken)

      toast.success(`Добро пожаловать, ${firstName}!`)

      // Редиректим на страницу откуда пришли или на главную
      navigate(from, { replace: true })
    } catch (err: any) {
      const message =
        err.response?.data?.message ?? 'Ошибка входа. Попробуйте ещё раз.'
      setServerError(message)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white rounded-2xl shadow-md w-full max-w-md p-8">

        {/* Заголовок */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">FreeLanceHub</h1>
          <p className="text-gray-500 mt-2 text-sm">Войдите в свой аккаунт</p>
        </div>

        {/* Серверная ошибка */}
        {serverError && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
            {serverError}
          </div>
        )}

        {/* Форма */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              {...register('email')}
              type="email"
              placeholder="ivan@example.com"
              autoComplete="email"
              className={`w-full border rounded-lg px-3 py-2.5 text-sm outline-none transition
                focus:ring-2 focus:ring-blue-500 focus:border-transparent
                ${errors.email ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Пароль */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Пароль
            </label>
            <input
              {...register('password')}
              type="password"
              placeholder="••••••"
              autoComplete="current-password"
              className={`w-full border rounded-lg px-3 py-2.5 text-sm outline-none transition
                focus:ring-2 focus:ring-blue-500 focus:border-transparent
                ${errors.password ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
            )}
          </div>

          {/* Кнопка входа */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60
              disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-lg
              transition-colors duration-200 text-sm"
          >
            {isSubmitting ? 'Входим...' : 'Войти'}
          </button>
        </form>

        {/* Ссылка на регистрацию */}
        <p className="mt-6 text-center text-sm text-gray-500">
          Нет аккаунта?{' '}
          <Link
            to="/register"
            className="text-blue-600 font-medium hover:underline"
          >
            Зарегистрироваться
          </Link>
        </p>

      </div>
    </div>
  )
}