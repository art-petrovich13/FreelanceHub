import { useAuthStore } from '../../store/authStore'

// Заглушка — полная реализация будет на День 8
export default function StudentDashboard() {
  const user = useAuthStore((s) => s.user)

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">
        Личный кабинет студента
      </h1>
      <p className="text-gray-600 mb-6">
        Добро пожаловать, {user?.firstName} {user?.lastName}!
      </p>
      <p className="text-gray-500">Дашборд студента — будет реализован на День 8</p>
    </div>
  )
}