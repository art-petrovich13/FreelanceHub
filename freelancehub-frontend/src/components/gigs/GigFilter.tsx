import { useCategories } from '../../hooks/useGigs'

interface GigFilterProps {
  categoryId?:   string
  sortBy?:       string
  onCategory:    (id: string | undefined) => void
  onSort:        (sort: string) => void
}

const SORT_OPTIONS = [
  { value: 'newest',     label: 'Сначала новые' },
  { value: 'oldest',     label: 'Сначала старые' },
  { value: 'price_asc',  label: 'Цена: по возрастанию' },
  { value: 'price_desc', label: 'Цена: по убыванию' },
  { value: 'rating',     label: 'По рейтингу' },
]

export default function GigFilter({
  categoryId,
  sortBy,
  onCategory,
  onSort,
}: GigFilterProps) {
  const { data: categories } = useCategories()

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-5">

      {/* Сортировка */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Сортировка
        </label>
        <select
          value={sortBy ?? 'newest'}
          onChange={(e) => onSort(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm
            focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Фильтр по категории */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Категория
        </label>
        <div className="space-y-1">

          {/* "Все категории" */}
          <button
            onClick={() => onCategory(undefined)}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors
              ${!categoryId
                ? 'bg-blue-50 text-blue-700 font-medium'
                : 'text-gray-600 hover:bg-gray-50'}`}
          >
            Все категории
          </button>

          {/* Конкретные категории */}
          {categories?.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onCategory(cat.id)}
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
  )
}