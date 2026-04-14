import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router-dom'
import { useCreateOrder } from '../../hooks/useOrders'
import { useCategories, useSkills } from '../../hooks/useGigs'
import Spinner from '../../components/ui/Spinner'

const createOrderSchema = z.object({
  title: z.string().min(10, 'Минимум 10 символов').max(200, 'Максимум 200 символов'),
  description: z.string().min(30, 'Минимум 30 символов'),
  categoryId: z.string().min(1, 'Выберите категорию'),
  budget: z
    .number('Введите число')
    .min(1, 'Минимум 1 ₽')
    .max(10_000_000, 'Максимум 10 000 000 ₽'),
  deadline: z
    .string()
    .min(1, 'Укажите дедлайн')
    .refine((val) => {
      const d = new Date(val)
      return d > new Date()
    }, 'Дедлайн должен быть в будущем'),
  skillIds: z.array(z.string()).optional(),
})

type CreateOrderForm = z.infer<typeof createOrderSchema>

function Field({ label, error, required, hint, children }: {
  label: string; error?: string; required?: boolean; hint?: string; children: React.ReactNode
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}{required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {children}
      {hint && !error && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  )
}

export default function CreateOrderPage() {
  const navigate = useNavigate()
  const { data: categories, isLoading: loadingCats } = useCategories()
  const { data: skills, isLoading: loadingSkills } = useSkills()
  const createOrder = useCreateOrder()

  const {
    register, handleSubmit, control, watch,
    formState: { errors },
  } = useForm<CreateOrderForm>({
    resolver: zodResolver(createOrderSchema),
    defaultValues: { skillIds: [] },
  })

  const selectedSkillIds = watch('skillIds') ?? []

  const toggleSkill = (
    skillId: string, currentIds: string[], onChange: (ids: string[]) => void
  ) => {
    onChange(currentIds.includes(skillId)
      ? currentIds.filter((id) => id !== skillId)
      : [...currentIds, skillId])
  }

  const inputClass = (hasError?: boolean) =>
    `w-full border rounded-lg px-3 py-2.5 text-sm outline-none transition
     focus:ring-2 focus:ring-blue-500 focus:border-transparent
     ${hasError ? 'border-red-400 bg-red-50' : 'border-gray-300'}`

  // Минимальная дата для поля дедлайна — завтра
  const minDate = new Date()
  minDate.setDate(minDate.getDate() + 1)
  const minDateStr = minDate.toISOString().split('T')[0]

  const onSubmit = async (data: CreateOrderForm) => {
    try {
      await createOrder.mutateAsync(data)
      navigate('/dashboard/employer')
    } catch {
      // обработано в хуке
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
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Создать заказ</h1>
        <p className="text-sm text-gray-500 mt-1">
          Опишите задание и студенты смогут откликнуться
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

        <Field label="Заголовок заказа" error={errors.title?.message} required
          hint="Например: «Нужен лендинг для стартапа» или «Дизайн логотипа»">
          <input {...register('title')} type="text"
            placeholder="Кратко опишите задание"
            className={inputClass(!!errors.title)} />
        </Field>

        <Field label="Подробное описание" error={errors.description?.message} required
          hint="Опишите что нужно сделать, требования к результату и пожелания">
          <textarea {...register('description')} rows={6}
            placeholder="Подробно опишите что нужно сделать..."
            className={`${inputClass(!!errors.description)} resize-none`} />
        </Field>

        <Field label="Категория" error={errors.categoryId?.message} required>
          <select {...register('categoryId')} className={inputClass(!!errors.categoryId)}>
            <option value="">— Выберите категорию —</option>
            {categories?.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Бюджет (₽)" error={errors.budget?.message} required>
            <input
              {...register('budget', { valueAsNumber: true })}
              type="number" min={1} placeholder="10000"
              className={inputClass(!!errors.budget)} />
          </Field>

          <Field label="Дедлайн" error={errors.deadline?.message} required>
            <input
              {...register('deadline')}
              type="date" min={minDateStr}
              className={inputClass(!!errors.deadline)} />
          </Field>
        </div>

        {/* Навыки */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Требуемые навыки{' '}
            <span className="text-gray-400 font-normal">(необязательно)</span>
          </label>
          <Controller
            name="skillIds"
            control={control}
            render={({ field }) => (
              <div className="flex flex-wrap gap-2">
                {skills?.map((skill) => {
                  const selected = field.value?.includes(skill.id)
                  return (
                    <button key={skill.id} type="button"
                      onClick={() => toggleSkill(skill.id, field.value ?? [], field.onChange)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium border
                        transition-all duration-150
                        ${selected
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-blue-300'}`}>
                      {skill.name}
                    </button>
                  )
                })}
              </div>
            )}
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button type="button" onClick={() => navigate(-1)}
            className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-xl
              text-sm font-semibold hover:bg-gray-50 transition-colors">
            Отмена
          </button>
          <button type="submit"
            disabled={createOrder.isPending}
            className="flex-1 py-3 bg-blue-600 text-white rounded-xl text-sm
              font-semibold hover:bg-blue-700 disabled:opacity-60
              disabled:cursor-not-allowed transition-colors">
            {createOrder.isPending ? 'Публикуем...' : 'Опубликовать заказ'}
          </button>
        </div>

      </form>
    </div>
  )
}