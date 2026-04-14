interface PaginationProps {
  page:       number
  totalPages: number
  onPageChange: (page: number) => void
}

export default function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null

  return (
    <div className="flex items-center justify-center gap-1 mt-8">

      {/* Кнопка "назад" */}
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        className="px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100
          disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        ← Назад
      </button>

      {/* Номера страниц */}
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
        // Показываем: первую, последнюю, текущую и ±1 от текущей
        const show =
          p === 1 ||
          p === totalPages ||
          Math.abs(p - page) <= 1

        if (!show) {
          // Точки между разрывами
          if (p === 2 || p === totalPages - 1) {
            return <span key={p} className="px-1 text-gray-400">…</span>
          }
          return null
        }

        return (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors
              ${p === page
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
              }`}
          >
            {p}
          </button>
        )
      })}

      {/* Кнопка "вперёд" */}
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        className="px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100
          disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        Вперёд →
      </button>

    </div>
  )
}