import { NextResponse } from 'next/server'
import type { News, NewsResponse } from '@/types/news'
import { NewsType } from '@/types/news'
import { API_URLS, API_CONFIG, buildApiUrl } from '@/config/api'
import { BACKEND_URLS } from '@/config/backend-urls'
import { ApiHelpers } from '@/utils/api-helpers'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const revalidate = 0

// Fallback данные на случай недоступности API
const getFallbackNews = (): News[] => [
  {
    id: 1,
    title: "Изменения в федеральном законе о контрактной системе",
    url: BACKEND_URLS.EXTERNAL_APIS.ZAKUPKI_GOV.NEWS.NEWS_1,
    publicationDate: "2024-01-15T10:30:00",
    content: "Внесены важные изменения в порядок проведения государственных закупок...",
    newsType: NewsType.GENERAL,
    createdAt: "2024-01-15T10:30:00",
    updatedAt: "2024-01-15T10:30:00",
    createdBy: "system",
    updatedBy: null,
    comment: null
  },
  {
    id: 2,
    title: "Новые требования к поставщикам в 2024 году",
    url: BACKEND_URLS.EXTERNAL_APIS.ZAKUPKI_GOV.NEWS.NEWS_2,
    publicationDate: "2024-01-14T14:20:00",
    content: "С 1 февраля вступают в силу обновленные требования к участникам закупок...",
    newsType: NewsType.GENERAL,
    createdAt: "2024-01-14T14:20:00",
    updatedAt: "2024-01-14T14:20:00",
    createdBy: "system",
    updatedBy: null,
    comment: null
  },
  {
    id: 3,
    title: "Планируемые технические работы на портале",
    url: BACKEND_URLS.EXTERNAL_APIS.ZAKUPKI_GOV.NEWS.NEWS_3,
    publicationDate: "2024-01-13T16:45:00",
    content: "Уведомляем о плановых технических работах на Единой информационной системе...",
    newsType: NewsType.GENERAL,
    createdAt: "2024-01-13T16:45:00",
    updatedAt: "2024-01-13T16:45:00",
    createdBy: "system",
    updatedBy: null,
    comment: null
  }
]

export async function GET() {
  try {
    console.log('Fetching news from backend...')
    
    // Подготавливаем список кандидатов URL бэкенда (первый успешный используется)
    const candidateUrls: string[] = []
    const envBase = process.env.BACKEND_BASE_URL
    if (envBase) candidateUrls.push(`${envBase}/news/top`)
    // Локальный бэкенд по умолчанию (согласно nginx-* конфигу)
    candidateUrls.push(`${BACKEND_URLS.DOMAINS.LOCALHOST}${BACKEND_URLS.API_PATHS.MAIN}/news/top`)
    // Внешний бэкенд API через nginx (правильный путь)
    candidateUrls.push(`${BACKEND_URLS.DOMAINS.PRODUCTION}${BACKEND_URLS.API_PATHS.BACKEND}/news/top`)

    let apiResponse: Response | null = null
    let lastError: unknown = null
    
    for (const url of candidateUrls) {
      try {
        console.log('Trying backend URL:', url)
        const res = await fetch(url, {
          method: 'GET',
          headers: API_CONFIG.DEFAULT_HEADERS,
          cache: 'no-store',
          // Добавляем timeout для предотвращения зависания
          signal: AbortSignal.timeout(5000) // 5 секунд timeout
        })
        
        if (res.ok) {
          apiResponse = res
          console.log('Successfully fetched from:', url)
          break
        }
        
        lastError = new Error(`HTTP ${res.status}: ${res.statusText}`)
        console.log('Failed to fetch from:', url, 'Status:', res.status)
      } catch (e) {
        lastError = e
        console.log('Error fetching from:', url, 'Error:', e instanceof Error ? e.message : String(e))
      }
    }

    if (!apiResponse) {
      console.warn('All backend URLs failed, using fallback data')
      const fallbackNews = getFallbackNews()
      const response: NewsResponse = {
        data: fallbackNews,
        total: fallbackNews.length
      }
      return NextResponse.json(response)
    }

    const data: News[] = await apiResponse.json()
    console.log('Backend data received:', data.length, 'items')
    
    const response: NewsResponse = {
      data: data,
      total: data.length
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error fetching news from backend, using fallback data:', error)
    
    // Всегда возвращаем fallback данные вместо ошибки
    const fallbackNews = getFallbackNews()
    const response: NewsResponse = {
      data: fallbackNews,
      total: fallbackNews.length
    }

    return NextResponse.json(response)
  }
} 