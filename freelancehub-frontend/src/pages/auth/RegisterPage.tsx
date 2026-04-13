import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { authApi } from '../../api/auth.api'
import { useAuthStore } from '../../store/authStore'

// ── Схема валидации ────────────────────────────────────────────────────────
const registerSchema = z.object({
  email: z
    .string()
    .min(1, 'Email обязателен')
    .email('Введите корректный email'),

  password: z
    .string()
    .min(6, 'Пароль должен содержать минимум 6 символов')
    .regex(/\d/, 'Пароль должен содержать хотя бы одну цифру'),

  confirmPassword: z.string().min(1, 'Подтвердите пароль'),

  firstName: z
    .string()
    .min(1, 'Имя обязательно')
    .max(100, 'Имя не может быть длиннее 100 символов'),

  lastName: z
    .string()
    .min(1, 'Фамилия обязательна')
    .max(100, 'Фамилия не может быть длиннее 100 символов'),

  role: z.enum(['Student', 'Employer'] as const, {
    message: 'Выберите роль',
  }),

  // Необязательные поля (только для студентов)
  university: z.string().max(200).optional(),
  specialty: z.string().max(200).optional(),
})
  // Кросс-поле валидация: confirmPassword должен совпадать с password
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Пароли не совпадают',
    path: ['confirmPassword'],
  })

type RegisterForm = z.infer<typeof registerSchema>

// ── Вспомогательный компонент поля ────────────────────────────────────────
interface FieldProps {
  label: string
  error?: string
  children: React.ReactNode
  required?: boolean
}

function Field({ label, error, children, required }: FieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {children}
      {error && (
        <p className="text-red-500 text-xs mt-1">{error}</p>
      )}
    </div>
  )
}

// ── Компонент ──────────────────────────────────────────────────────────────
export default function RegisterPage() {
  const navigate = useNavigate()
  const setAuth = useAuthStore((s) => s.setAuth)
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: 'Student' },
  })

  // Следим за выбранной ролью чтобы показывать/скрывать поля студента
  const selectedRole = watch('role')

  const inputClass = (hasError?: boolean) =>
    `w-full border rounded-lg px-3 py-2.5 text-sm outline-none transition
     focus:ring-2 focus:ring-blue-500 focus:border-transparent
     ${hasError ? 'border-red-400 bg-red-50' : 'border-gray-300'}`

  const onSubmit = async (data: RegisterForm) => {
    setServerError(null)
    try {
      // Убираем confirmPassword — бэкенд его не ждёт
      const { confirmPassword, ...registerData } = data

      const res = await authApi.register(registerData)
      const { accessToken, userId, email, firstName, lastName, role } = res.data

      setAuth({ id: userId, email, firstName, lastName, role }, accessToken)
      toast.success('Аккаунт успешно создан!')
      navigate('/')
    } catch (err: any) {
      const message =
        err.response?.data?.message ?? 'Ошибка регистрации. Попробуйте ещё раз.'
      setServerError(message)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8">
      <div className="bg-white rounded-2xl shadow-md w-full max-w-lg p-8">

        {/* Заголовок */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">FreeLanceHub</h1>
          <p className="text-gray-500 mt-2 text-sm">Создайте новый аккаунт</p>
        </div>

        {/* Серверная ошибка */}
        {serverError && (
          <div className="mb-5 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>

          {/* Выбор роли — в виде двух карточек */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Я регистрируюсь как <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">

              {/* Карточка Student */}
              <label className={`relative cursor-pointer rounded-xl border-2 p-4 transition-all
                ${selectedRole === 'Student'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'}`}>
                <input
                  {...register('role')}
                  type="radio"
                  value="Student"
                  className="sr-only"  // Скрываем нативный radio
                />
                <div className="text-center">
                  <div className="text-2xl mb-1">🎓</div>
                  <div className="font-semibold text-sm text-gray-900">Студент</div>
                  <div className="text-xs text-gray-500 mt-0.5">Предлагаю услуги</div>
                </div>
                {selectedRole === 'Student' && (
                  <div className="absolute top-2 right-2 w-4 h-4 bg-blue-500 rounded-full
                    flex items-center justify-center">
                    <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 12 12">
                      <path d="M10 3L5 8.5 2 5.5" stroke="currentColor" strokeWidth="2"
                        fill="none" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                )}
              </label>

              {/* Карточка Employer */}
              <label className={`relative cursor-pointer rounded-xl border-2 p-4 transition-all
                ${selectedRole === 'Employer'
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200 hover:border-gray-300'}`}>
                <input
                  {...register('role')}
                  type="radio"
                  value="Employer"
                  className="sr-only"
                />
                <div className="text-center">
                  <div className="text-2xl mb-1">💼</div>
                  <div className="font-semibold text-sm text-gray-900">Работодатель</div>
                  <div className="text-xs text-gray-500 mt-0.5">Ищу исполнителей</div>
                </div>
                {selectedRole === 'Employer' && (
                  <div className="absolute top-2 right-2 w-4 h-4 bg-green-500 rounded-full
                    flex items-center justify-center">
                    <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 12 12">
                      <path d="M10 3L5 8.5 2 5.5" stroke="currentColor" strokeWidth="2"
                        fill="none" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                )}
              </label>

            </div>
            {errors.role && (
              <p className="text-red-500 text-xs mt-1">{errors.role.message}</p>
            )}
          </div>

          {/* Имя и Фамилия — в одну строку */}
          <div className="grid grid-cols-2 gap-4">
            <Field label="Имя" error={errors.firstName?.message} required>
              <input
                {...register('firstName')}
                type="text"
                placeholder="Иван"
                autoComplete="given-name"
                className={inputClass(!!errors.firstName)}
              />
            </Field>
            <Field label="Фамилия" error={errors.lastName?.message} required>
              <input
                {...register('lastName')}
                type="text"
                placeholder="Петров"
                autoComplete="family-name"
                className={inputClass(!!errors.lastName)}
              />
            </Field>
          </div>

          {/* Email */}
          <Field label="Email" error={errors.email?.message} required>
            <input
              {...register('email')}
              type="email"
              placeholder="ivan@example.com"
              autoComplete="email"
              className={inputClass(!!errors.email)}
            />
          </Field>

          {/* Пароль и подтверждение — в одну строку */}
          <div className="grid grid-cols-2 gap-4">
            <Field label="Пароль" error={errors.password?.message} required>
              <input
                {...register('password')}
                type="password"
                placeholder="••••••"
                autoComplete="new-password"
                className={inputClass(!!errors.password)}
              />
            </Field>
            <Field label="Повторите пароль" error={errors.confirmPassword?.message} required>
              <input
                {...register('confirmPassword')}
                type="password"
                placeholder="••••••"
                autoComplete="new-password"
                className={inputClass(!!errors.confirmPassword)}
              />
            </Field>
          </div>

          {/* Поля только для студентов — показываем если role = Student */}
          {selectedRole === 'Student' && (
            <div className="border border-blue-100 bg-blue-50 rounded-xl p-4 space-y-4">
              <p className="text-xs font-medium text-blue-700 uppercase tracking-wide">
                Дополнительно для студентов
              </p>
              <Field label="Университет" error={errors.university?.message}>
                <input
                  {...register('university')}
                  type="text"
                  placeholder="МГУ, МФТИ, ВШЭ..."
                  className={inputClass(!!errors.university)}
                />
              </Field>
              <Field label="Специальность / Факультет" error={errors.specialty?.message}>
                <input
                  {...register('specialty')}
                  type="text"
                  placeholder="Программная инженерия"
                  className={inputClass(!!errors.specialty)}
                />
              </Field>
            </div>
          )}

          {/* Кнопка регистрации */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60
              disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-lg
              transition-colors duration-200 text-sm mt-2"
          >
            {isSubmitting ? 'Создаём аккаунт...' : 'Зарегистрироваться'}
          </button>

        </form>

        {/* Ссылка на вход */}
        <p className="mt-6 text-center text-sm text-gray-500">
          Уже есть аккаунт?{' '}
          <Link
            to="/login"
            className="text-blue-600 font-medium hover:underline"
          >
            Войти
          </Link>
        </p>

      </div>
    </div>
  )
}