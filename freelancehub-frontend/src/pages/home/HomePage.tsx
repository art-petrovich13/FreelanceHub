export default function HomePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">
        FreeLanceHub
      </h1>
      <p className="text-xl text-gray-600 mb-8">
        Биржа фриланс-услуг для студентов
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
          <h2 className="text-lg font-semibold text-blue-900 mb-2">
            Для студентов
          </h2>
          <p className="text-blue-700 text-sm">
            Публикуйте свои услуги и находите заказчиков
          </p>
        </div>
        <div className="bg-green-50 rounded-xl p-6 border border-green-100">
          <h2 className="text-lg font-semibold text-green-900 mb-2">
            Для работодателей
          </h2>
          <p className="text-green-700 text-sm">
            Публикуйте задания и нанимайте студентов
          </p>
        </div>
      </div>
    </div>
  )
}