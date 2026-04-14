import { useState, useRef, useEffect } from 'react'
import { Bell, CheckCheck, Trash2, X } from 'lucide-react'
import {
  useNotifications,
  useUnreadCount,
  useMarkRead,
  useMarkAllRead,
  useDeleteNotification,
} from '../../hooks/useNotifications'
import type { Notification } from '../../types/notification.types'
import Spinner from '../ui/Spinner'

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)

  const { data: unreadData }              = useUnreadCount()
  const { data: notifications, isLoading } = useNotifications()
  const markRead       = useMarkRead()
  const markAllRead    = useMarkAllRead()
  const deleteNotif    = useDeleteNotification()

  const unreadCount = unreadData?.count ?? 0

  // Закрываем панель при клике вне её
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleNotificationClick = (notif: Notification) => {
    if (!notif.isRead) {
      markRead.mutate(notif.id)
    }
  }

  // Форматируем дату
  const formatDate = (dateStr: string) => {
    const date  = new Date(dateStr)
    const now   = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMin = Math.floor(diffMs / 60000)
    const diffH   = Math.floor(diffMin / 60)
    const diffD   = Math.floor(diffH / 24)

    if (diffMin < 1)  return 'только что'
    if (diffMin < 60) return `${diffMin} мин. назад`
    if (diffH < 24)   return `${diffH} ч. назад`
    if (diffD < 7)    return `${diffD} дн. назад`
    return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })
  }

  return (
    <div className="relative" ref={panelRef}>

      {/* Кнопка-колокольчик */}
      <button
        onClick={() => setIsOpen((o) => !o)}
        className="relative p-2 text-gray-500 hover:text-gray-900
          hover:bg-gray-100 rounded-xl transition-colors"
        title="Уведомления"
      >
        <Bell className="w-5 h-5" />
        {/* Бейдж с количеством */}
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px]
            bg-red-500 text-white text-[10px] font-bold rounded-full
            flex items-center justify-center px-1 leading-none">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Панель уведомлений */}
      {isOpen && (
        <div className="absolute right-0 top-12 w-80 bg-white rounded-2xl
          shadow-xl border border-gray-200 z-50 overflow-hidden">

          {/* Шапка панели */}
          <div className="flex items-center justify-between px-4 py-3
            border-b border-gray-100">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-gray-900 text-sm">Уведомления</h3>
              {unreadCount > 0 && (
                <span className="text-xs bg-red-100 text-red-600 font-medium
                  px-1.5 py-0.5 rounded-full">
                  {unreadCount}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              {/* Прочитать все */}
              {unreadCount > 0 && (
                <button
                  onClick={() => markAllRead.mutate()}
                  disabled={markAllRead.isPending}
                  title="Прочитать все"
                  className="p-1.5 text-gray-400 hover:text-blue-600
                    hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <CheckCheck className="w-4 h-4" />
                </button>
              )}
              {/* Закрыть */}
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-gray-400 hover:text-gray-600
                  hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Список уведомлений */}
          <div className="max-h-80 overflow-y-auto">
            {isLoading && (
              <div className="flex justify-center py-8">
                <Spinner size="sm" />
              </div>
            )}

            {!isLoading && (!notifications || notifications.length === 0) && (
              <div className="text-center py-10 text-gray-400 text-sm">
                <Bell className="w-8 h-8 mx-auto mb-2 opacity-30" />
                Нет уведомлений
              </div>
            )}

            {!isLoading && notifications?.map((notif) => (
              <div
                key={notif.id}
                onClick={() => handleNotificationClick(notif)}
                className={`group px-4 py-3 border-b border-gray-50 last:border-0
                  cursor-pointer transition-colors hover:bg-gray-50
                  ${!notif.isRead ? 'bg-blue-50' : ''}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    {/* Индикатор непрочитанного */}
                    <div className="flex items-center gap-1.5">
                      {!notif.isRead && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full shrink-0" />
                      )}
                      <p className={`text-sm leading-snug
                        ${!notif.isRead
                          ? 'font-semibold text-gray-900'
                          : 'font-medium text-gray-700'}`}>
                        {notif.title}
                      </p>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5 line-clamp-2 leading-relaxed">
                      {notif.message}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {formatDate(notif.createdAt)}
                    </p>
                  </div>

                  {/* Кнопка удаления (показывается при hover) */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      deleteNotif.mutate(notif.id)
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 text-gray-300
                      hover:text-red-500 rounded transition-all shrink-0"
                    title="Удалить"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}
    </div>
  )
}