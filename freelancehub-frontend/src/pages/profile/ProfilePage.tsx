import { useParams } from 'react-router-dom'

// Заглушка — полная реализация будет на День 6
export default function ProfilePage() {
  const { id } = useParams<{ id: string }>()

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Профиль пользователя
      </h1>
      <p className="text-gray-500 text-sm">ID: {id}</p>
      <p className="text-gray-500 mt-2">Страница профиля — будет реализована на День 6</p>
    </div>
  )
}