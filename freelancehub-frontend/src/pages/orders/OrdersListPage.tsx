import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, Plus } from 'lucide-react'
import { useOrders } from '../../hooks/useOrders'
import { useCategories } from '../../hooks/useGigs'
import { useAuthStore } from '../../store/authStore'
import OrderCard from '../../components/orders/OrderCard'
import Spinner from '../../components/ui/Spinner'
import Pagination from '../../components/ui/Pagination'

const SORT_OPTIONS = [
  { value: 'newest',      label: 'Сначала новые' },
  { value: 'oldest',      label: 'Сначала старые' },
  { value: 'budget_asc',  label: 'Бюджет: по возрастанию' },
  { value: 'budget_desc', label: 'Бюджет: по убыванию' },
  { value: 'deadline',    label: 'По дедлайну' },
]

export default function OrdersListPage() {
  const [page, setPage]             = useState(1)
  const [inputValue, setInputValue] = useState('')
  const [search, setSearch]         = useState('')
  const [categoryId, setCategoryId] = useState<string | undefined>()
  const [sortBy, setSortBy]         = useState('newest')

  const user = useAuthStore((s) => s.user)
  const { data: categories }        = useCategories()
  const { data, isLoading, isError } = useOrders({
    page, pageSize: 12, categoryId,
    search: search || undefined, sortBy,
  })

  const handleSearch = () => {
    setSearch(inputValue)
    setPage(1)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">

      {/* Заголовок */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Заказы</h1>
          <p className="text-sm text-gray-500 mt-1">
            {data?.totalCount
              ? `${data.totalCount} открытых заказов`
              : 'Найдите задание для себя'}
          </p>
        </div>
        {user?.role === 'Employer' && (
          <Link
            to="/orders/create"
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2
              rounded-xl font-semibold hover:bg-blue-700 transition-colors text-sm"
          >
            <Plus className="w-4 h-4" />
            Создать заказ
          </Link>
        )}
      </div>

      {/* Поиск */}
      <div className="flex gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2
            w-4 h-4 text-gray-400 pointer-events-none" />
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Поиск заказов..."
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

      {/* Layout: сайдбар + список */}
      <div className="flex gap-6">

        {/* Фильтры */}
        <aside className="hidden lg:block w-60 shrink-0 space-y-5">
          <div className="bg-white rounded-xl border border-gray-200 p-5">

            {/* Сортировка */}
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Сортировка
              </label>
              <select
                value={sortBy}
                onChange={(e) => { setSortBy(e.target.value); setPage(1) }}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm
                  focus:ring-2 focus:ring-blue-500 outline-none"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            {/* Категории */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Категория
              </label>
              <div className="space-y-1">
                <button
                  onClick={() => { setCategoryId(undefined); setPage(1) }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors
                    ${!categoryId
                      ? 'bg-blue-50 text-blue-700 font-medium'
                      : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  Все категории
                </button>
                {categories?.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => { setCategoryId(cat.id); setPage(1) }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors
                      ${categoryId === cat.id
                        ? 'bg-blue-50 text-blue-700 font-medium'
                        : 'text-gray-600 hover:bg-gray-50'}`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

          </div>
        </aside>

        {/* Список заказов */}
        <div className="flex-1 min-w-0">

          {isLoading && (
            <div className="flex justify-center items-center py-20">
              <Spinner size="lg" />
            </div>
          )}

          {isError && (
            <div className="text-center py-20">
              <p className="text-red-500 text-sm">
                Ошибка загрузки. Попробуйте обновить страницу.
              </p>
            </div>
          )}

          {!isLoading && !isError && data?.items.length === 0 && (
            <div className="text-center py-20">
              <div className="text-5xl mb-4">📋</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Заказов не найдено
              </h3>
              <p className="text-sm text-gray-500">
                Попробуйте изменить параметры поиска
              </p>
            </div>
          )}

          {!isLoading && data && data.items.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {data.items.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
          )}

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