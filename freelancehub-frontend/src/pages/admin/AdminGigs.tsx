import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, CheckCircle, XCircle, Archive } from 'lucide-react'
import { useAdminGigs, useChangeGigStatus } from '../../hooks/useAdmin'
import Spinner from '../../components/ui/Spinner'
import Badge from '../../components/ui/Badge'
import Modal from '../../components/ui/Modal'
import Pagination from '../../components/ui/Pagination'

const GIG_STATUSES = ['', 'Pending', 'Active', 'Rejected', 'Archived']

const statusBadge = (status: string) => {
  const map: Record<string, any> = {
    Pending:  { variant: 'yellow',  label: 'На модерации' },
    Active:   { variant: 'green',   label: 'Активна' },
    Rejected: { variant: 'red',     label: 'Отклонена' },
    Archived: { variant: 'gray',    label: 'Архив' },
  }
  return map[status] ?? { variant: 'gray', label: status }
}

export default function AdminGigs() {
  const [page, setPage]             = useState(1)
  const [inputValue, setInputValue] = useState('')
  const [search, setSearch]         = useState('')
  const [statusFilter, setStatusFilter] = useState('Pending') // По умолчанию — очередь

  // Модал отклонения с причиной
  const [rejectModal, setRejectModal] = useState<{
    isOpen: boolean; gigId: string; gigTitle: string
  }>({ isOpen: false, gigId: '', gigTitle: '' })
  const [rejectReason, setRejectReason] = useState('')

  const { data, isLoading } = useAdminGigs({
    page, pageSize: 20,
    status: statusFilter || undefined,
    search: search || undefined,
  })

  const changeStatus = useChangeGigStatus()

  const handleSearch = () => { setSearch(inputValue); setPage(1) }

  const handleReject = async () => {
    await changeStatus.mutateAsync({
      id:     rejectModal.gigId,
      action: 'reject',
      reason: rejectReason || undefined,
    })
    setRejectModal(m => ({ ...m, isOpen: false }))
    setRejectReason('')
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Модерация услуг</h1>
        <p className="text-sm text-gray-500 mt-1">
          {data?.totalCount ?? 0} услуг
        </p>
      </div>

      {/* Фильтры */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2
            w-4 h-4 text-gray-400 pointer-events-none" />
          <input
            type="text" value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Поиск по заголовку..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl
              text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        <button onClick={handleSearch}
          className="px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm
            font-semibold hover:bg-blue-700">
          Найти
        </button>

        {/* Вкладки статусов */}
        <div className="flex rounded-xl border border-gray-300 overflow-hidden">
          {GIG_STATUSES.map((s) => (
            <button key={s}
              onClick={() => { setStatusFilter(s); setPage(1) }}
              className={`px-3 py-2 text-sm transition-colors border-r last:border-r-0
                border-gray-300
                ${statusFilter === s
                  ? 'bg-blue-600 text-white font-semibold'
                  : 'text-gray-600 hover:bg-gray-50'}`}>
              {s === '' ? 'Все' : s === 'Pending' ? 'На модерации' : s}
            </button>
          ))}
        </div>
      </div>

      {/* Таблица */}
      {isLoading ? (
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  {['Услуга', 'Студент', 'Категория', 'Цена', 'Статус', 'Дата', ''].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold
                      text-gray-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data?.items.map((gig) => {
                  const { variant, label } = statusBadge(gig.status)
                  return (
                    <tr key={gig.id} className="hover:bg-gray-50">
                      {/* Услуга */}
                      <td className="px-4 py-3">
                        <Link to={`/gigs/${gig.id}`}
                          className="font-medium text-gray-900 hover:text-blue-600
                            line-clamp-1 max-w-48">
                          {gig.title}
                        </Link>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {gig.deliveryDays} дней
                        </p>
                      </td>
                      {/* Студент */}
                      <td className="px-4 py-3">
                        <Link to={`/profile/${gig.studentId}`}
                          className="text-gray-700 hover:text-blue-600">
                          {gig.studentName}
                        </Link>
                        <p className="text-xs text-gray-400">{gig.studentEmail}</p>
                      </td>
                      {/* Категория */}
                      <td className="px-4 py-3 text-gray-500">{gig.categoryName}</td>
                      {/* Цена */}
                      <td className="px-4 py-3 font-semibold text-gray-900">
                        {gig.price.toLocaleString('ru-RU')} ₽
                      </td>
                      {/* Статус */}
                      <td className="px-4 py-3">
                        <Badge variant={variant}>{label}</Badge>
                      </td>
                      {/* Дата */}
                      <td className="px-4 py-3 text-xs text-gray-400">
                        {new Date(gig.createdAt).toLocaleDateString('ru-RU')}
                      </td>
                      {/* Действия */}
                      <td className="px-4 py-3">
                        {gig.status === 'Pending' && (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => changeStatus.mutate({
                                id: gig.id, action: 'approve'
                              })}
                              disabled={changeStatus.isPending}
                              title="Одобрить"
                              className="p-2 text-green-600 hover:bg-green-50
                                rounded-lg transition-colors"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setRejectModal({
                                isOpen: true, gigId: gig.id, gigTitle: gig.title
                              })}
                              title="Отклонить"
                              className="p-2 text-red-500 hover:bg-red-50
                                rounded-lg transition-colors"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                        {gig.status === 'Active' && (
                          <button
                            onClick={() => changeStatus.mutate({
                              id: gig.id, action: 'archive'
                            })}
                            title="Архивировать"
                            className="p-2 text-gray-500 hover:bg-gray-100
                              rounded-lg transition-colors"
                          >
                            <Archive className="w-4 h-4" />
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
              Услуги не найдены
            </div>
          )}
        </div>
      )}

      <Pagination page={page} totalPages={data?.totalPages ?? 1} onPageChange={setPage} />

      {/* Модал отклонения */}
      <Modal
        isOpen={rejectModal.isOpen}
        onClose={() => setRejectModal(m => ({ ...m, isOpen: false }))}
        title="Отклонить услугу"
        size="md"
      >
        <p className="text-sm text-gray-600 mb-3">
          Услуга: <strong>{rejectModal.gigTitle}</strong>
        </p>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Причина отклонения{' '}
            <span className="text-gray-400 font-normal">(необязательно)</span>
          </label>
          <textarea
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            rows={3}
            placeholder="Напишите студенту что нужно исправить..."
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm
              focus:ring-2 focus:ring-blue-500 outline-none resize-none"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setRejectModal(m => ({ ...m, isOpen: false }))}
            className="flex-1 py-2.5 border border-gray-300 text-gray-700
              rounded-xl text-sm font-semibold hover:bg-gray-50"
          >
            Отмена
          </button>
          <button
            onClick={handleReject}
            disabled={changeStatus.isPending}
            className="flex-1 py-2.5 bg-red-600 text-white rounded-xl text-sm
              font-semibold hover:bg-red-700 disabled:opacity-60"
          >
            {changeStatus.isPending ? 'Отклоняем...' : 'Отклонить'}
          </button>
        </div>
      </Modal>

    </div>
  )
}