import { useParams, Link } from 'react-router-dom'
import { Star, Clock, ArrowLeft, User } from 'lucide-react'
import { useGig } from '../../hooks/useGigs'
import { useAuthStore } from '../../store/authStore'
import Spinner from '../../components/ui/Spinner'
import Badge from '../../components/ui/Badge'

export default function GigDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { data: gig, isLoading, isError } = useGig(id!)
  const user = useAuthStore((s) => s.user)

  // ── Загрузка ──
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    )
  }

  // ── Ошибка / не найдено ──
  if (isError || !gig) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="text-5xl mb-4">😕</div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Услуга не найдена</h2>
        <p className="text-gray-500 text-sm mb-6">
          Возможно, она была удалена или ещё не одобрена.
        </p>
        <Link to="/gigs" className="text-blue-600 hover:underline text-sm">
          ← Вернуться к списку услуг
        </Link>
      </div>
    )
  }

  // Проверяем является ли текущий пользователь владельцем услуги
  const isOwner = user?.id === gig.studentId

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">

      {/* Кнопка "назад" */}
      <Link
        to="/gigs"
        className="inline-flex items-center gap-2 text-sm text-gray-500
          hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Все услуги
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ── Основная информация (2 колонки) ── */}
        <div className="lg:col-span-2 space-y-6">

          {/* Заголовок и категория */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <Badge variant="blue">{gig.categoryName}</Badge>
              {gig.status !== 'Active' && (
                <Badge variant={gig.status === 'Pending' ? 'yellow' : 'red'}>
                  {gig.status === 'Pending' ? 'На модерации' : gig.status}
                </Badge>
              )}
            </div>

            <h1 className="text-2xl font-bold text-gray-900 mb-4 leading-snug">
              {gig.title}
            </h1>

            {/* Навыки */}
            {gig.skills.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {gig.skills.map((skill) => (
                  <span
                    key={skill.id}
                    className="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded-full"
                  >
                    {skill.name}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Описание */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Описание услуги
            </h2>
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {gig.description}
            </p>
          </div>

          {/* Информация об исполнителе */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Об исполнителе
            </h2>
            <div className="flex items-start gap-4">
              {/* Аватар */}
              <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center
                justify-center text-blue-600 font-bold text-lg shrink-0">
                {gig.studentAvatar
                  ? <img src={gig.studentAvatar} alt={gig.studentName}
                      className="w-14 h-14 rounded-full object-cover" />
                  : gig.studentName.split(' ').map(n => n[0]).join('').slice(0, 2)
                }
              </div>

              <div className="flex-1">
                <Link
                  to={`/profile/${gig.studentId}`}
                  className="font-semibold text-gray-900 hover:text-blue-600 transition-colors"
                >
                  {gig.studentName}
                </Link>

                {gig.studentUniversity && (
                  <p className="text-sm text-gray-500 mt-0.5">{gig.studentUniversity}</p>
                )}

                <div className="flex items-center gap-1 mt-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span className="text-sm font-medium">
                    {gig.studentRating > 0
                      ? gig.studentRating.toFixed(1)
                      : 'Нет оценок'}
                  </span>
                  {gig.studentReviews > 0 && (
                    <span className="text-sm text-gray-400">
                      ({gig.studentReviews} отзывов)
                    </span>
                  )}
                </div>

                {gig.studentBio && (
                  <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                    {gig.studentBio}
                  </p>
                )}
              </div>
            </div>
          </div>

        </div>

        {/* ── Боковая панель (1 колонка) ── */}
        <div className="space-y-4">

          {/* Карточка заказа */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-24">

            {/* Цена */}
            <div className="mb-4">
              <span className="text-3xl font-bold text-gray-900">
                {gig.price.toLocaleString('ru-RU')} ₽
              </span>
            </div>

            {/* Срок */}
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-5">
              <Clock className="w-4 h-4 text-gray-400" />
              <span>Срок: <strong>{gig.deliveryDays} дней</strong></span>
            </div>

            {/* Кнопка "Связаться" или кнопки владельца */}
            {isOwner ? (
              <div className="space-y-2">
                <p className="text-sm text-center text-gray-500 mb-3">
                  Это ваша услуга
                </p>
                <Link
                  to={`/gigs/edit/${gig.id}`}
                  className="block w-full text-center bg-gray-100 text-gray-700
                    py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-200 transition-colors"
                >
                  Редактировать
                </Link>
              </div>
            ) : (
              <Link
                to={`/profile/${gig.studentId}`}
                className="flex items-center justify-center gap-2 w-full
                  bg-blue-600 text-white py-3 rounded-xl text-sm font-semibold
                  hover:bg-blue-700 transition-colors"
              >
                <User className="w-4 h-4" />
                Смотреть профиль
              </Link>
            )}

          </div>

        </div>

      </div>

    </div>
  )
}