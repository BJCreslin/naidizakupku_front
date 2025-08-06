import type { Metadata } from 'next'
import Link from 'next/link'

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
          <p className="text-muted-foreground mb-8">
            Личный кабинет находится в разработке
          </p>
          
          <div className="space-y-6">
            <div className="w-16 h-16 bg-muted rounded-full mx-auto flex items-center justify-center mb-6">
              <span className="text-2xl">👤</span>
            </div>
            
            <div className="bg-card border rounded-lg p-6 max-w-md mx-auto">
              <h2 className="text-lg font-semibold mb-3 text-center">
                Поиск закупок
              </h2>
              <p className="text-sm text-muted-foreground mb-4 text-center">
                Найдите актуальные государственные закупки и тендеры
              </p>
              <Link
                href="https://zakupki.gov.ru/epz/order/extendedsearch/results.html"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-3 rounded-md font-medium transition-colors duration-200 flex items-center justify-center gap-2"
              >
                <span>🔍</span>
                Перейти к поиску закупок
                <span className="text-xs opacity-75">↗</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 