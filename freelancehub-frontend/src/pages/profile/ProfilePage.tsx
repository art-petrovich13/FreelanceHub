import { useParams, Link } from 'react-router-dom'
import { MapPin, BookOpen, Star, Calendar, ArrowLeft } from 'lucide-react'
import { useUserProfile } from '../../hooks/useProfile'
import { useStudentGigs } from '../../hooks/useGigs'
import { useUserReviews } from '../../hooks/useReviews'
import { useAuthStore } from '../../store/authStore'
import Avatar from '../../components/ui/Avatar'
import Badge from '../../components/ui/Badge'
import StarRating from '../../components/ui/StarRating'
import GigCard from '../../components/gigs/GigCard'
import ReviewCard from '../../components/reviews/ReviewCard'
import Spinner from '../../components/ui/Spinner'

export default function ProfilePage() {
  const { id }   = useParams<{ id: string }>()
  const currentUser = useAuthStore((s) => s.user)

  const { data: profile, isLoading: loadingProfile } = useUserProfile(id!)
  const { data: gigs    = []                        } = useStudentGigs(id!)
  const { data: reviews = []                        } = useUserReviews(id!)

  const isOwnProfile = currentUser?.id === id

  if (loadingProfile) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="text-5xl mb-4">😕</div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          Пользователь не найден
        </h2>
      </div>
    )
  }

  const fullName   = `${profile.firstName} ${profile.lastName}`
  const memberSince = new Date(profile.createdAt).toLocaleDateString('ru-RU', {
    month: 'long', year: 'numeric',
  })

  const roleLabel: Record<string, string> = {
    Student:  'Студент',
    Employer: 'Работодатель',
    Admin:    'Администратор',
  }
  const roleVariant: Record<string, 'blue' | 'green' | 'red'> = {
    Student:  'blue',
    Employer: 'green',
    Admin:    'red',
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">

      {/* Кнопка назад */}
      <button
        onClick={() => window.history.back()}
        className="inline-flex items-center gap-2 text-sm text-gray-500
          hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Назад
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ── Левая колонка: карточка профиля ── */}
        <div className="space-y-4">

          {/* Основная карточка */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">

            {/* Аватар */}
            <div className="flex flex-col items-center text-center mb-5">
              <Avatar src={profile.avatarUrl} name={fullName} size="xl" className="mb-3" />
              <h1 className="text-xl font-bold text-gray-900">{fullName}</h1>

              {/* Роль */}
              <div className="mt-2">
                <Badge variant={roleVariant[profile.role] ?? 'gray'}>
                  {roleLabel[profile.role] ?? profile.role}
                </Badge>
              </div>
            </div>

            {/* Рейтинг */}
            <div className="flex items-center justify-center gap-2 mb-4
              pb-4 border-b border-gray-100">
              <StarRating value={profile.rating} size="sm" />
              <span className="font-semibold text-gray-900">
                {profile.rating > 0 ? profile.rating.toFixed(1) : '—'}
              </span>
              <span className="text-sm text-gray-400">
                ({profile.reviewCount} отзывов)
              </span>
            </div>

            {/* Доп. информация */}
            <div className="space-y-2.5 text-sm">
              {profile.university && (
                <div className="flex items-start gap-2 text-gray-600">
                  <BookOpen className="w-4 h-4 mt-0.5 text-gray-400 shrink-0" />
                  <div>
                    <p>{profile.university}</p>
                    {profile.specialty && (
                      <p className="text-gray-400 text-xs">{profile.specialty}</p>
                    )}
                  </div>
                </div>
              )}
              <div className="flex items-center gap-2 text-gray-400">
                <Calendar className="w-4 h-4 shrink-0" />
                <span className="text-xs">На платформе с {memberSince}</span>
              </div>
            </div>

            {/* Кнопка редактирования (только для своего профиля) */}
            {isOwnProfile && (
              <Link
                to="/profile/edit"
                className="block mt-5 w-full text-center py-2.5 border border-gray-300
                  text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors"
              >
                Редактировать профиль
              </Link>
            )}

          </div>

          {/* Навыки */}
          {profile.skills.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Навыки</h3>
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill) => (
                  <span
                    key={skill.id}
                    className="text-xs bg-blue-50 text-blue-700 px-3 py-1.5
                      rounded-full font-medium"
                  >
                    {skill.name}
                  </span>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* ── Правая колонка: Bio + Услуги + Отзывы ── */}
        <div className="lg:col-span-2 space-y-6">

          {/* Bio */}
          {profile.bio && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">О себе</h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-sm">
                {profile.bio}
              </p>
            </div>
          )}

          {/* Услуги студента */}
          {profile.role === 'Student' && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-semibold text-gray-900">
                  Услуги
                </h2>
                <span className="text-sm text-gray-400">
                  {gigs.length} {gigs.length === 1 ? 'услуга' : 'услуг'}
                </span>
              </div>

              {gigs.length === 0 ? (
                <div className="text-center py-8 text-gray-500 text-sm">
                  {isOwnProfile
                    ? <>Вы ещё не создали ни одной услуги.{' '}
                        <Link to="/gigs/create" className="text-blue-600 hover:underline">
                          Создать услугу
                        </Link>
                      </>
                    : 'Пользователь ещё не создал ни одной услуги'}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {gigs.map((gig) => (
                    <GigCard key={gig.id} gig={gig} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Отзывы */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-gray-900">
                Отзывы
              </h2>
              <span className="text-sm text-gray-400">
                {reviews.length} {reviews.length === 1 ? 'отзыв' : 'отзывов'}
              </span>
            </div>

            {reviews.length === 0 ? (
              <div className="text-center py-8 text-gray-500 text-sm">
                Отзывов пока нет
              </div>
            ) : (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  )
}