import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, Plus } from 'lucide-react'
import { useGigs } from '../../hooks/useGigs'
import { useAuthStore } from '../../store/authStore'
import GigCard from '../../components/gigs/GigCard'
import GigFilter from '../../components/gigs/GigFilter'
import Spinner from '../../components/ui/Spinner'
import Pagination from '../../components/ui/Pagination'

export default function GigsListPage() {
  // Состояние фильтров
  const [page, setPage]           = useState(1)
  const [search, setSearch]       = useState('')
  const [inputValue, setInputValue] = useState('') // отдельное для инпута (до нажатия Enter)
  const [categoryId, setCategoryId] = useState<string | undefined>()
  const [sortBy, setSortBy]       = useState('newest')

  const user = useAuthStore((s) => s.user)

  // Запрос данных
  const { data, isLoading, isError } = useGigs({
    page,
    pageSize: 12,
    categoryId,
    search: search || undefined,
    sortBy,
  })

  // Поиск — только по нажатию Enter или кнопки
  const handleSearch = () => {
    setSearch(inputValue)
    setPage(1)   // При новом поиске сбрасываем на первую страницу
  }

  const handleCategoryChange = (id: string | undefined) => {
    setCategoryId(id)
    setPage(1)
  }

  const handleSortChange = (sort: string) => {
    setSortBy(sort)
    setPage(1)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">

      {/* ── Заголовок страницы ── */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Услуги</h1>
          <p className="text-sm text-gray-500 mt-1">
            {data?.totalCount
              ? `Найдено ${data.totalCount} услуг`
              : 'Найти исполнителя для вашего проекта'}
          </p>
        </div>

        {/* Кнопка создания — только для студентов */}
        {user?.role === 'Student' && (
          <Link
            to="/gigs/create"
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2
              rounded-xl font-semibold hover:bg-blue-700 transition-colors text-sm"
          >
            <Plus className="w-4 h-4" />
            Создать услугу
          </Link>
        )}
      </div>

      {/* ── Строка поиска ── */}
      <div className="flex gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2
            w-4 h-4 text-gray-400 pointer-events-none" />
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Поиск услуг... (например: React, дизайн логотипа)"
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl
              text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          />
        </div>
        <button
          onClick={handleSearch}
          className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm
            font-semibold hover:bg-blue-700 transition-colors"
        >
          Найти
        </button>
      </div>

      {/* ── Основной layout: фильтры + список ── */}
      <div className="flex gap-6">

        {/* Сайдбар с фильтрами */}
        <aside className="hidden lg:block w-60 shrink-0">
          <GigFilter
            categoryId={categoryId}
            sortBy={sortBy}
            onCategory={handleCategoryChange}
            onSort={handleSortChange}
          />
        </aside>

        {/* Основной контент */}
        <div className="flex-1 min-w-0">

          {/* Состояние загрузки */}
          {isLoading && (
            <div className="flex justify-center items-center py-20">
              <Spinner size="lg" />
            </div>
          )}

          {/* Состояние ошибки */}
          {isError && (
            <div className="text-center py-20">
              <p className="text-red-500 text-sm">Ошибка загрузки. Попробуйте обновить страницу.</p>
            </div>
          )}

          {/* Пустой результат */}
          {!isLoading && !isError && data?.items.length === 0 && (
            <div className="text-center py-20">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Услуги не найдены
              </h3>
              <p className="text-sm text-gray-500">
                Попробуйте изменить параметры поиска или фильтры
              </p>
            </div>
          )}

          {/* Сетка карточек */}
          {!isLoading && data && data.items.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {data.items.map((gig) => (
                <GigCard key={gig.id} gig={gig} />
              ))}
            </div>
          )}

          {/* Пагинация */}
          {data && data.totalPages > 1 && (
            <Pagination
              page={page}
              totalPages={data.totalPages}
              onPageChange={setPage}
            />
          )}

        </div>
      </div>

    </div>
  )
}