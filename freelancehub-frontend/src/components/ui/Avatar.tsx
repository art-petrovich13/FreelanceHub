interface AvatarProps {
  src?:       string | null
  name:       string          // Используется для генерации инициалов
  size?:      'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

const sizeMap = {
  sm:  'w-8  h-8  text-xs',
  md:  'w-11 h-11 text-sm',
  lg:  'w-16 h-16 text-base',
  xl:  'w-24 h-24 text-2xl',
}

/**
 * Инициалы генерируются из первых букв слов имени.
 * "Иван Петров" → "ИП"
 * "Иван" → "И"
 */
function getInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .map(part => part[0]?.toUpperCase() ?? '')
    .slice(0, 2)
    .join('')
}

export default function Avatar({ src, name, size = 'md', className = '' }: AvatarProps) {
  const sizeClass = sizeMap[size]
  const initials  = getInitials(name)

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={`${sizeClass} rounded-full object-cover shrink-0 ${className}`}
      />
    )
  }

  return (
    <div
      className={`${sizeClass} rounded-full bg-blue-600 text-white
        flex items-center justify-center font-bold shrink-0 ${className}`}
    >
      {initials}
    </div>
  )
}