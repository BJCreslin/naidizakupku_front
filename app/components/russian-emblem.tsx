import Image from 'next/image'

interface RussianEmblemProps {
  size?: number
  className?: string
}

export function RussianEmblem({ size = 32, className = "" }: RussianEmblemProps) {
  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      {/* Временная заглушка с эмодзи пока нет изображения */}
      <div 
        className="w-full h-full flex items-center justify-center bg-yellow-400 rounded"
        style={{ fontSize: size * 0.6 }}
      >
        🦅
      </div>
      
      {/* Когда будет изображение, раскомментировать этот код:
      <Image
        src="/russian-emblem.png"
        alt="Герб России"
        width={size}
        height={size}
        className="object-contain"
      />
      */}
    </div>
  )
} 