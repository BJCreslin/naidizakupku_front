interface RussianEmblemProps {
  size?: number
  className?: string
}

export function RussianEmblem({ size = 32, className = "" }: RussianEmblemProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Двуглавый орел - тело */}
      <path
        d="M24 20c-6 0-12 4-12 8v12c0 2 2 4 4 4h16c2 0 4-2 4-4V28c0-4-6-8-12-8z"
        fill="#FFD700"
        stroke="#B8860B"
        strokeWidth="0.5"
      />
      
      {/* Левое крыло */}
      <path
        d="M12 24c-4-2-8-1-10 2-2 3-1 6 2 8l8-10z"
        fill="#FFD700"
        stroke="#B8860B"
        strokeWidth="0.5"
      />
      
      {/* Правое крыло */}
      <path
        d="M36 24c4-2 8-1 10 2 2 3 1 6-2 8l-8-10z"
        fill="#FFD700"
        stroke="#B8860B"
        strokeWidth="0.5"
      />
      
      {/* Левая голова */}
      <circle cx="18" cy="18" r="4" fill="#FFD700" stroke="#B8860B" strokeWidth="0.5" />
      <circle cx="16" cy="17" r="1" fill="#000" />
      <path d="M14 20 L12 22" stroke="#B8860B" strokeWidth="1" />
      
      {/* Правая голова */}
      <circle cx="30" cy="18" r="4" fill="#FFD700" stroke="#B8860B" strokeWidth="0.5" />
      <circle cx="32" cy="17" r="1" fill="#000" />
      <path d="M34 20 L36 22" stroke="#B8860B" strokeWidth="1" />
      
      {/* Центральные короны */}
      <path
        d="M16 12 L18 8 L20 12 L18 14 Z"
        fill="#FFD700"
        stroke="#B8860B"
        strokeWidth="0.5"
      />
      <path
        d="M28 12 L30 8 L32 12 L30 14 Z"
        fill="#FFD700"
        stroke="#B8860B"
        strokeWidth="0.5"
      />
      <path
        d="M22 8 L24 4 L26 8 L24 10 Z"
        fill="#FFD700"
        stroke="#B8860B"
        strokeWidth="0.5"
      />
      
      {/* Красный щит в центре */}
      <rect
        x="20"
        y="24"
        width="8"
        height="10"
        rx="1"
        fill="#DC143C"
        stroke="#8B0000"
        strokeWidth="0.5"
      />
      
      {/* Святой Георгий (упрощенный) */}
      <circle cx="22" cy="27" r="1" fill="#FFF" />
      <rect x="21.5" y="28" width="1" height="3" fill="#FFF" />
      <circle cx="26" cy="30" r="1.5" fill="#FFF" />
      <rect x="25" y="31" width="2" height="2" fill="#FFF" />
      
      {/* Скипетр и держава */}
      <line x1="8" y1="30" x2="6" y2="36" stroke="#FFD700" strokeWidth="1" />
      <circle cx="6" cy="36" r="1.5" fill="#FFD700" />
      <line x1="40" y1="30" x2="42" y2="36" stroke="#FFD700" strokeWidth="1" />
      <circle cx="42" cy="36" r="1.5" fill="#FFD700" />
    </svg>
  )
} 