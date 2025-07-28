import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Мои закупки | НайдиЗакупку',
  description: 'Личный кабинет для управления вашими закупками и участием в тендерах',
}

export default function MyPurchasesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center py-16">
          <h1 className="text-3xl font-bold text-foreground mb-4">
            Мои закупки
          </h1>
          <p className="text-muted-foreground mb-6">
            Личный кабинет находится в разработке
          </p>
          <div className="w-16 h-16 bg-muted rounded-full mx-auto flex items-center justify-center">
            <span className="text-2xl">👤</span>
          </div>
        </div>
      </div>
    </div>
  )
} 