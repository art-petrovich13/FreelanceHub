import type { LucideIcon } from 'lucide-react'

interface StatCardProps {
  label:      string
  value:      number
  icon:       LucideIcon
  color:      'blue' | 'green' | 'purple' | 'orange' | 'red' | 'yellow'
  sub?:       string    // Подсказка под значением
  trend?:     number    // Новых за неделю
}

const colorMap = {
  blue:   { bg: 'bg-blue-500',   light: 'bg-blue-50',   text: 'text-blue-600'   },
  green:  { bg: 'bg-green-500',  light: 'bg-green-50',  text: 'text-green-600'  },
  purple: { bg: 'bg-purple-500', light: 'bg-purple-50', text: 'text-purple-600' },
  orange: { bg: 'bg-orange-500', light: 'bg-orange-50', text: 'text-orange-600' },
  red:    { bg: 'bg-red-500',    light: 'bg-red-50',    text: 'text-red-600'    },
  yellow: { bg: 'bg-yellow-500', light: 'bg-yellow-50', text: 'text-yellow-600' },
}

export default function StatCard({
  label,
  value,
  icon: Icon,
  color,
  sub,
  trend,
}: StatCardProps) {
  const c = colorMap[color]

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5
      hover:shadow-sm transition-shadow">
      <div className="flex items-start justify-between gap-3">
        {/* Иконка */}
        <div className={`p-3 rounded-xl ${c.light} shrink-0`}>
          <Icon className={`w-6 h-6 ${c.text}`} />
        </div>

        {/* Тренд за неделю */}
        {trend !== undefined && trend > 0 && (
          <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
            +{trend} за неделю
          </span>
        )}
      </div>

      <div className="mt-4">
        <p className="text-3xl font-bold text-gray-900">{value.toLocaleString()}</p>
        <p className="text-sm font-medium text-gray-600 mt-0.5">{label}</p>
        {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
      </div>
    </div>
  )
}