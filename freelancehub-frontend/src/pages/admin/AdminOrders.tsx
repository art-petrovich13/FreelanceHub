import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Search } from 'lucide-react'
import { useAdminOrders, useChangeOrderStatus } from '../../hooks/useAdmin'
import Spinner from '../../components/ui/Spinner'
import Badge from '../../components/ui/Badge'
import Pagination from '../../components/ui/Pagination'

const ORDER_STATUSES = ['', 'Open', 'InProgress', 'Completed', 'Cancelled', 'Rejected']

const statusBadge = (status: string) => {
  const map: Record<string, any> = {
    Open:       { variant: 'green',  label: 'Открыт' },
    InProgress: { variant: 'blue',   label: 'В работе' },
    Completed:  { variant: 'gray',   label: 'Завершён' },
    Cancelled:  { variant: 'red',    label: 'Отменён' },
    Rejected:   { variant: 'red',    label: 'Отклонён' },
  }
  return map[status] ?? { variant: 'gray', label: status }
}

export default function AdminOrders() {
  const [page, setPage]                   = useState(1)
  const [inputValue, setInputValue]       = useState('')
  const [search, setSearch]               = useState('')
  const [statusFilter, setStatusFilter]   = useState('')

  const { data, isLoading } = useAdminOrders({
    page, pageSize: 20,
    status: statusFilter || undefined,
    search: search || undefined,
  })
  const changeStatus = useChangeOrderStatus()
  const handleSearch = () => { setSearch(inputValue); setPage(1) }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Заказы</h1>
        <p className="text-sm text-gray-500 mt-1">
          {data?.totalCount ?? 0} заказов на платформе
        </p>
      </div>

      {/* Фильтры */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2
            w-4 h-4 text-gray-400 pointer-events-none" />
          <input type="text" value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Поиск по заголовку..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl
              text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
        </div>
        <button onClick={handleSearch}
          className="px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm
            font-semibold hover:bg-blue-700">
          Найти
        </button>

        {/* Вкладки статусов */}
        <div className="flex rounded-xl border border-gray-300 overflow-hidden">
          {ORDER_STATUSES.map((s) => (
            <button key={s}
              onClick={() => { setStatusFilter(s); setPage(1) }}
              className={`px-3 py-2 text-sm transition-colors border-r last:border-r-0
                border-gray-300
                ${statusFilter === s
                  ? 'bg-blue-600 text-white font-semibold'
                  : 'text-gray-600 hover:bg-gray-50'}`}>
              {s === '' ? 'Все' : s === 'InProgress' ? 'В работе' : s}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  {['Заказ', 'Работодатель', 'Исполнитель', 'Бюджет', 'Статус',
                    'Откликов', 'Дедлайн', ''].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold
                      text-gray-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data?.items.map((order) => {
                  const { variant, label } = statusBadge(order.status)
                  return (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <Link to={`/orders/${order.id}`}
                          className="font-medium text-gray-900 hover:text-blue-600
                            line-clamp-1 max-w-48">
                          {order.title}
                        </Link>
                        <p className="text-xs text-gray-400">{order.categoryName}</p>
                      </td>
                      <td className="px-4 py-3">
                        <Link to={`/profile/${order.employerId}`}
                          className="text-gray-700 hover:text-blue-600">
                          {order.employerName}
                        </Link>
                        <p className="text-xs text-gray-400">{order.employerEmail}</p>
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-xs">
                        {order.selectedStudentName ?? '—'}
                      </td>
                      <td className="px-4 py-3 font-semibold text-gray-900">
                        {order.budget.toLocaleString('ru-RU')} ₽
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={variant}>{label}</Badge>
                      </td>
                      <td className="px-4 py-3 text-center text-gray-500">
                        {order.proposalCount}
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-400">
                        {new Date(order.deadline).toLocaleDateString('ru-RU')}
                      </td>
                      <td className="px-4 py-3">
                        {order.status === 'Open' && (
                          <button
                            onClick={() => changeStatus.mutate({
                              id: order.id, action: 'cancel'
                            })}
                            className="text-xs text-red-500 hover:text-red-700
                              px-2 py-1 border border-red-200 rounded-lg hover:bg-red-50"
                          >
                            Отменить
                          </button>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          {data?.items.length === 0 && (
            <div className="text-center py-12 text-gray-500 text-sm">
              Заказы не найдены
            </div>
          )}
        </div>
      )}

      <Pagination page={page} totalPages={data?.totalPages ?? 1} onPageChange={setPage} />
    </div>
  )
}