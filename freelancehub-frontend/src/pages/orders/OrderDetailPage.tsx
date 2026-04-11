import { useParams } from 'react-router-dom'

// Заглушка — полная реализация будет на День 5
export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>()

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Заказ #{id}
      </h1>
      <p className="text-gray-500">Детальная страница заказа — будет реализована на День 5</p>
    </div>
  )
}