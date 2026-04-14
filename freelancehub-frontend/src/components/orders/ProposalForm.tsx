import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useCreateProposal } from '../../hooks/useProposals'

const proposalSchema = z.object({
  coverLetter: z
    .string()
    .min(20, 'Минимум 20 символов')
    .max(2000, 'Максимум 2000 символов'),
  proposedPrice: z
    .number('Введите число' )
    .min(1, 'Минимум 1 ₽'),
  proposedDays: z
    .number('Введите число' )
    .int('Целое число')
    .min(1, 'Минимум 1 день')
    .max(365, 'Максимум 365 дней'),
})

type ProposalFormData = z.infer<typeof proposalSchema>

interface ProposalFormProps {
  orderId: string
  orderBudget: number   // Подсказка — бюджет заказа
}

export default function ProposalForm({ orderId, orderBudget }: ProposalFormProps) {
  const createProposal = useCreateProposal()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProposalFormData>({
    resolver: zodResolver(proposalSchema),
    defaultValues: {
      proposedPrice: orderBudget,  // Предзаполняем бюджетом заказа
      proposedDays:  7,
    },
  })

  const inputClass = (hasError?: boolean) =>
    `w-full border rounded-lg px-3 py-2.5 text-sm outline-none transition
     focus:ring-2 focus:ring-blue-500 focus:border-transparent
     ${hasError ? 'border-red-400 bg-red-50' : 'border-gray-300'}`

  const onSubmit = async (data: ProposalFormData) => {
    try {
      await createProposal.mutateAsync({ orderId, ...data })
      reset()
    } catch {
      // ошибка обработана в хуке
    }
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-1">
        Подать отклик
      </h2>
      <p className="text-sm text-gray-500 mb-5">
        Расскажите почему вы подходите для выполнения этого заказа
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

        {/* Сопроводительное письмо */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Сопроводительное письмо <span className="text-red-500">*</span>
          </label>
          <textarea
            {...register('coverLetter')}
            rows={5}
            placeholder="Здравствуйте! Я занимаюсь подобными задачами уже 2 года. Вот что я предлагаю..."
            className={`${inputClass(!!errors.coverLetter)} resize-none`}
          />
          {errors.coverLetter && (
            <p className="text-red-500 text-xs mt-1">{errors.coverLetter.message}</p>
          )}
        </div>

        {/* Цена и срок */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ваша цена (₽) <span className="text-red-500">*</span>
            </label>
            <input
              {...register('proposedPrice', { valueAsNumber: true })}
              type="number"
              min={1}
              className={inputClass(!!errors.proposedPrice)}
            />
            {errors.proposedPrice && (
              <p className="text-red-500 text-xs mt-1">{errors.proposedPrice.message}</p>
            )}
            <p className="text-xs text-gray-400 mt-1">
              Бюджет заказа: {orderBudget.toLocaleString('ru-RU')} ₽
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Срок (дней) <span className="text-red-500">*</span>
            </label>
            <input
              {...register('proposedDays', { valueAsNumber: true })}
              type="number"
              min={1}
              max={365}
              className={inputClass(!!errors.proposedDays)}
            />
            {errors.proposedDays && (
              <p className="text-red-500 text-xs mt-1">{errors.proposedDays.message}</p>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting || createProposal.isPending}
          className="w-full py-3 bg-blue-600 text-white rounded-xl text-sm
            font-semibold hover:bg-blue-700 disabled:opacity-60
            disabled:cursor-not-allowed transition-colors"
        >
          {createProposal.isPending ? 'Отправляем...' : 'Отправить отклик'}
        </button>

      </form>
    </div>
  )
}