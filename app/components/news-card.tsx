import type { News } from '@/types/news'
import { ExternalLink, Calendar } from 'lucide-react'
import { NewsLogo } from './news-logo'

interface NewsCardProps {
  news: News
}

export function NewsCard({ news }: NewsCardProps) {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Дата не указана'
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    } catch {
      return 'Неверная дата'
    }
  }

  return (
    <article className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start space-x-4">
        {/* Логотип новостей */}
        <div className="flex-shrink-0">
          <NewsLogo size={48} />
        </div>
        
        <div className="flex-1 min-w-0">
          {/* Заголовок */}
          <h3 className="text-lg font-semibold text-foreground mb-2 line-clamp-2">
            {news.title}
          </h3>
          
          {/* Дата публикации */}
          <div className="flex items-center text-muted-foreground text-sm mb-3">
            <Calendar size={16} className="mr-1" />
            <time dateTime={news.publicationDate || undefined}>
              {formatDate(news.publicationDate)}
            </time>
          </div>
          
          {/* Содержание */}
          {news.content && (
            <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
              {news.content}
            </p>
          )}
          
          {/* Ссылка на источник */}
          <a
            href={news.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-primary hover:text-primary/80 text-sm font-medium transition-colors"
          >
            Читать полностью
            <ExternalLink size={14} className="ml-1" />
          </a>
        </div>
      </div>
    </article>
  )
} 