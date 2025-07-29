interface NewsLogoProps {
  size?: number
  className?: string
}

export function NewsLogo({ size = 32, className = "" }: NewsLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Фон */}
      <rect width="48" height="48" rx="8" fill="#1e40af" />
      
      {/* Документ */}
      <rect x="10" y="8" width="22" height="28" rx="2" fill="#ffffff" />
      <rect x="10" y="8" width="22" height="6" rx="2" fill="#3b82f6" />
      
      {/* Заголовок новости */}
      <rect x="13" y="10" width="16" height="2" rx="1" fill="#ffffff" />
      
      {/* Строки текста */}
      <rect x="13" y="18" width="16" height="1.5" rx="0.75" fill="#94a3b8" />
      <rect x="13" y="21" width="14" height="1.5" rx="0.75" fill="#94a3b8" />
      <rect x="13" y="24" width="18" height="1.5" rx="0.75" fill="#94a3b8" />
      <rect x="13" y="27" width="12" height="1.5" rx="0.75" fill="#94a3b8" />
      
      {/* Иконка новостей */}
      <circle cx="40" cy="12" r="6" fill="#ef4444" />
      <rect x="37" y="9" width="6" height="6" rx="1" fill="#ffffff" />
      <rect x="38" y="10" width="4" height="1" fill="#ef4444" />
      <rect x="38" y="12" width="3" height="0.5" fill="#ef4444" />
      <rect x="38" y="13.5" width="2.5" height="0.5" fill="#ef4444" />
      
      {/* Декоративные элементы */}
      <circle cx="15" cy="32" r="1.5" fill="#3b82f6" />
      <circle cx="19" cy="32" r="1.5" fill="#10b981" />
      <circle cx="23" cy="32" r="1.5" fill="#f59e0b" />
      
      {/* Блик */}
      <rect x="10" y="8" width="8" height="3" rx="1" fill="url(#shine)" opacity="0.3" />
      
      <defs>
        <linearGradient id="shine" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  )
} 