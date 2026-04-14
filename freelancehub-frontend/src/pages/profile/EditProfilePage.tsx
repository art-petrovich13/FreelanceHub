import { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router-dom'
import { useMyProfile, useUpdateProfile } from '../../hooks/useProfile'
import { useSkills } from '../../hooks/useGigs'
import { useAuthStore } from '../../store/authStore'
import Avatar from '../../components/ui/Avatar'
import Spinner from '../../components/ui/Spinner'

const editProfileSchema = z.object({
  firstName:  z.string().min(1, 'Имя обязательно').max(100),
  lastName:   z.string().min(1, 'Фамилия обязательна').max(100),
  university: z.string().max(200).optional(),
  specialty:  z.string().max(200).optional(),
  bio:        z.string().max(1000, 'Максимум 1000 символов').optional(),
  avatarUrl:  z
    .string()
    .url('Некорректный URL')
    .optional()
    .or(z.literal('')),
  skillIds:   z.array(z.string()).optional(),
})

type EditProfileForm = z.infer<typeof editProfileSchema>

function Field({ label, error, hint, children }: {
  label: string; error?: string; hint?: string; children: React.ReactNode
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {children}
      {hint && !error && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  )
}

export default function EditProfilePage() {
  const navigate    = useNavigate()
  const user        = useAuthStore((s) => s.user)
  const { data: profile, isLoading: loadingProfile } = useMyProfile()
  const { data: skills,  isLoading: loadingSkills  } = useSkills()
  const updateProfile = useUpdateProfile()

  const {
    register, handleSubmit, control, watch, reset,
    formState: { errors },
  } = useForm<EditProfileForm>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: { skillIds: [] },
  })

  // Предзаполняем форму данными профиля когда они загрузятся
  useEffect(() => {
    if (profile) {
      reset({
        firstName:  profile.firstName,
        lastName:   profile.lastName,
        university: profile.university ?? '',
        specialty:  profile.specialty  ?? '',
        bio:        profile.bio        ?? '',
        avatarUrl:  profile.avatarUrl  ?? '',
        skillIds:   profile.skills.map((s) => s.id),
      })
    }
  }, [profile, reset])

  const selectedSkillIds = watch('skillIds') ?? []
  const watchedFirstName = watch('firstName')
  const watchedLastName  = watch('lastName')
  const watchedAvatarUrl = watch('avatarUrl')

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

  const onSubmit = async (data: EditProfileForm) => {
    // Убираем пустые строки → undefined
    const cleaned = {
      ...data,
      university: data.university || undefined,
      specialty:  data.specialty  || undefined,
      bio:        data.bio        || undefined,
      avatarUrl:  data.avatarUrl  || undefined,
    }
    try {
      await updateProfile.mutateAsync(cleaned)
      navigate(`/profile/${user?.id}`)
    } catch {
      // обработано в хуке
    }
  }

  if (loadingProfile || loadingSkills) {
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
        <h1 className="text-2xl font-bold text-gray-900">Редактировать профиль</h1>
        <p className="text-sm text-gray-500 mt-1">
          Обновите информацию о себе
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

        {/* Превью аватара */}
        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
          <Avatar
            src={watchedAvatarUrl || null}
            name={`${watchedFirstName} ${watchedLastName}`}
            size="lg"
          />
          <div className="flex-1">
            <Field
              label="URL аватара"
              error={errors.avatarUrl?.message}
              hint="Ссылка на изображение профиля (необязательно)"
            >
              <input
                {...register('avatarUrl')}
                type="url"
                placeholder="https://example.com/avatar.jpg"
                className={inputClass(!!errors.avatarUrl)}
              />
            </Field>
          </div>
        </div>

        {/* Имя и фамилия */}
        <div className="grid grid-cols-2 gap-4">
          <Field label="Имя *" error={errors.firstName?.message}>
            <input
              {...register('firstName')}
              type="text"
              placeholder="Иван"
              className={inputClass(!!errors.firstName)}
            />
          </Field>
          <Field label="Фамилия *" error={errors.lastName?.message}>
            <input
              {...register('lastName')}
              type="text"
              placeholder="Петров"
              className={inputClass(!!errors.lastName)}
            />
          </Field>
        </div>

        {/* Университет и специальность */}
        {(profile?.role === 'Student' || true) && (
          <div className="grid grid-cols-1 gap-4">
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

        {/* Bio */}
        <Field
          label="О себе"
          error={errors.bio?.message}
          hint="Расскажите о своём опыте, навыках и целях"
        >
          <textarea
            {...register('bio')}
            rows={5}
            placeholder="Студент 3-го курса МГУ, специализируюсь на React и TypeScript..."
            className={`${inputClass(!!errors.bio)} resize-none`}
          />
          <p className="text-xs text-gray-400 mt-1 text-right">
            {watch('bio')?.length ?? 0} / 1000
          </p>
        </Field>

        {/* Навыки */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Мои навыки{' '}
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
                    <button
                      key={skill.id}
                      type="button"
                      onClick={() =>
                        toggleSkill(skill.id, field.value ?? [], field.onChange)
                      }
                      className={`px-3 py-1.5 rounded-full text-sm font-medium border
                        transition-all duration-150
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
          {selectedSkillIds.length > 0 && (
            <p className="text-xs text-gray-400 mt-2">
              Выбрано: {selectedSkillIds.length}
            </p>
          )}
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
            disabled={updateProfile.isPending}
            className="flex-1 py-3 bg-blue-600 text-white rounded-xl text-sm
              font-semibold hover:bg-blue-700 disabled:opacity-60
              disabled:cursor-not-allowed transition-colors"
          >
            {updateProfile.isPending ? 'Сохраняем...' : 'Сохранить изменения'}
          </button>
        </div>

      </form>

    </div>
  )
}