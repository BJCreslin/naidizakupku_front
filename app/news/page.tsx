import { NewsList } from '@/components/news-list'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Новости | НайдиЗакупку',
  description: 'Последние новости о государственных закупках и изменениях в законодательстве',
}

export default function NewsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Заголовок страницы */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Новости закупок
          </h1>
          <p className="text-muted-foreground">
            Следите за последними изменениями в сфере государственных закупок
          </p>
        </div>

        {/* Список новостей */}
        <NewsList />
      </div>
    </div>
  )
} 