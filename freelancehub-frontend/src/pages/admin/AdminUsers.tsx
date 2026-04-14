import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, Shield, ShieldOff, UserCog } from 'lucide-react'
import {
  useAdminUsers,
  useSetBlock,
  useChangeRole,
  useDeleteUser,
} from '../../hooks/useAdmin'
import { useAuthStore } from '../../store/authStore'
import Spinner from '../../components/ui/Spinner'
import Badge from '../../components/ui/Badge'
import Modal from '../../components/ui/Modal'
import Pagination from '../../components/ui/Pagination'

const ROLES = ['Student', 'Employer', 'Admin']

const roleBadge = (role: string) => {
  const map: Record<string, 'blue' | 'green' | 'red'> = {
    Student: 'blue', Employer: 'green', Admin: 'red',
  }
  return map[role] ?? 'gray'
}

export default function AdminUsers() {
  const currentUser = useAuthStore((s) => s.user)

  const [page, setPage]             = useState(1)
  const [inputValue, setInputValue] = useState('')
  const [search, setSearch]         = useState('')
  const [roleFilter, setRoleFilter] = useState<string | undefined>()
  const [blockedFilter, setBlockedFilter] = useState<boolean | undefined>()

  // Модал смены роли
  const [roleModal, setRoleModal] = useState<{
    isOpen: boolean; userId: string; userName: string; currentRole: string
  }>({ isOpen: false, userId: '', userName: '', currentRole: '' })
  const [selectedRole, setSelectedRole] = useState('')

  const { data, isLoading } = useAdminUsers({
    page, pageSize: 20, search: search || undefined,
    role: roleFilter, blocked: blockedFilter,
  })

  const setBlock    = useSetBlock()
  const changeRole  = useChangeRole()
  const deleteUser  = useDeleteUser()

  const handleSearch = () => { setSearch(inputValue); setPage(1) }

  const openRoleModal = (user: {
    id: string; firstName: string; lastName: string; role: string
  }) => {
    setSelectedRole(user.role)
    setRoleModal({
      isOpen: true,
      userId: user.id,
      userName: `${user.firstName} ${user.lastName}`,
      currentRole: user.role,
    })
  }

  const handleRoleChange = async () => {
    if (!selectedRole || selectedRole === roleModal.currentRole) {
      setRoleModal(m => ({ ...m, isOpen: false }))
      return
    }
    await changeRole.mutateAsync({ id: roleModal.userId, newRole: selectedRole })
    setRoleModal(m => ({ ...m, isOpen: false }))
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">

      {/* Заголовок */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Пользователи</h1>
        <p className="text-sm text-gray-500 mt-1">
          {data?.totalCount ?? 0} пользователей на платформе
        </p>
      </div>

      {/* Фильтры */}
      <div className="flex flex-wrap gap-3 mb-6">
        {/* Поиск */}
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2
            w-4 h-4 text-gray-400 pointer-events-none" />
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Поиск по email или имени..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl
              text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <button
          onClick={handleSearch}
          className="px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm
            font-semibold hover:bg-blue-700 transition-colors"
        >
          Найти
        </button>

        {/* Фильтр по роли */}
        <select
          value={roleFilter ?? ''}
          onChange={(e) => { setRoleFilter(e.target.value || undefined); setPage(1) }}
          className="border border-gray-300 rounded-xl px-3 py-2.5 text-sm
            focus:ring-2 focus:ring-blue-500 outline-none"
        >
          <option value="">Все роли</option>
          {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
        </select>

        {/* Фильтр заблокированных */}
        <select
          value={blockedFilter === undefined ? '' : String(blockedFilter)}
          onChange={(e) => {
            const val = e.target.value
            setBlockedFilter(val === '' ? undefined : val === 'true')
            setPage(1)
          }}
          className="border border-gray-300 rounded-xl px-3 py-2.5 text-sm
            focus:ring-2 focus:ring-blue-500 outline-none"
        >
          <option value="">Все статусы</option>
          <option value="false">Активные</option>
          <option value="true">Заблокированные</option>
        </select>
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
                  <th className="text-left px-4 py-3 text-xs font-semibold
                    text-gray-500 uppercase tracking-wide">
                    Пользователь
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold
                    text-gray-500 uppercase tracking-wide">
                    Роль
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold
                    text-gray-500 uppercase tracking-wide">
                    Рейтинг
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold
                    text-gray-500 uppercase tracking-wide">
                    Услуг / Заказов
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold
                    text-gray-500 uppercase tracking-wide">
                    Статус
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold
                    text-gray-500 uppercase tracking-wide">
                    Дата
                  </th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data?.items.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    {/* Имя и Email */}
                    <td className="px-4 py-3">
                      <Link
                        to={`/profile/${user.id}`}
                        className="font-medium text-gray-900 hover:text-blue-600
                          transition-colors block"
                      >
                        {user.firstName} {user.lastName}
                      </Link>
                      <p className="text-xs text-gray-400">{user.email}</p>
                    </td>

                    {/* Роль */}
                    <td className="px-4 py-3">
                      <Badge variant={roleBadge(user.role)}>{user.role}</Badge>
                    </td>

                    {/* Рейтинг */}
                    <td className="px-4 py-3 text-gray-700">
                      {user.rating > 0
                        ? `★ ${user.rating.toFixed(1)} (${user.reviewCount})`
                        : '—'
                      }
                    </td>

                    {/* Услуг / Заказов */}
                    <td className="px-4 py-3 text-gray-500">
                      {user.gigsCount} / {user.ordersCount}
                    </td>

                    {/* Статус */}
                    <td className="px-4 py-3">
                      {user.isBlocked ? (
                        <Badge variant="red">Заблокирован</Badge>
                      ) : (
                        <Badge variant="green">Активен</Badge>
                      )}
                    </td>

                    {/* Дата */}
                    <td className="px-4 py-3 text-xs text-gray-400">
                      {new Date(user.createdAt).toLocaleDateString('ru-RU')}
                    </td>

                    {/* Кнопки действий */}
                    <td className="px-4 py-3">
                      {user.id !== currentUser?.id && (
                        <div className="flex items-center gap-1">
                          {/* Блокировка */}
                          <button
                            onClick={() => setBlock.mutate({
                              id: user.id, isBlocked: !user.isBlocked
                            })}
                            disabled={setBlock.isPending}
                            title={user.isBlocked ? 'Разблокировать' : 'Заблокировать'}
                            className={`p-2 rounded-lg transition-colors
                              ${user.isBlocked
                                ? 'text-green-600 hover:bg-green-50'
                                : 'text-red-500 hover:bg-red-50'}`}
                          >
                            {user.isBlocked
                              ? <Shield className="w-4 h-4" />
                              : <ShieldOff className="w-4 h-4" />
                            }
                          </button>

                          {/* Смена роли */}
                          <button
                            onClick={() => openRoleModal(user)}
                            title="Изменить роль"
                            className="p-2 text-blue-500 hover:bg-blue-50
                              rounded-lg transition-colors"
                          >
                            <UserCog className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {data?.items.length === 0 && (
            <div className="text-center py-12 text-gray-500 text-sm">
              Пользователи не найдены
            </div>
          )}
        </div>
      )}

      {/* Пагинация */}
      {data && data.totalPages > 1 && (
        <Pagination page={page} totalPages={data.totalPages} onPageChange={setPage} />
      )}

      {/* Модал смены роли */}
      <Modal
        isOpen={roleModal.isOpen}
        onClose={() => setRoleModal(m => ({ ...m, isOpen: false }))}
        title="Изменить роль"
        size="sm"
      >
        <p className="text-sm text-gray-600 mb-4">
          Пользователь: <strong>{roleModal.userName}</strong>
        </p>
        <div className="space-y-2 mb-5">
          {ROLES.map((r) => (
            <label key={r} className={`flex items-center gap-3 p-3 rounded-lg
              border-2 cursor-pointer transition-colors
              ${selectedRole === r
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'}`}>
              <input
                type="radio"
                name="role"
                value={r}
                checked={selectedRole === r}
                onChange={() => setSelectedRole(r)}
                className="sr-only"
              />
              <Badge variant={roleBadge(r)}>{r}</Badge>
            </label>
          ))}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setRoleModal(m => ({ ...m, isOpen: false }))}
            className="flex-1 py-2.5 border border-gray-300 text-gray-700
              rounded-xl text-sm font-semibold hover:bg-gray-50"
          >
            Отмена
          </button>
          <button
            onClick={handleRoleChange}
            disabled={changeRole.isPending}
            className="flex-1 py-2.5 bg-blue-600 text-white rounded-xl text-sm
              font-semibold hover:bg-blue-700 disabled:opacity-60"
          >
            {changeRole.isPending ? 'Сохраняем...' : 'Сохранить'}
          </button>
        </div>
      </Modal>

    </div>
  )
}