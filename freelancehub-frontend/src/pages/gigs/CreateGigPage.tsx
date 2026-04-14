import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router-dom'
import { useCreateGig, useCategories, useSkills } from '../../hooks/useGigs'
import Spinner from '../../components/ui/Spinner'

// ── Схема валидации ────────────────────────────────────────────────────────
const createGigSchema = z.object({
  title: z
    .string()
    .min(10, 'Минимум 10 символов')
    .max(200, 'Максимум 200 символов'),

  description: z
    .string()
    .min(30, 'Минимум 30 символов'),

  categoryId: z
    .string()
    .min(1, 'Выберите категорию'),

  price: z
    .number()
    .min(1, 'Минимум 1 ₽')
    .max(1_000_000, 'Максимум 1 000 000 ₽'),

  deliveryDays: z
    .number()
    .int('Введите целое число')
    .min(1, 'Минимум 1 день')
    .max(365, 'Максимум 365 дней'),

  skillIds: z.array(z.string()).optional(),
})

type CreateGigForm = z.infer<typeof createGigSchema>

// ── Вспомогательный компонент поля ────────────────────────────────────────
function Field({
  label, error, required, hint, children,
}: {
  label: string
  error?: string
  required?: boolean
  hint?: string
  children: React.ReactNode
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {children}
      {hint && !error && (
        <p className="text-xs text-gray-400 mt-1">{hint}</p>
      )}
      {error && (
        <p className="text-xs text-red-500 mt-1">{error}</p>
      )}
    </div>
  )
}

// ── Компонент ──────────────────────────────────────────────────────────────
export default function CreateGigPage() {
  const navigate = useNavigate()
  const { data: categories, isLoading: loadingCats } = useCategories()
  const { data: skills,     isLoading: loadingSkills } = useSkills()
  const createGig = useCreateGig()

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CreateGigForm>({
    resolver: zodResolver(createGigSchema),
    defaultValues: { skillIds: [] },
  })

  // Следим за выбранными навыками (для мультиселекта)
  const selectedSkillIds = watch('skillIds') ?? []

  const toggleSkill = (
    skillId: string,
    currentIds: string[],
    onChange: (ids: string[]) => void
  ) => {
    if (currentIds.includes(skillId)) {
      onChange(currentIds.filter((id) => id !== skillId))
    } else {
      onChange([...currentIds, skillId])
    }
  }

  const inputClass = (hasError?: boolean) =>
    `w-full border rounded-lg px-3 py-2.5 text-sm outline-none transition
     focus:ring-2 focus:ring-blue-500 focus:border-transparent
     ${hasError ? 'border-red-400 bg-red-50' : 'border-gray-300'}`

  const onSubmit = async (data: CreateGigForm) => {
    try {
      const result = await createGig.mutateAsync(data)
      // Редирект на мои услуги или дашборд
      navigate('/dashboard/student')
    } catch {
      // Ошибка уже обработана в хуке через toast
    }
  }

  if (loadingCats || loadingSkills) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">

      {/* Заголовок */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Создать услугу</h1>
        <p className="text-sm text-gray-500 mt-1">
          После создания услуга будет отправлена на модерацию
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

        {/* Заголовок услуги */}
        <Field
          label="Заголовок услуги"
          error={errors.title?.message}
          required
          hint="Например: «Разработаю лендинг на React за 5 дней»"
        >
          <input
            {...register('title')}
            type="text"
            placeholder="Что вы предлагаете?"
            className={inputClass(!!errors.title)}
          />
        </Field>

        {/* Описание */}
        <Field
          label="Подробное описание"
          error={errors.description?.message}
          required
          hint="Опишите что именно вы сделаете, ваш опыт и что получит заказчик"
        >
          <textarea
            {...register('description')}
            rows={6}
            placeholder="Расскажите подробно о своей услуге, опыте и результате..."
            className={`${inputClass(!!errors.description)} resize-none`}
          />
        </Field>

        {/* Категория */}
        <Field
          label="Категория"
          error={errors.categoryId?.message}
          required
        >
          <select
            {...register('categoryId')}
            className={inputClass(!!errors.categoryId)}
          >
            <option value="">— Выберите категорию —</option>
            {categories?.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </Field>

        {/* Цена и срок — в одну строку */}
        <div className="grid grid-cols-2 gap-4">
          <Field
            label="Цена (₽)"
            error={errors.price?.message}
            required
            hint="Минимальная цена за услугу"
          >
            <input
              {...register('price', { valueAsNumber: true })}
              type="number"
              min={1}
              placeholder="5000"
              className={inputClass(!!errors.price)}
            />
          </Field>

          <Field
            label="Срок выполнения (дней)"
            error={errors.deliveryDays?.message}
            required
          >
            <input
              {...register('deliveryDays', { valueAsNumber: true })}
              type="number"
              min={1}
              max={365}
              placeholder="7"
              className={inputClass(!!errors.deliveryDays)}
            />
          </Field>
        </div>

        {/* Навыки — мультиселект в виде тегов */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Навыки <span className="text-gray-400 font-normal">(необязательно)</span>
          </label>
          <p className="text-xs text-gray-400 mb-3">
            Выберите навыки которые используете в этой услуге
          </p>
          <Controller
            name="skillIds"
            control={control}
            render={({ field }) => (
              <div className="flex flex-wrap gap-2">
                {skills?.map((skill) => {
                  const selected = field.value?.includes(skill.id)
                  return (
                    <button
                      key={skill.id}
                      type="button"
                      onClick={() =>
                        toggleSkill(skill.id, field.value ?? [], field.onChange)
                      }
                      className={`px-3 py-1.5 rounded-full text-sm font-medium
                        border transition-all duration-150
                        ${selected
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-blue-300'
                        }`}
                    >
                      {skill.name}
                    </button>
                  )
                })}
              </div>
            )}
          />
        </div>

        {/* Кнопки */}
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-xl
              text-sm font-semibold hover:bg-gray-50 transition-colors"
          >
            Отмена
          </button>
          <button
            type="submit"
            disabled={isSubmitting || createGig.isPending}
            className="flex-1 py-3 bg-blue-600 text-white rounded-xl text-sm
              font-semibold hover:bg-blue-700 disabled:opacity-60
              disabled:cursor-not-allowed transition-colors"
          >
            {createGig.isPending ? 'Создаём...' : 'Создать услугу'}
          </button>
        </div>

      </form>

    </div>
  )
}