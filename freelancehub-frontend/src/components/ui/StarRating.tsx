import { Star } from 'lucide-react'

interface StarRatingProps {
  value:     number
  max?:      number
  size?:     'sm' | 'md' | 'lg'
  onChange?: (value: number) => void  // undefined = только просмотр
  className?: string
}

const sizeMap = {
  sm: 'w-3.5 h-3.5',
  md: 'w-5 h-5',
  lg: 'w-7 h-7',
}

export default function StarRating({
  value,
  max = 5,
  size = 'md',
  onChange,
  className = '',
}: StarRatingProps) {
  const starSize = sizeMap[size]
  const isInteractive = !!onChange

  return (
    <div className={`flex items-center gap-0.5 ${className}`}>
      {Array.from({ length: max }, (_, i) => i + 1).map((star) => (
        <Star
          key={star}
          className={`
            ${starSize}
            transition-colors duration-100
            ${star <= value
              ? 'text-yellow-400 fill-yellow-400'
              : 'text-gray-300'
            }
            ${isInteractive
              ? 'cursor-pointer hover:text-yellow-400 hover:fill-yellow-400'
              : ''
            }
          `}
          onClick={() => onChange?.(star)}
        />
      ))}
    </div>
  )
}