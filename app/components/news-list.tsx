'use client'

import { useState, useEffect, useRef } from 'react'
import type { News, NewsResponse } from '@/types/news'
import { NewsCard } from './news-card'
import { Loading } from './loading'

interface NewsListProps {
  className?: string
}

export function NewsList({ className }: NewsListProps) {
  const [news, setNews] = useState<News[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const hasFetched = useRef(false)

  useEffect(() => {
    // Предотвращаем дублирование запросов в React.StrictMode
    if (hasFetched.current) return
    hasFetched.current = true

    async function fetchNews() {
      try {
        setIsLoading(true)
        setError(null)
        
        const response = await fetch('/api/news/top')
        if (!response.ok) {
          throw new Error('Не удалось загрузить новости')
        }
        
        const data: NewsResponse = await response.json()
        setNews(data.data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Произошла неизвестная ошибка')
      } finally {
        setIsLoading(false)
      }
    }

    fetchNews()
  }, [])

  if (isLoading) {
    return (
      <div className={className}>
        <Loading />
      </div>
    )
  }

  if (error) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <p className="text-destructive">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
        >
          Повторить попытку
        </button>
      </div>
    )
  }

  if (news.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <p className="text-muted-foreground">Новости не найдены</p>
      </div>
    )
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {news.map((item) => (
        <NewsCard key={item.id} news={item} />
      ))}
    </div>
  )
} 